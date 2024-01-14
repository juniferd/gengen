const mainContent = document.getElementById('content');
const loading = document.getElementById('loading');
const about= document.getElementById('about')

Array(4)
  .fill()
  .forEach((_, i) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 500;
    canvas.height = 500;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 500, 500);
    if (i < 3) {
      drawBoard(ctx, i, 10 * (i + 1));
    } else {
      drawBoard(ctx, i, 18);
    }
    mainContent.appendChild(canvas);
    if (loading) loading.remove();
    about.classList.remove('hidden');
  });

function drawBoard(ctx, i, R) {
  for (let dx = 0; dx <= 500; dx += (R * 2)) {
    for (let dy = 0; dy <= 500; dy += (R * 2)) {
      let hexX = dx,
        hexY = dy;
      if ((dy / (R * 2)) % 2 === 1) {
        hexX += R;
      }
      const color = `rgba(${((Math.cos(hexX) * hexX) / 500) * 255}, ${
        ((Math.sin(hexY) * hexY + 100) / 500) * 255
      }, ${Math.random() * 255}, 0.7)`;
      if (i === 0) {
        drawHex(ctx, hexX, hexY, R, color);
      } else if (i === 1) {
        drawHex(ctx, hexX, hexY, R, color, Math.random() * Math.PI);
      } else if (i === 2) {
        drawHex(ctx, hexX, hexY, R * (Math.sin(dx) + Math.sin(dy)), color);
      } else {
        drawHex(ctx, hexX, hexY, R * (Math.sin(dx) + Math.sin(dy)), color, Math.random() * Math.PI);

      }
    }
  }
}

function drawHex(context, startX, startY, radius, color, rotation = 0) {
  context.fillStyle = color;
  context.translate(startX, startY);
  context.rotate(rotation);
  context.beginPath();
  context.moveTo(startX, startY);
  for (let d = 0; d < Math.PI * 2; d += Math.PI / 3) {
    const x = Math.cos(d) * radius;
    const y = Math.sin(d) * radius;
    context.lineTo(x, y);
  }
  context.fill();
  context.translate(-startX, -startY);
  context.setTransform(1, 0, 0, 1, 0, 0);
}
