from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from core.views.evaluation_views import (
    CreateEvaluationAPIView,
    SubmitFullEvaluationAPIView,
    UserEvaluationListAPIView,
    EvaluationDetailAPIView
)
from core.views.auth_views import RegisterView, CustomTokenObtainPairView

urlpatterns = [
    # Auth Endpoints
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Evaluation Endpoints
    path('evaluations/create/', CreateEvaluationAPIView.as_view(), name='create-evaluation'),
    path('evaluations/submit/', SubmitFullEvaluationAPIView.as_view(), name='submit-evaluation'),
    path('evaluations/list/', UserEvaluationListAPIView.as_view(), name='list-evaluations'),
    path('evaluations/<uuid:id>/', EvaluationDetailAPIView.as_view(), name='evaluation-detail'),
]
