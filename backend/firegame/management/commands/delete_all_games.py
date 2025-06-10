
from django.core.management.base import BaseCommand
from firegame.models import FiregameMap


class Command(BaseCommand):
    help = 'Delete all games in the database'

    def handle(self, *args, **options):
        FiregameMap.objects.all().delete()
        