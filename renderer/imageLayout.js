'use strict';

const {
  CARD_WIDTH,
  CARD_HEIGHT,
  PANEL,
  WEAPON_SAFE,
  COLORS
} = require('../styles/cardStyles');
const {
  hashString,
  mulberry32,
  roundedRectPath,
  drawLine,
  drawPolygon
} = require('./textLayout');

function drawRarityBackgroundAccents(ctx, rarityStyle) {
  const pattern = rarityStyle.pattern ?? 'minimal';
  const accent = rarityStyle.accent;

  ctx.save();
  ctx.strokeStyle = accent;
  ctx.fillStyle = accent;
  ctx.lineWidth = 1;

  if (pattern === 'hatch') {
    ctx.globalAlpha = rarityStyle.backgroundPatternOpacity * 1.2;

    for (let offset = 0; offset < 180; offset += 26) {
      drawLine(ctx, 480 + offset, 0, 680, 200 - offset, accent, 1);
    }

    ctx.globalAlpha = rarityStyle.backgroundPatternOpacity * 0.85;
    for (let offset = 0; offset < 160; offset += 28) {
      drawLine(ctx, 0, 790 + offset, 160 - offset, 950, accent, 1);
    }
  } else if (pattern === 'grid') {
    ctx.globalAlpha = rarityStyle.backgroundPatternOpacity * 1.25;

    for (let x = 470; x <= 650; x += 22) {
      drawLine(ctx, x, 20, x, 150, accent, 1);
    }

    for (let y = 24; y <= 150; y += 22) {
      drawLine(ctx, 470, y, 650, y, accent, 1);
    }
  } else if (pattern === 'angular') {
    ctx.globalAlpha = rarityStyle.backgroundPatternOpacity;
    drawPolygon(ctx, [[480, 0], [680, 150], [680, 250], [560, 0]], 'rgba(0, 0, 0, 0)');
    drawLine(ctx, 480, 0, 680, 150, accent, 1);
    drawLine(ctx, 680, 150, 560, 0, accent, 1);
    drawLine(ctx, 560, 0, 680, 250, accent, 1);
    drawLine(ctx, 680, 250, 680, 0, accent, 1);
  } else if (pattern === 'radial') {
    ctx.globalAlpha = rarityStyle.backgroundPatternOpacity;

    for (let i = 0; i < 5; i += 1) {
      const x = 680 - i * 40;
      drawLine(ctx, x, 0, 680, 180 + i * 24, accent, 1);
    }

    ctx.globalAlpha = rarityStyle.backgroundPatternOpacity * 0.7;
    drawLine(ctx, 0, 820, 130, 960, accent, 1);
    drawLine(ctx, 60, 790, 190, 960, accent, 1);
  } else if (pattern === 'slash') {
    ctx.globalAlpha = rarityStyle.backgroundPatternOpacity * 1.2;

    for (let offset = 0; offset < 160; offset += 30) {
      drawLine(ctx, 470 + offset, 0, 680, 210 - offset, accent, 1);
    }

    ctx.globalAlpha = rarityStyle.backgroundPatternOpacity * 0.85;
    for (let offset = 0; offset < 150; offset += 28) {
      drawLine(ctx, 0, 800 + offset, 150 - offset, 950, accent, 1);
    }
  } else if (pattern === 'banded') {
    ctx.globalAlpha = rarityStyle.backgroundPatternOpacity * 1.3;

    for (let y = 24; y < 170; y += 24) {
      drawLine(ctx, 470, y, 680, y, accent, 1);
    }

    for (let y = 790; y < 930; y += 24) {
      drawLine(ctx, 0, y, 160, y, accent, 1);
    }
  } else if (pattern === 'prismatic') {
    ctx.globalAlpha = rarityStyle.backgroundPatternOpacity;
    ctx.beginPath();
    ctx.arc(610, 100, 78, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(70, 880, 58, 0, Math.PI * 2);
    ctx.stroke();

    ctx.globalAlpha = rarityStyle.backgroundPatternOpacity * 1.25;
    drawLine(ctx, 470, 0, 680, 210, accent, 1);
    drawLine(ctx, 0, 950, 160, 790, accent, 1);
  }

  ctx.restore();
}

function drawBackground(ctx, rarityStyle) {
  const background = ctx.createLinearGradient(0, 0, 0, CARD_HEIGHT);
  background.addColorStop(0, COLORS.backgroundTop);
  background.addColorStop(0.45, COLORS.backgroundMiddle);
  background.addColorStop(1, COLORS.backgroundBottom);
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  drawPolygon(ctx, [[CARD_WIDTH * 0.64, 0], [CARD_WIDTH, 0], [CARD_WIDTH, 410], [CARD_WIDTH * 0.42, 560]], 'rgba(255, 255, 255, 0.011)');
  drawPolygon(ctx, [[0, CARD_HEIGHT - 160], [CARD_WIDTH, CARD_HEIGHT - 76], [CARD_WIDTH, CARD_HEIGHT], [0, CARD_HEIGHT]], 'rgba(255, 255, 255, 0.008)');

  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.016)';
  ctx.lineWidth = 1;

  for (let x = 0; x <= CARD_WIDTH; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, CARD_HEIGHT);
    ctx.stroke();
  }

  for (let y = 0; y <= CARD_HEIGHT; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(CARD_WIDTH, y);
    ctx.stroke();
  }

  ctx.restore();

  const random = mulberry32(hashString('war-tycoon-dex-card-surface'));
  ctx.save();
  ctx.fillStyle = '#ffffff';

  for (let i = 0; i < 240; i += 1) {
    const x = random() * CARD_WIDTH;
    const y = random() * CARD_HEIGHT;
    ctx.globalAlpha = 0.018 + random() * 0.045;
    ctx.fillRect(x, y, random() > 0.86 ? 1.5 : 1, 1);
  }

  ctx.restore();

  drawRarityBackgroundAccents(ctx, rarityStyle);

  ctx.save();
  ctx.globalAlpha = rarityStyle.backgroundAccentOpacity ?? 0.20;
  drawLine(ctx, 20, 424, 20, 832, rarityStyle.accent, 2);
  ctx.restore();

  drawLine(ctx, 1.5, 1.5, CARD_WIDTH - 1.5, 1.5, 'rgba(255, 255, 255, 0.065)');
  drawLine(ctx, 1.5, CARD_HEIGHT - 1.5, CARD_WIDTH - 1.5, CARD_HEIGHT - 1.5, 'rgba(255, 255, 255, 0.045)');
  drawLine(ctx, 1.5, 1.5, 1.5, CARD_HEIGHT - 1.5, 'rgba(255, 255, 255, 0.045)');
  drawLine(ctx, CARD_WIDTH - 1.5, 1.5, CARD_WIDTH - 1.5, CARD_HEIGHT - 1.5, 'rgba(255, 255, 255, 0.045)');
}

