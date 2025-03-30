const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Configuração do canvas para mobile
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Elementos do jogo (igual ao seu original)
const pacman = {
    x: canvas.width / 10,
    y: canvas.height / 10,
    size: canvas.width / 20,
    speed: canvas.width / 100,
    dx: 0,
    dy: 0
};

const walls = [
    { x: canvas.width * 0.2, y: canvas.height * 0.2, width: canvas.width * 0.6, height: canvas.width * 0.04 },
    { x: canvas.width * 0.2, y: canvas.height * 0.4, width: canvas.width * 0.04, height: canvas.height * 0.4 }
];

// Pellets (quantidade original)
const pellets = [
    { x: canvas.width * 0.1, y: canvas.height * 0.1, size: canvas.width / 60 },
    { x: canvas.width * 0.3, y: canvas.height * 0.1, size: canvas.width / 60 },
    { x: canvas.width * 0.5, y: canvas.height * 0.1, size: canvas.width / 60 },
    { x: canvas.width * 0.7, y: canvas.height * 0.1, size: canvas.width / 60 }
];

const ghosts = [
    { x: canvas.width * 0.7, y: canvas.height * 0.5, size: canvas.width / 25, dx: canvas.width / 250, dy: 0, color: 'red' },
    { x: canvas.width * 0.3, y: canvas.height * 0.6, size: canvas.width / 25, dx: -canvas.width / 300, dy: 0, color: 'blue' }
];

// Controle por toque invisível
canvas.addEventListener('touchstart', (e) => {
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    
    // Calcula direção do toque
    const dx = touchX - pacman.x;
    const dy = touchY - pacman.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Normaliza e aplica velocidade
    pacman.dx = (dx / distance) * pacman.speed;
    pacman.dy = (dy / distance) * pacman.speed;
    
    e.preventDefault();
});

// Atualização do jogo (igual ao original)
function update() {
    pacman.x += pacman.dx;
    pacman.y += pacman.dy;
    
    // Limites da tela
    pacman.x = Math.max(pacman.size, Math.min(canvas.width - pacman.size, pacman.x));
    pacman.y = Math.max(pacman.size, Math.min(canvas.height - pacman.size, pacman.y));
    
    // Colisão com paredes
    walls.forEach(wall => {
        if (pacman.x < wall.x + wall.width &&
            pacman.x + pacman.size > wall.x &&
            pacman.y < wall.y + wall.height &&
            pacman.y + pacman.size > wall.y) {
            pacman.x -= pacman.dx;
            pacman.y -= pacman.dy;
        }
    });
    
    // Coleta de pellets
    pellets.forEach((pellet, i) => {
        if (Math.abs(pacman.x - pellet.x) < pacman.size/2 + pellet.size &&
            Math.abs(pacman.y - pellet.y) < pacman.size/2 + pellet.size) {
            pellets.splice(i, 1);
        }
    });
    
    // Movimento dos fantasmas
    ghosts.forEach(ghost => {
        ghost.x += ghost.dx;
        ghost.y += ghost.dy;
        
        if (ghost.x <= 0 || ghost.x >= canvas.width - ghost.size) ghost.dx *= -1;
        if (ghost.y <= 0 || ghost.y >= canvas.height - ghost.size) ghost.dy *= -1;
    });
}

// Desenho (igual ao original)
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Paredes
    ctx.fillStyle = 'blue';
    walls.forEach(wall => ctx.fillRect(wall.x, wall.y, wall.width, wall.height));
    
    // Pellets
    ctx.fillStyle = 'white';
    pellets.forEach(pellet => {
        ctx.beginPath();
        ctx.arc(pellet.x, pellet.y, pellet.size, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Fantasmas
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
    
    // Pacman
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(pacman.x, pacman.y, pacman.size, 0.2 * Math.PI, 1.8 * Math.PI);
    ctx.lineTo(pacman.x, pacman.y);
    ctx.fill();
}

// Loop do jogo
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Inicia o jogo
gameLoop();

// Redimensionamento
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
