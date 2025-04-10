from django.core.management.base import BaseCommand
from firegame.models import MazeMap  # adjust if your model is named differently
import random

class Command(BaseCommand):
    help = 'Generate and save maze maps by difficulty'

    def add_arguments(self, parser):
        parser.add_argument('--num_easy', type=int, default=50)
        parser.add_argument('--num_medium', type=int, default=50)
        parser.add_argument('--num_hard', type=int, default=50)

    def handle(self, *args, **options):
        num_easy = options['num_easy']
        num_medium = options['num_medium']
        num_hard = options['num_hard']

        generated_easy = self.generate_maps('easy', num_easy)
        generated_medium = self.generate_maps('medium', num_medium)
        generated_hard = self.generate_maps('hard', num_hard)

        self.stdout.write(self.style.SUCCESS(
            f'Generated {generated_easy} easy, {generated_medium} medium, {generated_hard} hard levels.'
        ))

    def generate_maps(self, difficulty, count):
        generated = 0
        tries = 0
        max_tries = 100000  # safety cap to prevent infinite loops

        while generated < count and tries < max_tries:
            tries += 1
            grid = self.generate_random_grid()
            if self.is_correct_difficulty(grid, difficulty):
                MazeMap.objects.create(grid=grid, difficulty=difficulty)
                generated += 1

        return generated

    def generate_random_grid(self):
        # TODO: Replace with your actual map generation logic
        return [[random.choice([0, 1]) for _ in range(10)] for _ in range(10)]

    def is_correct_difficulty(self, grid, difficulty):
        # TODO: Run your bots here and return True if grid matches the desired difficulty
        return random.random() < 0.01 if difficulty == "hard" else True