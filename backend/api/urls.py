from django.contrib import admin
from django.urls import path, include
from . import views
from api.views import CreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path('firegame/',views.firegame, name='firegame'),
    path('get_mousegame_by_id/',views.get_mousegame_by_id,name='get_mousegame_by_id'),
    path('get_firegame_by_id/',views.get_firegame_by_id,name='get_firegame_by_id'),
    path('user/register/',CreateUserView.as_view(),name='register'),
    path('token/',TokenObtainPairView.as_view(),name='get_token'),
    path('token/refresh/', TokenRefreshView.as_view(),name='refresh'),
    path('api-auth/',include('rest_framework.urls')),
    path('handle_game_over_mousegame/',views.handle_game_over_mousegame,name='handle_game_over'),
    path('handle_game_over_firegame/',views.handle_game_over_firegame,name='handle_game_over_firegame'),
    path('mousegame/',views.mousegame,name='mousegame'),
    path('getmousegamelist/',views.get_mousegame_list,name='get_game_list'),
    path('getfiregamelist/',views.get_firegame_list,name='get_firegame_list'),
    path('getfiregameleaderboard/',views.get_firegame_leaderboard,name='get_firegame_leaderboard'),
    path('handle_first_turn_firegame/',views.handle_first_turn_firegame),
    path('handle_first_turn_mousegame/',views.handle_first_turn_mousegame),
    path('change_password/',views.ChangePasswordView.as_view()),
    path('feedback/',views.feedback)
]