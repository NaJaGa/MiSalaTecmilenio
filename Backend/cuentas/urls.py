from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', UserRegistrationApiView.as_view(), name='register-user'),
    path('login/', UserLoginApiView.as_view(), name='login-user'),
    path('logout/', UserLogoutApiView.as_view(), name='logout-user'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/', UserInfoApiView.as_view(), name='user-info'),
]