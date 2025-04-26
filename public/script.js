const socket = io();
const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let drawing = false;

canvas.addEventListener('mousedown', () => drawing = true);
canvas.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('mouseout', () => drawing = false);
canvas.addEventListener('mousemove', draw);

function draw(e) {
  if (!drawing) return;
  const x = e.clientX;
  const y = e.clientY;
  drawDot(x, y);
  socket.emit('draw', { x, y });
}

function drawDot(x, y) {
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(x, y, 2, 0, Math.PI * 2);
  ctx.fill();
}

socket.on('draw', ({ x, y }) => {
  drawDot(x, y);
});
