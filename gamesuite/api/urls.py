from django.contrib import admin
from django.urls import path, include
from . import views
from api.views import CreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('firegame/<int:id>/',views.get_firegame_by_id, name='get_firegame_by_id'),
    path('mousegame/<int:id>/',views.get_mousegame_by_id,name='get_mousegame_by_id'),
    path('user/register/',CreateUserView.as_view(),name='register'),
    path('token/',TokenObtainPairView.as_view(),name='get_token'),
    path('token/refresh/', TokenRefreshView.as_view(),name='refresh'),
    path('api-auth/',include('rest_framework.urls')),
]