const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');

const GRID_SIZE = 20;
const GRID_COUNT = canvas.width / GRID_SIZE;

// Colors
const BACKGROUND_PINK = '#FFE4E1';
const SNAKE_PINK = '#FFB6C1';
const FOOD_PINK = '#FF69B4';
const BORDER_PINK = '#DB7093';

class Snake {
    constructor() {
        this.body = [{x: Math.floor(GRID_COUNT/2), y: Math.floor(GRID_COUNT/2)}];
        this.direction = {x: 1, y: 0};
        this.grow = false;
    }

    move() {
        const newHead = {
            x: (this.body[0].x + this.direction.x + GRID_COUNT) % GRID_COUNT,
            y: (this.body[0].y + this.direction.y + GRID_COUNT) % GRID_COUNT
        };

        if (!this.grow) {
            this.body.pop();
        } else {
            this.grow = false;
        }

        this.body.unshift(newHead);
    }

    checkCollision() {
        return this.body.slice(1).some(segment => 
            segment.x === this.body[0].x && segment.y === this.body[0].y
        );
    }
}

class Game {
    constructor() {
        this.reset();
    }

    reset() {
        this.snake = new Snake();
        this.generateFood();
        this.score = 0;
        this.gameOver = false;
        scoreElement.textContent = `Score: ${this.score}`;
        gameOverElement.style.display = 'none';
    }

    generateFood() {
        while (true) {
            this.food = {
                x: Math.floor(Math.random() * GRID_COUNT),
                y: Math.floor(Math.random() * GRID_COUNT)
            };
            if (!this.snake.body.some(segment => 
                segment.x === this.food.x && segment.y === this.food.y
            )) {
                break;
            }
        }
    }

    update() {
        if (this.gameOver) return;

        this.snake.move();

        // Check if snake ate food
        if (this.snake.body[0].x === this.food.x && this.snake.body[0].y === this.food.y) {
            this.snake.grow = true;
            this.generateFood();
            this.score++;
            scoreElement.textContent = `Score: ${this.score}`;
        }

        // Check for collision
        if (this.snake.checkCollision()) {
            this.gameOver = true;
            gameOverElement.style.display = 'block';
        }
    }

    draw() {
        // Clear canvas
        ctx.fillStyle = BACKGROUND_PINK;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw snake
        ctx.fillStyle = SNAKE_PINK;
        this.snake.body.forEach(segment => {
            ctx.fillRect(
                segment.x * GRID_SIZE + 1,
                segment.y * GRID_SIZE + 1,
                GRID_SIZE - 2,
                GRID_SIZE - 2
            );
        });

        // Draw food
        ctx.fillStyle = FOOD_PINK;
        ctx.fillRect(
            this.food.x * GRID_SIZE + 1,
            this.food.y * GRID_SIZE + 1,
            GRID_SIZE - 2,
            GRID_SIZE - 2
        );
    }
}

const game = new Game();

// Game loop
function gameLoop() {
    game.update();
    game.draw();
    setTimeout(gameLoop, 100);
}

// Controls
document.addEventListener('keydown', (event) => {
    if (game.gameOver) {
        if (event.code === 'Space') {
            game.reset();
        }
        return;
    }

    switch (event.code) {
        case 'ArrowUp':
            if (game.snake.direction.y !== 1) {
                game.snake.direction = {x: 0, y: -1};
            }
            break;
        case 'ArrowDown':
            if (game.snake.direction.y !== -1) {
                game.snake.direction = {x: 0, y: 1};
            }
            break;
        case 'ArrowLeft':
            if (game.snake.direction.x !== 1) {
                game.snake.direction = {x: -1, y: 0};
            }
            break;
        case 'ArrowRight':
            if (game.snake.direction.x !== -1) {
                game.snake.direction = {x: 1, y: 0};
            }
            break;
    }
});

// Start the game
gameLoop();
