from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from core.serializers.leads_serializers import (
    InvestorInterestSerializer,
    AcceleratorInterestSerializer,
)
from core.repositories.leads_repository import (
    create_investor_lead,
    create_accelerator_lead,
)
from core.services.email_service import send_investor_interest_confirmation, send_investor_interest_admin_alert


def _meta_from_request(request):
    meta = request.META or {}
    ip = (
        meta.get("HTTP_X_FORWARDED_FOR", "")
        .split(",")[0]
        .strip()
        or meta.get("REMOTE_ADDR")
    )
    ua = meta.get("HTTP_USER_AGENT", "")
    return {"ip": ip, "ua": ua}


class InvestorInterestAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = InvestorInterestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        lead = create_investor_lead(serializer.validated_data, _meta_from_request(request))
        
        # Trigger Notifications
        send_investor_interest_confirmation(lead)
        send_investor_interest_admin_alert(lead)
        
        out = InvestorInterestSerializer(lead)
        return Response(out.data, status=status.HTTP_201_CREATED)


class AcceleratorInterestAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = AcceleratorInterestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        lead = create_accelerator_lead(serializer.validated_data, _meta_from_request(request))
        out = AcceleratorInterestSerializer(lead)
        return Response(out.data, status=status.HTTP_201_CREATED)

