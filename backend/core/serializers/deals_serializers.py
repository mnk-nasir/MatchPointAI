from rest_framework import serializers
from core.models.deals import Watchlist, PipelineStage, Contact
from core.models.evaluation import StartupEvaluation

class PipelineStageSerializer(serializers.ModelSerializer):
    startup_name = serializers.CharField(source='startup.company_name', read_only=True)
    startup_industry = serializers.SerializerMethodField()
    startup_logo_url = serializers.SerializerMethodField()
    startup_funding_ask = serializers.SerializerMethodField()
    startup_risk_score = serializers.IntegerField(source='startup.total_score', read_only=True)

    class Meta:
        model = PipelineStage
        fields = ['id', 'startup', 'startup_name', 'startup_industry', 'startup_logo_url', 'startup_funding_ask', 'startup_risk_score', 'stage', 'updated_at', 'created_at']
        read_only_fields = ['id', 'user', 'updated_at', 'created_at']

    def get_startup_industry(self, obj):
        try:
            fd = obj.startup.form_data or {}
            s1 = fd.get("step1") or {}
            s2 = fd.get("step2") or {}
            s3 = fd.get("step3") or {}
            return (
                s1.get("sector") or s1.get("industry") or s1.get("industryType") or
                s2.get("sector") or s2.get("industry") or s2.get("industryType") or s2.get("industryFocus") or
                s3.get("sector") or s3.get("industry") or s3.get("industryType") or None
            )
        except Exception:
            return None

    def get_startup_logo_url(self, obj):
        try:
            return (obj.startup.form_data or {}).get("step1", {}).get("companyLogoUrl") or ""
        except Exception:
            return ""

    def get_startup_funding_ask(self, obj):
        try:
            return (obj.startup.form_data or {}).get("step6", {}).get("amountRaising") or ""
        except Exception:
            return ""


class WatchlistSerializer(serializers.ModelSerializer):
    startup_name = serializers.CharField(source='startup.company_name', read_only=True)
    startup_industry = serializers.SerializerMethodField()
    startup_logo_url = serializers.SerializerMethodField()
    startup_funding_ask = serializers.SerializerMethodField()
    startup_risk_score = serializers.IntegerField(source='startup.total_score', read_only=True)

    class Meta:
        model = Watchlist
        fields = ['id', 'startup', 'startup_name', 'startup_industry', 'startup_logo_url', 'startup_funding_ask', 'startup_risk_score', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

    def get_startup_industry(self, obj):
        try:
            fd = obj.startup.form_data or {}
            s1 = fd.get("step1") or {}
            s2 = fd.get("step2") or {}
            s3 = fd.get("step3") or {}
            return (
                s1.get("sector") or s1.get("industry") or s1.get("industryType") or
                s2.get("sector") or s2.get("industry") or s2.get("industryType") or s2.get("industryFocus") or
                s3.get("sector") or s3.get("industry") or s3.get("industryType") or None
            )
        except Exception:
            return None

    def get_startup_logo_url(self, obj):
        try:
            return (obj.startup.form_data or {}).get("step1", {}).get("companyLogoUrl") or ""
        except Exception:
            return ""

    def get_startup_funding_ask(self, obj):
        try:
            return (obj.startup.form_data or {}).get("step6", {}).get("amountRaising") or ""
        except Exception:
            return ""


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['id', 'name', 'role', 'company', 'email', 'phone', 'country', 'tags', 'notes', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']
