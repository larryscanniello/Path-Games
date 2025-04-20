from django.urls import path
from . import views

urlpatterns = [
    path('play_game/<str:difficulty>/make_move/',views.make_move,name='make_move'),
    path('select/', views.select_difficulty, name='select_difficulty'),
    path('play_game/<str:difficulty>/', views.play_game, name='play_game'),
    path('play_game/<str:difficulty>/load_game/',views.load_game,name='load_game'),
    path('see_bots/<int:id>/', views.see_bots,name='see_bots'),
    path('see_bots/<int:id>/load_see_bots/',views.load_see_bots,name='load_see_bots'),
    path('see_bots/<int:id>/go_forward/',views.go_forward,name='go_forward'),
    path('see_bots/<int:id>/go_backward/',views.go_backward,name='go_backward')
]