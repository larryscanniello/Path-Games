from django.core.management.base import BaseCommand
from firegame.models import FiregameMap


class Command(BaseCommand):
    help = 'Reindex the games to start from 0'
    