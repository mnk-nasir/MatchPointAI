from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from core.views.evaluation_views import (
    CreateEvaluationAPIView,
    SubmitFullEvaluationAPIView,
    UserEvaluationListAPIView,
    EvaluationDetailAPIView,
    AnalyticsSummaryAPIView
)
from core.views.auth_views import RegisterView, CustomTokenObtainPairView, MeView, ForgotPasswordView, ResetPasswordView
from core.views.ai_views import AINarrativeAPIView
from core.views.leads_views import InvestorInterestAPIView, AcceleratorInterestAPIView
from core.views.admin_investor_views import (
    InvestorAdminListCreateAPIView,
    InvestorFromLeadAPIView,
    InvestorAdminDetailAPIView,
    AdminStartupDetailAPIView
)
from core.views.investor_views import (
    InvestorDashboardStatsAPIView, StartupsListAPIView, AIOpportunitiesAPIView,
    TrendingStartupsAPIView, RecentFundingEventsAPIView, InvestorMatchesForInvestorAPIView
)
from core.views.chat_views import InvestorChatAPIView, InvestorChatStreamAPIView, InvestorChatSessionsAPIView, InvestorChatSessionDetailAPIView, AIHealthAPIView
from core.views.deals_views import (
    WatchlistListCreateAPIView, WatchlistDestroyAPIView,
    PipelineStageListCreateAPIView, PipelineStageUpdateAPIView,
    ContactListCreateAPIView, ContactDetailAPIView
)
from core.views.match_views import StartupMatchAPIView
from core.views.ingestion_views import (
    NewsArticleListAPIView, CompanyRegistryListAPIView,
    SocialSignalListAPIView, IngestionStatusAPIView, TriggerIngestionAPIView
)
from core.views.enrichment_views import (
    EnrichedStartupListAPIView, EnrichmentTestAPIView
)
from core.views.scoring_views import CalculateStartupScoreAPIView
from core.views.intelligence_views import MarketIntelligenceAPIView, InvestorMatchesAPIView
from core.views.startup_views import (
    StartupListAPIView,
    StartupDetailAPIView,
    AIOpportunitiesIntelligenceAPIView,
    StartupMatchesAPIView,
    StartupNewsAPIView,
)

from core.views.gdpr_views import DataExportView, AccountDeletionView

