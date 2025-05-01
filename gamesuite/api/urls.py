from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('firegame/<int:id>/',views.get_firegame_by_id, name='get_firegame_by_id'),
    path('mousegame/<int:id>/',views.get_mousegame_by_id,name='get_mousegame_by_id'),
]