function drawParticles(ctx, rarityStyle) {
  if (!rarityStyle.particleCount) {
    return;
  }

  const random = mulberry32(hashString(`wtd:${rarityStyle.key}`));
  const { left, top, right, bottom } = PANEL;

  ctx.save();
  ctx.fillStyle = rarityStyle.color;

  for (let i = 0; i < rarityStyle.particleCount; i += 1) {
    const x = left + 24 + random() * (right - left - 48);
    const y = top + 22 + random() * (bottom - top - 44);
    const size = 0.7 + random() * 2.0;

    ctx.globalAlpha = 0.05 + random() * 0.14;

    if (rarityStyle.particleShape === 'dot') {
      ctx.beginPath();
      ctx.arc(x, y, size * 0.72, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(x, y - size);
      ctx.lineTo(x + size, y);
      ctx.lineTo(x, y + size);
      ctx.lineTo(x - size, y);
      ctx.closePath();
      ctx.fill();
    }
  }

  ctx.restore();
}

function drawPanelCorners(ctx, rarityStyle) {
  const { left, top, right, bottom } = PANEL;
  const inset = 8;
  const length = 18;
  const color = rarityStyle.accent;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.globalAlpha = rarityStyle.borderOpacity ?? 0.52;
  ctx.lineWidth = 2;
  ctx.lineCap = 'square';

  const corners = [
    [left + inset, top + inset, 1, 1],
    [right - inset, top + inset, -1, 1],
    [left + inset, bottom - inset, 1, -1],
    [right - inset, bottom - inset, -1, -1]
  ];

  for (const [x, y, dx, dy] of corners) {
    ctx.beginPath();
    ctx.moveTo(x, y + dy * length);
    ctx.lineTo(x, y);
    ctx.lineTo(x + dx * length, y);
    ctx.stroke();
  }

  ctx.restore();
}

function drawPanelPattern(ctx, rarityStyle) {
  const { left, top, right, bottom } = PANEL;
  const pattern = rarityStyle.pattern ?? 'minimal';
  const accent = rarityStyle.accent;

  ctx.save();
  ctx.strokeStyle = accent;
  ctx.fillStyle = accent;
  ctx.lineWidth = 1;

  if (pattern === 'minimal') {
    ctx.globalAlpha = rarityStyle.patternOpacity * 0.65;
    drawLine(ctx, left + 18, top + 18, right - 18, top + 18, accent, 1);
    drawLine(ctx, left + 18, bottom - 18, right - 18, bottom - 18, accent, 1);
  } else if (pattern === 'hatch') {
    ctx.globalAlpha = rarityStyle.patternOpacity * 0.75;

    for (let offset = -bottom + top; offset < right - left; offset += 26) {
      drawLine(ctx, left + offset, bottom, left + offset + (bottom - top), top, accent, 1);
    }
  } else if (pattern === 'grid') {
    ctx.globalAlpha = rarityStyle.patternOpacity;

    for (let x = left + 18; x <= right - 18; x += 26) {
      drawLine(ctx, x, top + 14, x, bottom - 14, accent, 1);
    }

    for (let y = top + 14; y <= bottom - 14; y += 26) {
      drawLine(ctx, left + 18, y, right - 18, y, accent, 1);
    }
  } else if (pattern === 'angular') {
    ctx.globalAlpha = rarityStyle.patternOpacity;
    drawLine(ctx, left + 18, bottom - 18, right - 18, top + 18, accent, 1);
    drawLine(ctx, left + 18, top + 18, right - 18, bottom - 18, accent, 1);
    drawLine(ctx, left + 18, top + 18, right - 18, top + 18, accent, 1);
  } else if (pattern === 'radial') {
    const centerX = (left + right) / 2;
    const centerY = (top + bottom) / 2;
    ctx.globalAlpha = rarityStyle.patternOpacity * 0.85;

    for (let i = -3; i <= 3; i += 1) {
      drawLine(ctx, centerX, centerY, right - 18, top + 18 + i * 34, accent, 1);
    }

    ctx.beginPath();
    ctx.arc(centerX, centerY, 148, 0, Math.PI * 2);
    ctx.stroke();
  } else if (pattern === 'slash') {
    ctx.globalAlpha = rarityStyle.patternOpacity * 0.9;

    for (let offset = -70; offset < right - left; offset += 42) {
      drawLine(ctx, left + offset, bottom, left + offset + 170, top, accent, 1);
    }
  } else if (pattern === 'banded') {
    ctx.globalAlpha = rarityStyle.patternOpacity * 0.9;

    for (let y = top + 20; y <= bottom - 20; y += 34) {
      drawLine(ctx, left + 18, y, right - 18, y, accent, 1);
    }
  } else if (pattern === 'prismatic') {
    const centerX = (left + right) / 2;
    const centerY = (top + bottom) / 2;
    ctx.globalAlpha = rarityStyle.patternOpacity * 0.85;

    for (let radius = 110; radius <= 190; radius += 28) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.globalAlpha = rarityStyle.patternOpacity * 1.1;
    drawLine(ctx, left + 18, bottom - 18, right - 18, top + 18, accent, 1);
  }

  ctx.restore();
}

function drawWeaponPanel(ctx, rarityStyle) {
  const { left, top, right, bottom, radius } = PANEL;
  const width = right - left;
  const height = bottom - top;

  roundedRectPath(ctx, left, top, width, height, radius);

  const panelGradient = ctx.createLinearGradient(0, top, 0, bottom);
  panelGradient.addColorStop(0, COLORS.panelTop);
  panelGradient.addColorStop(1, COLORS.panelBottom);
  ctx.fillStyle = panelGradient;
  ctx.fill();

  ctx.save();
  roundedRectPath(ctx, left, top, width, height, radius);
  ctx.clip();

  drawPanelPattern(ctx, rarityStyle);

  const centerX = (left + right) / 2;
  const centerY = (top + bottom) / 2;
  const glow = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, 285);
  glow.addColorStop(0, rarityStyle.glow);
  glow.addColorStop(0.68, 'rgba(0, 0, 0, 0.025)');
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(left, top, width, height);

  drawParticles(ctx, rarityStyle);

  ctx.restore();

  ctx.save();
  roundedRectPath(ctx, left, top, width, height, radius);
  ctx.strokeStyle = rarityStyle.accent;
  ctx.globalAlpha = rarityStyle.borderOpacity ?? 0.52;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();

  roundedRectPath(ctx, left + 4, top + 4, width - 8, height - 8, Math.max(2, radius - 4));
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
  ctx.lineWidth = 1;
  ctx.stroke();

  drawPanelCorners(ctx, rarityStyle);
}

