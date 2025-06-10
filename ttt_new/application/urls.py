from django.urls import path
from . import views  # Import views from the current app

urlpatterns = [
    path('', views.index, name='index'),
    path('about/', views.about, name='about'),
    path('game',views.game, name='game'),
    path('save_game/', views.save_game, name='save_game'),
    path('load_games/', views.load_games, name='load_games'),
    path('game/<int:id>/', views.load_game, name='load_game'),
]