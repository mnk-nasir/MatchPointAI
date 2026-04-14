from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from core.models.user import InvestorProfile

User = get_user_model()

class DataExportView(APIView):
    """
    GDPR Right to Portability: Export all user-related data in JSON format.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        
        # Basic User Data
        data = {
            "user_profile": {
                "id": str(user.id),
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "is_founder": user.is_founder,
                "is_investor": user.is_investor,
                "company": user.company,
                "phone": user.phone,
                "date_joined": user.date_joined.isoformat(),
            }
        }

        # Investor Specific Data
        try:
            profile = user.investor_profile
            data["investor_profile"] = {
                "firm_name": profile.firm_name,
                "target_industries": profile.target_industries,
                "preferred_stages": profile.preferred_stages,
                "min_ticket_size": profile.min_ticket_size,
                "max_ticket_size": profile.max_ticket_size,
            }
        except InvestorProfile.DoesNotExist:
            data["investor_profile"] = None

        # Add more data points as necessary (e.g. Chat history, Deals, etc.)
        # For now, this covers the primary personal identifying information.

        return Response(data, status=status.HTTP_200_OK)


class AccountDeletionView(APIView):
    """
    GDPR Right to Erasure: Permanent deletion of user account and associated data.
    """
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        user = request.user
        user_email = user.email
        
        # In a production app, you might want to log this or move it to a background task
        # if there's a lot of associated data. Since we use CASCADE on most relations,
        # deleting the user will clean up most associated data.
        
        user.delete()
        
        return Response(
            {"message": f"Account associated with {user_email} has been permanently deleted."},
            status=status.HTTP_204_NO_CONTENT
        )
