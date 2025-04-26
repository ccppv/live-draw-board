const socket = io();
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let drawing = false;
let startX, startY;
let tool = document.getElementById("tool").value;
let color = document.getElementById("color").value;

document.getElementById("tool").onchange = (e) => tool = e.target.value;
document.getElementById("color").oninput = (e) => color = e.target.value;
document.getElementById("clear").onclick = () => socket.emit("clear");

function drawShape(ctx, shape, emit) {
  const { tool, color, x0, y0, x1, y1 } = shape;
  ctx.strokeStyle = color;
  ctx.beginPath();
  if (tool === "pen") {
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
  } else if (tool === "line") {
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
  } else if (tool === "rect") {
    ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
  } else if (tool === "circle") {
    let r = Math.hypot(x1 - x0, y1 - y0);
    ctx.arc(x0, y0, r, 0, 2 * Math.PI);
  }
  ctx.stroke();
  ctx.closePath();

  if (emit) {
    socket.emit("draw", shape);
  }
}

canvas.onmousedown = (e) => {
  drawing = true;
  startX = e.clientX;
  startY = e.clientY;
};

canvas.onmouseup = (e) => {
  if (!drawing) return;
  drawing = false;
  let shape = {
    tool,
    color,
    x0: startX,
    y0: startY,
    x1: e.clientX,
    y1: e.clientY
  };
  drawShape(ctx, shape, true);
};

socket.on("draw", (data) => drawShape(ctx, data, false));
socket.on("init", (all) => all.forEach(s => drawShape(ctx, s, false)));
socket.on("clear", () => ctx.clearRect(0, 0, canvas.width, canvas.height));
