from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from core.serializers.auth_serializers import RegisterSerializer
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    """
    API View for user registration.
    """
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom JWT Login View to include user details in response.
    """
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            user = User.objects.get(email=request.data['email'])
            response.data['user'] = {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser,
                'is_investor': getattr(user, 'is_investor', False),
                'is_founder': getattr(user, 'is_founder', False),
            }
            response.data['redirect_to'] = '/admin/'
        return response


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        u = request.user
        data = {
            "id": str(u.id),
            "email": u.email,
            "first_name": u.first_name,
            "last_name": u.last_name,
            "is_investor": getattr(u, "is_investor", False),
            "is_founder": getattr(u, "is_founder", False),
            "is_staff": u.is_staff,
            "is_superuser": u.is_superuser,
            "date_joined": u.date_joined,
        }
        return Response(data, status=status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        u = request.user
        first_name = request.data.get("first_name", u.first_name)
        last_name = request.data.get("last_name", u.last_name)
        
        u.first_name = first_name
        u.last_name = last_name
        u.save()
        
        data = {
            "id": str(u.id),
            "email": u.email,
            "first_name": u.first_name,
            "last_name": u.last_name,
            "is_investor": getattr(u, "is_investor", False),
            "is_founder": getattr(u, "is_founder", False),
            "is_staff": u.is_staff,
            "is_superuser": u.is_superuser,
            "date_joined": u.date_joined,
        }
        return Response(data, status=status.HTTP_200_OK)


class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            # For security, we do not reveal whether the email exists
            return Response({'message': 'If your email is registered, you will receive a reset link.'}, status=status.HTTP_200_OK)
            
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        
        # In a real setup, we would use SENDGRID or similar from settings.
        # This points to the React frontend route we will create.
        reset_link = f"http://localhost:5173/investor/reset-password?uid={uid}&token={token}"
        
        print(f"\\n--- PASSWORD RESET EMAIL ---\\nTo: {user.email}\\nLink: {reset_link}\\n--------------------------\\n")
        
        try:
            send_mail(
                subject='Password Reset - MatchPointAI',
                message=f'Click the link below to reset your password:\\n\\n{reset_link}',
                from_email='noreply@matchpoint.ai',
                recipient_list=[user.email],
                fail_silently=True,
            )
        except Exception as e:
            print("Failed to send real email, but link printed above.", e)
            
        return Response({'message': 'If your email is registered, you will receive a reset link.'}, status=status.HTTP_200_OK)


class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        uidb64 = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('password')
        
        if not uidb64 or not token or not new_password:
            return Response({'error': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({'error': 'Invalid reset link'}, status=status.HTTP_400_BAD_REQUEST)
            
        if not default_token_generator.check_token(user, token):
            return Response({'error': 'Invalid or expired reset link'}, status=status.HTTP_400_BAD_REQUEST)
            
        user.set_password(new_password)
        user.save()
        
        return Response({'message': 'Password has been reset successfully'}, status=status.HTTP_200_OK)
