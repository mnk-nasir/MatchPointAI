from typing import Any, Dict, List
from django.db.models import Count, Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status

from core.models import StartupEvaluation
from core.models.ingestion import NewsArticle, SocialSignal
from core.models.enrichment import FundingEvent
from core.models.matching import StartupInvestorMatch
from core.models.user import InvestorProfile
from core.services.ai_scoring.engine import calculate_startup_score


class InvestorDashboardStatsAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        total = StartupEvaluation.objects.count()
        # Treat strong and high potential as "AI matched" for now
        ai_matched = StartupEvaluation.objects.filter(
            rating__in=[StartupEvaluation.Rating.STRONG, StartupEvaluation.Rating.HIGH_POTENTIAL]
        ).count()
        # Placeholders until watchlist/meetings features exist
        saved = 0
        meetings = 0

        # Use stage as a proxy for sector until sector taxonomy exists
        by_stage = (
            StartupEvaluation.objects.values("stage")
            .annotate(count=Count("id"))
            .order_by("stage")
        )
        sectors: List[Dict[str, Any]] = [
            {"name": row["stage"], "count": row["count"]} for row in by_stage
        ]

        by_rating = (
            StartupEvaluation.objects.values("rating")
            .annotate(count=Count("id"))
            .order_by("rating")
        )
        total_for_buckets = sum(r["count"] for r in by_rating) or 1
        risk_buckets = [
            {
                "label": (r["rating"] or "UNKNOWN"),
                "count": r["count"],
                "percent": round((r["count"] / total_for_buckets) * 100, 2),
            }
            for r in by_rating
        ]

        data = {
            "total_startups": total,
            "ai_matched": ai_matched,
            "saved": saved,
            "meetings": meetings,
            "sectors": sectors,
            "risk_buckets": risk_buckets,
        }
        return Response(data, status=status.HTTP_200_OK)


class StartupsListAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            limit = int(request.query_params.get("limit", "5"))
        except ValueError:
            limit = 5
        qs = StartupEvaluation.objects.order_by("-created_at")[:limit]
        rows: List[Dict[str, Any]] = []
        for e in qs:
            # Extract optional industry and funding ask from form_data if present
            industry = None
            funding_ask = None
            logo_url = None
            try:
                fd = e.form_data or {}
                s1 = fd.get("step1") or {}
                s2 = fd.get("step2") or {}
                s3 = fd.get("step3") or {}
                s6 = fd.get("step6") or {}

                funding_ask = s6.get("amountRaising")
                logo_url = s1.get("companyLogoUrl")

                # Try every common field name across all steps
                industry = (
                    s1.get("sector")
                    or s1.get("industry")
                    or s1.get("industryType")
                    or s2.get("sector")
                    or s2.get("industry")
                    or s2.get("industryType")
                    or s2.get("industryFocus")
                    or s3.get("sector")
                    or s3.get("industry")
                    or s3.get("industryType")
                    or None
                )
            except Exception:
                pass
            rows.append(
                {
                    "id": str(e.id),
                    "name": e.company_name,
                    "industry": industry,
                    "funding_ask": funding_ask,
                    "risk_score": e.total_score,
                    "logo_url": logo_url,
                }
            )
        return Response({"results": rows}, status=status.HTTP_200_OK)


class AIOpportunitiesAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Fetch up to 10 latest evaluations
        qs = StartupEvaluation.objects.order_by("-created_at")[:10]
        rows: List[Dict[str, Any]] = []
        
        # Build mock investor data from the request user if applicable
        investor_data = {}
        if request.user.is_authenticated:
            # We don't have explicit models for industry preferences yet, so we mock or extract what we can
            investor_data["preferred_industry"] = "Technology" # Mock default
            
        for e in qs:
            fd = e.form_data or {}
            s1 = fd.get("step1") or {}
            s2 = fd.get("step2") or {}
            s3 = fd.get("step3") or {}
            s4 = fd.get("step4") or {}
            s5 = fd.get("step5") or {}
            s6 = fd.get("step6") or {}
            
            industry = (
                s1.get("sector")
                or s1.get("industry")
                or s1.get("industryType")
                or s2.get("sector")
                or s2.get("industry")
                or s2.get("industryType")
                or s2.get("industryFocus")
                or s3.get("sector")
                or s3.get("industry")
                or s3.get("industryType")
                or None
            )
            
            # The new AI Scoring Engine accepts a raw StartupEvaluation instance directly
            scores = calculate_startup_score(e)
            
            rows.append({
                "id": str(e.id),
                "name": e.company_name,
                "industry": industry,
                "stage": e.stage,
                "opportunity_score": scores.get("opportunityScore", 50),
                "risk_score": scores.get("riskScore", 50),
                "investment_fit": "Strong" if scores.get("opportunityScore", 0) > 70 else "Medium",
                "logo_url": s1.get("companyLogoUrl")
            })
            
        # Sort by opportunity score descending
        rows.sort(key=lambda x: x["opportunity_score"], reverse=True)
        # Return top 3 matches
        top_rows = rows[:3]
        return Response({"results": top_rows}, status=status.HTTP_200_OK)


