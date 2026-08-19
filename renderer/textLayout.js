'use strict';

const { FONTS } = require('../styles/cardStyles');

function hashString(value) {
  let hash = 2166136261;
  const text = String(value);

  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function mulberry32(seed) {
  let value = seed;

  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function roundedRectPath(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);

  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function measureText(ctx, text, font, spacing = 0) {
  ctx.font = font;

  if (spacing <= 0) {
    return ctx.measureText(text).width;
  }

  const characters = Array.from(text);
  let width = 0;

  for (let i = 0; i < characters.length; i += 1) {
    width += ctx.measureText(characters[i]).width;
    if (i < characters.length - 1) {
      width += spacing;
    }
  }

  return width;
}

function drawSpacedText(ctx, text, x, y, { font, color, align = 'left', spacing = 0 }) {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textBaseline = 'alphabetic';

  if (spacing <= 0) {
    ctx.textAlign = align;
    ctx.fillText(text, x, y);
    return;
  }

  const characters = Array.from(text);
  const totalWidth = measureText(ctx, text, font, spacing);
  let cursorX = x;

  if (align === 'right') {
    cursorX = x - totalWidth;
  } else if (align === 'center') {
    cursorX = x - totalWidth / 2;
  }

  ctx.textAlign = 'left';

  for (let i = 0; i < characters.length; i += 1) {
    ctx.fillText(characters[i], cursorX, y);
    cursorX += ctx.measureText(characters[i]).width + spacing;
  }
}

function fitFontSize(ctx, text, family, maxWidth, startSize, minSize, spacing = 0) {
  let size = startSize;

  while (size > minSize) {
    const font = `${size}px "${family}"`;
    if (measureText(ctx, text, font, spacing) <= maxWidth) {
      return { size, font };
    }

    size -= 1;
  }

  const font = `${minSize}px "${family}"`;
  return { size: minSize, font };
}

function drawLine(ctx, x1, y1, x2, y2, color, width = 1) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

function drawPolygon(ctx, points, fill) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);

  for (const [x, y] of points.slice(1)) {
    ctx.lineTo(x, y);
  }

  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

module.exports = {
  FONTS,
  hashString,
  mulberry32,
  roundedRectPath,
  measureText,
  drawSpacedText,
  fitFontSize,
  drawLine,
  drawPolygon
};
