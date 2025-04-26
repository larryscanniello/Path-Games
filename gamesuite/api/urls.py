from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('games/<int:id>/',views.get_game_by_id, name='game-detail'),
]