function drawWeapon(ctx, weapon, width, height) {
  const regionWidth = WEAPON_SAFE.right - WEAPON_SAFE.left;
  const regionHeight = WEAPON_SAFE.bottom - WEAPON_SAFE.top;
  const maxUpscale = 1.35;
  const scale = Math.min(regionWidth / width, regionHeight / height, maxUpscale);
  const drawWidth = width * scale;
  const drawHeight = height * scale;
  const centerX = (WEAPON_SAFE.left + WEAPON_SAFE.right) / 2;
  const centerY = (WEAPON_SAFE.top + WEAPON_SAFE.bottom) / 2;
  const drawX = centerX - drawWidth / 2;
  const drawY = centerY - drawHeight / 2;

  ctx.save();
  ctx.translate(centerX, centerY + drawHeight * 0.16);
  ctx.scale(1, 0.38);
  const shadow = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(drawWidth, drawHeight) * 0.52);
  shadow.addColorStop(0, 'rgba(0, 0, 0, 0.30)');
  shadow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = shadow;
  ctx.beginPath();
  ctx.arc(0, 0, Math.max(drawWidth, drawHeight) * 0.52, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(weapon, drawX, drawY, drawWidth, drawHeight);
}

module.exports = {
  drawBackground,
  drawWeaponPanel,
  drawWeapon
};
