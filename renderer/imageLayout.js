'use strict';

const {
  CARD_WIDTH,
  CARD_HEIGHT,
  PANEL,
  WEAPON_SAFE,
  COLORS
} = require('../styles/cardStyles');
const {
  roundedRectPath,
  drawLine
} = require('./textLayout');

function drawBackground(ctx, rarityStyle) {
  const background = ctx.createLinearGradient(0, 0, 0, CARD_HEIGHT);
  background.addColorStop(0, COLORS.backgroundTop);
  background.addColorStop(0.45, COLORS.backgroundMiddle);
  background.addColorStop(1, COLORS.backgroundBottom);
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  ctx.save();
  ctx.globalAlpha = rarityStyle.backgroundAccentOpacity ?? 0.20;
  drawLine(ctx, 20, 424, 20, 832, rarityStyle.accent, 2);
  ctx.restore();

  drawLine(ctx, 1.5, 1.5, CARD_WIDTH - 1.5, 1.5, 'rgba(255, 255, 255, 0.065)');
  drawLine(ctx, 1.5, CARD_HEIGHT - 1.5, CARD_WIDTH - 1.5, CARD_HEIGHT - 1.5, 'rgba(255, 255, 255, 0.045)');
  drawLine(ctx, 1.5, 1.5, 1.5, CARD_HEIGHT - 1.5, 'rgba(255, 255, 255, 0.045)');
  drawLine(ctx, CARD_WIDTH - 1.5, 1.5, CARD_WIDTH - 1.5, CARD_HEIGHT - 1.5, 'rgba(255, 255, 255, 0.045)');
}

function drawPanelCorners(ctx, rarityStyle) {
  const { left, top, right, bottom } = PANEL;
  const inset = 8;
  const length = 18;

  ctx.save();
  ctx.strokeStyle = rarityStyle.accent;
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

  const centerX = (left + right) / 2;
  const centerY = (top + bottom) / 2;
  const glow = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, 285);
  glow.addColorStop(0, rarityStyle.glow);
  glow.addColorStop(0.68, 'rgba(0, 0, 0, 0.025)');
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(left, top, width, height);

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
