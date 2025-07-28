const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

function createIcon(size, outputPath) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Draw rounded rectangle background
  ctx.fillStyle = '#1225A5';
  const radius = size * 0.15;
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(size - radius, 0);
  ctx.quadraticCurveTo(size, 0, size, radius);
  ctx.lineTo(size, size - radius);
  ctx.quadraticCurveTo(size, size, size - radius, size);
  ctx.lineTo(radius, size);
  ctx.quadraticCurveTo(0, size, 0, size - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();
  ctx.fill();
  
  // Draw play triangle
  ctx.fillStyle = '#FFFFFF';
  const padding = size * 0.3;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(size - padding, size / 2);
  ctx.lineTo(padding, size - padding);
  ctx.closePath();
  ctx.fill();
  
  // Draw skip-forward arrow
  const arrowSize = size * 0.2;
  ctx.beginPath();
  ctx.moveTo(size - padding, size / 2 - arrowSize / 2);
  ctx.lineTo(size - padding + arrowSize, size / 2);
  ctx.lineTo(size - padding, size / 2 + arrowSize / 2);
  ctx.lineTo(size - padding, size / 2 - arrowSize / 2);
  ctx.closePath();
  ctx.fill();
  
  // Save as PNG
  const out = fs.createWriteStream(outputPath);
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  out.on('finish', () => console.log(`Created ${outputPath}`));
}

// Create icons in different sizes
createIcon(16, path.join(__dirname, 'icons', 'icon16.png'));
createIcon(48, path.join(__dirname, 'icons', 'icon48.png'));
createIcon(128, path.join(__dirname, 'icons', 'icon128.png'));
