from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from core.models import StartupEvaluation
from django.shortcuts import get_object_or_404
from core.models import StartupEvaluation

from core.serializers.investor_admin_serializers import (
    InvestorAdminCreateSerializer,
    InvestorAdminListSerializer,
    InvestorFromLeadSerializer,
    InvestorAdminUpdateSerializer,
)

User = get_user_model()


class InvestorAdminListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAdminUser]
    serializer_class = InvestorAdminCreateSerializer
    pagination_class = None

    def get_queryset(self):
        qs = User.objects.filter(is_investor=True).order_by("-date_joined")
        email = self.request.query_params.get("email")
        if email:
            qs = qs.filter(email__icontains=email)
        return qs

    def get_serializer_class(self):
        if self.request.method.lower() == "get":
            return InvestorAdminListSerializer
        return InvestorAdminCreateSerializer


class InvestorFromLeadAPIView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, *args, **kwargs):
        serializer = InvestorFromLeadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        out = InvestorAdminListSerializer(user)
        return Response(out.data, status=status.HTTP_201_CREATED)


class InvestorAdminDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAdminUser]
    serializer_class = InvestorAdminUpdateSerializer
    queryset = User.objects.filter(is_investor=True)
    lookup_field = "id"

    def get_serializer_class(self):
        if self.request.method.lower() == "get":
            return InvestorAdminListSerializer
        return InvestorAdminUpdateSerializer


class AdminStartupDetailAPIView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def delete(self, request, id, *args, **kwargs):
        startup = get_object_or_404(StartupEvaluation, id=id)
        startup.delete()
        return Response({"detail": "Startup deleted."}, status=status.HTTP_204_NO_CONTENT)

    def patch(self, request, id, *args, **kwargs):
        startup = get_object_or_404(StartupEvaluation, id=id)
        data = request.data

        # Update core fields if provided
        if "company_name" in data:
            startup.company_name = data["company_name"]
        if "total_score" in data:
            startup.total_score = data["total_score"]
        if "rating" in data:
            startup.rating = data["rating"]
        if "funding_raised" in data:
            startup.funding_raised = data["funding_raised"]

        # Update nested form_data fields if provided
        industry = data.get("industry")
        funding_ask = data.get("funding_ask")
        if industry or funding_ask is not None:
            if not startup.form_data:
                startup.form_data = {}
            if "step1" not in startup.form_data:
                startup.form_data["step1"] = {}
            if "step6" not in startup.form_data:
                startup.form_data["step6"] = {}
            
            if industry:
                startup.form_data["step1"]["sector"] = industry
                # Unset alternative keys to avoid confusion
                for step in ["step1", "step2", "step3"]:
                    if step in startup.form_data:
                        for key in ["industry", "industryType", "industryFocus"]:
                            startup.form_data[step].pop(key, None)
            
            if funding_ask is not None:
                startup.form_data["step6"]["amountRaising"] = funding_ask
        
        startup.save()
        return Response({"detail": "Startup updated successfully."}, status=status.HTTP_200_OK)