urlpatterns = [
    # Auth Endpoints
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', MeView.as_view(), name='auth_me'),
    path('auth/forgot-password/', ForgotPasswordView.as_view(), name='auth_forgot_password'),
    path('auth/reset-password/', ResetPasswordView.as_view(), name='auth_reset_password'),

    # GDPR Endpoints
    path('auth/gdpr/export/', DataExportView.as_view(), name='gdpr_export'),
    path('auth/gdpr/delete/', AccountDeletionView.as_view(), name='gdpr_delete'),

    # Evaluation Endpoints
    path('evaluations/create/', CreateEvaluationAPIView.as_view(), name='create-evaluation'),
    path('evaluations/submit/', SubmitFullEvaluationAPIView.as_view(), name='submit-evaluation'),
    path('evaluations/list/', UserEvaluationListAPIView.as_view(), name='list-evaluations'),
    path('evaluations/<uuid:id>/', EvaluationDetailAPIView.as_view(), name='evaluation-detail'),
    path('evaluations/analytics/summary/', AnalyticsSummaryAPIView.as_view(), name='analytics-summary'),
    path('ai/narrative/', AINarrativeAPIView.as_view(), name='ai-narrative'),
    path('ai/narrative', AINarrativeAPIView.as_view(), name='ai-narrative-no-slash'),
    
    # Leads / Interest
    path('leads/investors/', InvestorInterestAPIView.as_view(), name='investor-interest'),
    path('leads/accelerators/', AcceleratorInterestAPIView.as_view(), name='accelerator-interest'),
    
    # Admin Investors
    path('admin/investors/', InvestorAdminListCreateAPIView.as_view(), name='admin-investors'),
    path('admin/investors/<uuid:id>/', InvestorAdminDetailAPIView.as_view(), name='admin-investor-detail'),
    path('admin/investors/from-lead/', InvestorFromLeadAPIView.as_view(), name='admin-investor-from-lead'),
    
    # Admin Startups
    path('admin/startups/<uuid:id>/', AdminStartupDetailAPIView.as_view(), name='admin-startup-detail'),
    
    # Investor Dashboard APIs
    path('investor/dashboard-stats', InvestorDashboardStatsAPIView.as_view(), name='investor-dashboard-stats'),
    path('investor/ai-opportunities/', AIOpportunitiesAPIView.as_view(), name='investor-ai-opportunities'),
    path('investor/trending-startups/', TrendingStartupsAPIView.as_view(), name='investor-trending'),
    path('investor/recent-funding/', RecentFundingEventsAPIView.as_view(), name='investor-recent-funding'),
    path('investor/my-matches/', InvestorMatchesForInvestorAPIView.as_view(), name='investor-my-matches'),
    path('startups', StartupsListAPIView.as_view(), name='startups-list'),
    path('investor/chat', InvestorChatAPIView.as_view(), name='investor-chat'),
    path('investor/chat/', InvestorChatAPIView.as_view(), name='investor-chat-slash'),
    path('investor/chat/stream', InvestorChatStreamAPIView.as_view(), name='investor-chat-stream'),
    path('investor/chat/sessions', InvestorChatSessionsAPIView.as_view(), name='investor-chat-sessions'),
    path('investor/chat/sessions/<uuid:id>', InvestorChatSessionDetailAPIView.as_view(), name='investor-chat-session-detail'),
    path('ai/health', AIHealthAPIView.as_view(), name='ai-health'),

    # Deal flow & Contacts
    path('investor/watchlist', WatchlistListCreateAPIView.as_view(), name='investor-watchlist'),
    path('investor/watchlist/<uuid:startup_id>', WatchlistDestroyAPIView.as_view(), name='investor-watchlist-destroy'),
    path('investor/pipeline', PipelineStageListCreateAPIView.as_view(), name='investor-pipeline'),
    path('investor/pipeline/<uuid:startup_id>', PipelineStageUpdateAPIView.as_view(), name='investor-pipeline-update'),
    path('investor/contacts', ContactListCreateAPIView.as_view(), name='investor-contacts'),
    path('investor/contacts/<uuid:id>', ContactDetailAPIView.as_view(), name='investor-contact-detail'),

    # Matching Engine
    path('matching/startup/<uuid:startup_id>', StartupMatchAPIView.as_view(), name='matching-startup'),

    # Data Ingestion Engine
    path('ingestion/news', NewsArticleListAPIView.as_view(), name='ingestion-news'),
    path('ingestion/registry', CompanyRegistryListAPIView.as_view(), name='ingestion-registry'),
    path('ingestion/social', SocialSignalListAPIView.as_view(), name='ingestion-social'),
    path('ingestion/status', IngestionStatusAPIView.as_view(), name='ingestion-status'),
    path('ingestion/trigger', TriggerIngestionAPIView.as_view(), name='ingestion-trigger'),

    # Data Enrichment Engine
    path('enrichment/startups', EnrichedStartupListAPIView.as_view(), name='enrichment-startups'),
    path('enrichment/test', EnrichmentTestAPIView.as_view(), name='enrichment-test'),

    # AI Opportunity Scoring Engine
    path('scoring/calculate/<uuid:startup_id>', CalculateStartupScoreAPIView.as_view(), name='scoring-calculate'),

    # ─── Startup Intelligence API ─────────────────────────────────────────────
    # GET /api/v1/startups              - Full startup list with intelligence data
    path('startups/', StartupListAPIView.as_view(), name='startup-list'),

    # GET /api/v1/startups/<id>         - Full startup intelligence profile
    path('startups/<uuid:startup_id>/', StartupDetailAPIView.as_view(), name='startup-detail'),

    # GET /api/v1/ai-opportunities      - AI-scored opportunity list
    path('ai-opportunities/', AIOpportunitiesIntelligenceAPIView.as_view(), name='ai-opportunities'),

    # GET /api/v1/startups/<id>/matches - Investor matches for a startup
    path('startups/<uuid:startup_id>/matches/', StartupMatchesAPIView.as_view(), name='startup-matches'),

    # GET /api/v1/startups/<id>/news    - News articles related to a startup
    path('startups/<uuid:startup_id>/news/', StartupNewsAPIView.as_view(), name='startup-news'),

    # Backend Intelligence Migration
    path('startups/<uuid:startup_id>/market-intelligence/', MarketIntelligenceAPIView.as_view(), name='startup-market-intelligence'),
    path('startups/<uuid:startup_id>/investor-matches-v2/', InvestorMatchesAPIView.as_view(), name='startup-investor-matches-v2'),
]
