
from django.core.management.base import BaseCommand
from firegame.models import FiregameMap


class Command(BaseCommand):
    help = 'Print ID and difficulty of all games in the database'

    def handle(self, *args, **options):
        games = FiregameMap.objects.all()
        if len(games)==0:
            print('No games')
        else:
            for game in games:
                print(game)
