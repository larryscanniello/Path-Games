from rest_framework.throttling import SimpleRateThrottle


class PathGamesGlobalThrottle(SimpleRateThrottle):
    scope = 'path_games_global'
    def get_cache_key(self, request, view):
        return view.__class__.__name__  # One key for all users hitting this view
        
class UserCreationThrottle(SimpleRateThrottle):
    scope = 'create_user_throttle'
    def get_cache_key(self, request, view):
        return 'create_user_throttle'  # Global key for this view