# ─────────────────────────────────────────────────────────────────────────────
# GET /api/v1/investor/trending-startups
# ─────────────────────────────────────────────────────────────────────────────
class TrendingStartupsAPIView(APIView):
    """
    Returns startups trending based on market_momentum and recent news activity.
    Combines High momentum startups with those that have recent news coverage.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            limit = min(int(request.query_params.get("limit", "6")), 20)
        except ValueError:
            limit = 6

        # Get startups with High market momentum first
        high_momentum = StartupEvaluation.objects.filter(
            market_momentum__iexact="High"
        ).order_by("-opportunity_score")[:limit]

        results: List[Dict[str, Any]] = []
        seen_ids = set()

        for e in high_momentum:
            seen_ids.add(str(e.id))
            fd = e.form_data or {}
            s1 = fd.get("step1") or {}
            industry = s1.get("sector") or s1.get("industry") or None

            # Count recent news articles as "buzz score"
            news_count = NewsArticle.objects.filter(
                company_name__icontains=e.company_name
            ).count()

            # Latest social signal
            signal = SocialSignal.objects.filter(
                company_name__icontains=e.company_name
            ).order_by("-collected_at").first()

            results.append({
                "id": str(e.id),
                "company_name": e.company_name,
                "stage": e.stage,
                "industry": industry,
                "logo_url": s1.get("companyLogoUrl"),
                "market_momentum": e.market_momentum,
                "opportunity_score": e.opportunity_score,
                "news_count": news_count,
                "sentiment_score": signal.sentiment_score if signal else None,
                "mentions": signal.mentions if signal else 0,
            })

        # Pad with high opportunity score startups if fewer than limit
        if len(results) < limit:
            fallback_qs = StartupEvaluation.objects.exclude(
                id__in=list(seen_ids)
            ).order_by("-opportunity_score")[: limit - len(results)]

            for e in fallback_qs:
                fd = e.form_data or {}
                s1 = fd.get("step1") or {}
                industry = s1.get("sector") or s1.get("industry") or None
                results.append({
                    "id": str(e.id),
                    "company_name": e.company_name,
                    "stage": e.stage,
                    "industry": industry,
                    "logo_url": s1.get("companyLogoUrl"),
                    "market_momentum": e.market_momentum or "Medium",
                    "opportunity_score": e.opportunity_score,
                    "news_count": 0,
                    "sentiment_score": None,
                    "mentions": 0,
                })

        return Response({"count": len(results), "results": results}, status=status.HTTP_200_OK)


# ─────────────────────────────────────────────────────────────────────────────
# GET /api/v1/investor/recent-funding
# ─────────────────────────────────────────────────────────────────────────────
class RecentFundingEventsAPIView(APIView):
    """
    Returns recent funding events from the FundingEvent table (Enrichment Engine output).
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            limit = min(int(request.query_params.get("limit", "8")), 30)
        except ValueError:
            limit = 8

        events = FundingEvent.objects.select_related("startup").order_by(
            "-announced_on", "-created_at"
        )[:limit]

        results = []
        for ev in events:
            results.append({
                "id": str(ev.id),
                "company_name": ev.startup.company_name,
                "industry": ev.startup.industry or None,
                "round_name": ev.round_name,
                "amount": float(ev.amount) if ev.amount else None,
                "currency": ev.currency,
                "announced_on": ev.announced_on.isoformat() if ev.announced_on else None,
                "source_url": ev.source_url,
            })

        return Response({"count": len(results), "results": results}, status=status.HTTP_200_OK)


# ─────────────────────────────────────────────────────────────────────────────
# GET /api/v1/investor/my-matches
# ─────────────────────────────────────────────────────────────────────────────
class InvestorMatchesForInvestorAPIView(APIView):
    """
    Returns startups recommended for the currently logged-in investor.
    Reads from the StartupInvestorMatch table — rows where investor = request.user.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            limit = min(int(request.query_params.get("limit", "6")), 20)
        except ValueError:
            limit = 6

        try:
            profile = InvestorProfile.objects.get(user=request.user)
        except InvestorProfile.DoesNotExist:
            return Response({"count": 0, "results": [], "message": "No investor profile found for this user."}, status=status.HTTP_200_OK)

        matches = StartupInvestorMatch.objects.filter(
            investor=profile
        ).select_related("startup").order_by("-match_score")[:limit]

        results = []
        for m in matches:
            s = m.startup
            fd = s.form_data or {}
            s1 = fd.get("step1") or {}
            industry = s1.get("sector") or s1.get("industry") or None
            results.append({
                "id": str(s.id),
                "company_name": s.company_name,
                "stage": s.stage,
                "country": s.country,
                "industry": industry,
                "logo_url": s1.get("companyLogoUrl"),
                "match_score": m.match_score,
                "rationale": m.rationale,
                "opportunity_score": s.opportunity_score,
                "risk_score": s.risk_score,
            })

        return Response({"count": len(results), "results": results}, status=status.HTTP_200_OK)

