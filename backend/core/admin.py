from django.contrib import admin
from core.models import (
    InvestorInterestLead, AcceleratorInterestLead,
    NewsArticle, CompanyRegistryEntry, SocialSignal,
    EnrichedStartup, FundingEvent,
    StartupInvestorMatch, StartupSignal,
    DiscoveredStartup
)


@admin.register(InvestorInterestLead)
class InvestorInterestLeadAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "firm", "role", "created_at")
    search_fields = ("name", "email", "firm", "role")
    list_filter = ("created_at",)


@admin.register(AcceleratorInterestLead)
class AcceleratorInterestLeadAdmin(admin.ModelAdmin):
    list_display = ("program_name", "email", "contact_name", "cohort_size", "created_at")
    search_fields = ("program_name", "email", "contact_name")
    list_filter = ("created_at",)


@admin.register(NewsArticle)
class NewsArticleAdmin(admin.ModelAdmin):
    list_display = ("company_name", "headline", "source", "published_at", "collected_at")
    search_fields = ("company_name", "headline", "source")
    list_filter = ("source", "collected_at")


@admin.register(CompanyRegistryEntry)
class CompanyRegistryEntryAdmin(admin.ModelAdmin):
    list_display = ("company_name", "country", "incorporation_year", "collected_at")
    search_fields = ("company_name", "country")
    list_filter = ("country", "incorporation_year")


@admin.register(SocialSignal)
class SocialSignalAdmin(admin.ModelAdmin):
    list_display = ("company_name", "mentions", "sentiment_score", "popularity_score", "collected_at")
    search_fields = ("company_name",)
    list_filter = ("collected_at",)


@admin.register(EnrichedStartup)
class EnrichedStartupAdmin(admin.ModelAdmin):
    list_display = ("company_name", "industry", "updated_at")
    search_fields = ("company_name", "industry")


@admin.register(FundingEvent)
class FundingEventAdmin(admin.ModelAdmin):
    list_display = ("startup", "amount", "currency", "round_name", "announced_on")
    search_fields = ("startup__company_name", "round_name")
    list_filter = ("round_name", "currency")


@admin.register(StartupInvestorMatch)
class StartupInvestorMatchAdmin(admin.ModelAdmin):
    list_display = ("startup", "investor", "match_score", "created_at")
    search_fields = ("startup__company_name", "investor__firm_name", "investor__user__email")
    list_filter = ("match_score",)


@admin.register(DiscoveredStartup)
class DiscoveredStartupAdmin(admin.ModelAdmin):
    list_display = ("company_name", "source", "category", "is_converted", "discovered_at")
    list_filter = ("source", "is_converted")
    search_fields = ("company_name", "founder_name", "product_name", "headline")
    readonly_fields = ("discovered_at", "updated_at", "article_url")
    actions = ["mark_as_converted"]

    @admin.action(description="Mark selected as converted to StartupEvaluation")
    def mark_as_converted(self, request, queryset):
        queryset.update(is_converted=True)
@admin.register(StartupSignal)
class StartupSignalAdmin(admin.ModelAdmin):
    list_display = ("startup", "news_score", "sentiment_score", "market_momentum", "updated_at")
    list_filter = ("market_momentum", "investor_attention")
    search_fields = ("startup__company_name",)
