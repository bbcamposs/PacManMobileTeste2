
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const touchArea = document.getElementById('touchArea');


const gameSize = Math.min(window.innerWidth, window.innerHeight * 0.9);
canvas.width = gameSize;
canvas.height = gameSize;


const pacman = {
    x: gameSize / 10,
    y: gameSize / 10,
    size: gameSize / 20,
    speed: gameSize / 100,
    dx: 0,
    dy: 0
};

const walls = [
    { x: gameSize * 0.2, y: gameSize * 0.2, width: gameSize * 0.6, height: gameSize * 0.04 },
    { x: gameSize * 0.2, y: gameSize * 0.4, width: gameSize * 0.04, height: gameSize * 0.4 }
];


const pellets = [];
for (let i = 0; i < 20; i++) {
    pellets.push({
        x: Math.random() * gameSize * 0.8 + gameSize * 0.1,
        y: Math.random() * gameSize * 0.8 + gameSize * 0.1,
        size: gameSize / 60,
        collected: false
    });
}

const ghosts = [
    { x: gameSize * 0.7, y: gameSize * 0.5, size: gameSize / 20, dx: gameSize / 200, dy: 0, color: 'red' },
    { x: gameSize * 0.3, y: gameSize * 0.6, size: gameSize / 20, dx: -gameSize / 250, dy: 0, color: 'blue' }
];

function setDirection(dx, dy) {
    pacman.dx = dx * pacman.speed;
    pacman.dy = dy * pacman.speed;
}


document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') setDirection(1, 0);
    else if (e.key === 'ArrowLeft') setDirection(-1, 0);
    else if (e.key === 'ArrowUp') setDirection(0, -1);
    else if (e.key === 'ArrowDown') setDirection(0, 1);
});


touchArea.addEventListener('touchstart', (e) => {
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    const rect = canvas.getBoundingClientRect();
    
    const centerX = rect.left + canvas.width / 2;
    const centerY = rect.top + canvas.height / 2;
    
    const dx = touchX - centerX;
    const dy = touchY - centerY;
    

    const distance = Math.sqrt(dx * dx + dy * dy);
    setDirection(dx / distance, dy / distance);
    e.preventDefault();
});


function update() {

    pacman.x += pacman.dx;
    pacman.y += pacman.dy;

    pacman.x = Math.max(pacman.size, Math.min(canvas.width - pacman.size, pacman.x));
    pacman.y = Math.max(pacman.size, Math.min(canvas.height - pacman.size, pacman.y));
    

    walls.forEach(wall => {
        if (pacman.x < wall.x + wall.width &&
            pacman.x + pacman.size > wall.x &&
            pacman.y < wall.y + wall.height &&
            pacman.y + pacman.size > wall.y) {
            pacman.x -= pacman.dx;
            pacman.y -= pacman.dy;
        }
    });
    

    pellets.forEach(pellet => {
        if (!pellet.collected && 
            Math.abs(pacman.x - pellet.x) < pacman.size/2 + pellet.size &&
            Math.abs(pacman.y - pellet.y) < pacman.size/2 + pellet.size) {
            pellet.collected = true;
        }
    });
    
    ghosts.forEach(ghost => {
        ghost.x += ghost.dx;
        ghost.y += ghost.dy;
        
        if (ghost.x <= 0 || ghost.x >= canvas.width - ghost.size) ghost.dx *= -1;
        if (ghost.y <= 0 || ghost.y >= canvas.height - ghost.size) ghost.dy *= -1;
    });
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    

    ctx.fillStyle = 'blue';
    walls.forEach(wall => ctx.fillRect(wall.x, wall.y, wall.width, wall.height));
    

    ctx.fillStyle = 'white';
    pellets.forEach(pellet => {
        if (!pellet.collected) {
            ctx.beginPath();
            ctx.arc(pellet.x, pellet.y, pellet.size, 0, Math.PI * 2);
            ctx.fill();
        }
    });
    

    ghosts.forEach(ghost => {
        ctx.fillStyle = ghost.color;
        ctx.beginPath();
        ctx.arc(ghost.x, ghost.y, ghost.size, Math.PI, 0);
        ctx.lineTo(ghost.x + ghost.size, ghost.y + ghost.size/2);
        for (let i = 0; i < 3; i++) {
            const x = ghost.x + ghost.size - (i * (ghost.size/1.5));
            ctx.lineTo(x, ghost.y + ghost.size);
            ctx.lineTo(x - (ghost.size/3), ghost.y + ghost.size/2);
        }
        ctx.lineTo(ghost.x - ghost.size, ghost.y + ghost.size/2);
        ctx.fill();
    });
    

    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(pacman.x, pacman.y, pacman.size, 0.2 * Math.PI, 1.8 * Math.PI);
    ctx.lineTo(pacman.x, pacman.y);
    ctx.fill();
}


function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}


gameLoop();