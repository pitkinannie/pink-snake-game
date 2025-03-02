import pygame
import random
from typing import List, Tuple

# Initialize Pygame
pygame.init()

# Constants
WINDOW_SIZE = 600
GRID_SIZE = 20
GRID_COUNT = WINDOW_SIZE // GRID_SIZE

# Colors (Pink Theme)
BACKGROUND_PINK = (255, 240, 245)  # Light pink
SNAKE_PINK = (255, 182, 193)       # Light pink
FOOD_PINK = (255, 105, 180)        # Hot pink
BORDER_PINK = (219, 112, 147)      # Pale violet red

# Initialize window
screen = pygame.display.set_mode((WINDOW_SIZE, WINDOW_SIZE))
pygame.display.set_caption("Pink Snake Game 🐍")

class Snake:
    def __init__(self):
        self.body: List[Tuple[int, int]] = [(GRID_COUNT // 2, GRID_COUNT // 2)]
        self.direction = (1, 0)
        self.grow = False

    def move(self):
        new_head = (
            (self.body[0][0] + self.direction[0]) % GRID_COUNT,
            (self.body[0][1] + self.direction[1]) % GRID_COUNT
        )
        
        if not self.grow:
            self.body.pop()
        else:
            self.grow = False
            
        self.body.insert(0, new_head)

    def check_collision(self) -> bool:
        return self.body[0] in self.body[1:]

class Game:
    def __init__(self):
        self.snake = Snake()
        self.food = self.generate_food()
        self.score = 0
        self.game_over = False
        
    def generate_food(self) -> Tuple[int, int]:
        while True:
            food = (random.randint(0, GRID_COUNT-1), random.randint(0, GRID_COUNT-1))
            if food not in self.snake.body:
                return food

    def update(self):
        if self.game_over:
            return

        self.snake.move()

        # Check if snake ate food
        if self.snake.body[0] == self.food:
            self.snake.grow = True
            self.food = self.generate_food()
            self.score += 1

        # Check for collision
        if self.snake.check_collision():
            self.game_over = True

    def draw(self):
        screen.fill(BACKGROUND_PINK)
        
        # Draw snake
        for segment in self.snake.body:
            pygame.draw.rect(screen, SNAKE_PINK,
                           (segment[0] * GRID_SIZE, segment[1] * GRID_SIZE,
                            GRID_SIZE - 2, GRID_SIZE - 2))
            
        # Draw food
        pygame.draw.rect(screen, FOOD_PINK,
                        (self.food[0] * GRID_SIZE, self.food[1] * GRID_SIZE,
                         GRID_SIZE - 2, GRID_SIZE - 2))
        
        # Draw score
        font = pygame.font.Font(None, 36)
        score_text = font.render(f'Score: {self.score}', True, BORDER_PINK)
        screen.blit(score_text, (10, 10))
        
        if self.game_over:
            game_over_text = font.render('Game Over!', True, BORDER_PINK)
            screen.blit(game_over_text, (WINDOW_SIZE // 2 - 70, WINDOW_SIZE // 2))
            
        pygame.display.flip()

def main():
    game = Game()
    clock = pygame.time.Clock()
    
    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                return
            elif event.type == pygame.KEYDOWN and not game.game_over:
                if event.key == pygame.K_UP and game.snake.direction != (0, 1):
                    game.snake.direction = (0, -1)
                elif event.key == pygame.K_DOWN and game.snake.direction != (0, -1):
                    game.snake.direction = (0, 1)
                elif event.key == pygame.K_LEFT and game.snake.direction != (1, 0):
                    game.snake.direction = (-1, 0)
                elif event.key == pygame.K_RIGHT and game.snake.direction != (-1, 0):
                    game.snake.direction = (1, 0)
            elif event.type == pygame.KEYDOWN and game.game_over:
                if event.key == pygame.K_SPACE:
                    game = Game()

        game.update()
        game.draw()
        clock.tick(10)

if __name__ == "__main__":
    main()
