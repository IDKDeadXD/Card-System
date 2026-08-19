'use strict';

const { createCanvas } = require('@napi-rs/canvas');
const {
  FONTS,
  registerFonts,
  CARD_WIDTH,
  CARD_HEIGHT,
  OUTER_RADIUS,
  CONTENT_LEFT,
  CONTENT_RIGHT,
  CONTENT_WIDTH,
  BASELINES,
  COLORS
} = require('../styles/cardStyles');
const { normalizeRarity, getRarityStyle } = require('../styles/rarities');
const { validateMetadata } = require('../metadata/validate');
const { loadWeaponImage } = require('../utils/images');
const {
  roundedRectPath,
  drawSpacedText,
  drawLine,
  measureText,
  fitFontSize
} = require('./textLayout');
const {
  drawBackground,
  drawWeaponPanel,
  drawWeapon
} = require('./imageLayout');

function drawMetaRow(ctx, label, value, y, labelColor, valueColor) {
  const labelFont = `23px "${FONTS.BODY_SEMIBOLD}"`;
  const labelText = `${label}: `;
  const labelWidth = measureText(ctx, labelText, labelFont, 1.2);
  const valueFit = fitFontSize(ctx, value, FONTS.BODY_SEMIBOLD, CONTENT_WIDTH - labelWidth, 23, 16, 1.2);

  drawSpacedText(ctx, labelText, CONTENT_LEFT, y, {
    font: labelFont,
    color: labelColor,
    spacing: 1.2
  });

  drawSpacedText(ctx, value, CONTENT_LEFT + labelWidth, y, {
    font: valueFit.font,
    color: valueColor,
    spacing: 1.2
  });
}

function drawInfoArea(ctx, name, type, rarityStyle, submittedBy) {
  const nameFit = fitFontSize(ctx, name, FONTS.NAME, CONTENT_WIDTH, 78, 32);

  drawSpacedText(ctx, name, CONTENT_LEFT, BASELINES.name, {
    font: nameFit.font,
    color: COLORS.name
  });

  drawMetaRow(
    ctx,
    'RARITY',
    rarityStyle.label.toUpperCase(),
    BASELINES.rarity,
    COLORS.label,
    rarityStyle.color
  );

  drawMetaRow(
    ctx,
    'TYPE',
    type.toUpperCase(),
    BASELINES.type,
    COLORS.label,
    COLORS.typeValue
  );

  if (submittedBy) {
    const submittedText = `Submitted by ${submittedBy}`;
    const submittedFit = fitFontSize(ctx, submittedText, FONTS.BODY_MEDIUM, CONTENT_WIDTH, 19, 15, 0.4);

    drawSpacedText(ctx, submittedText, CONTENT_LEFT, BASELINES.submittedBy, {
      font: submittedFit.font,
      color: COLORS.submittedBy,
      spacing: 0.4
    });
  }

  drawLine(ctx, CONTENT_LEFT, BASELINES.footerLine, CONTENT_RIGHT, BASELINES.footerLine, COLORS.separator);
  drawLine(ctx, CONTENT_LEFT, BASELINES.footerLine, CONTENT_LEFT + 74, BASELINES.footerLine, rarityStyle.accent, 2);

  drawSpacedText(ctx, 'WAR TYCOON DEX', CONTENT_LEFT, BASELINES.brand, {
    font: `15px "${FONTS.BODY_SEMIBOLD}"`,
    color: COLORS.brand,
    spacing: 2.2
  });
}

async function renderCard(input) {
  const metadata = validateMetadata(input);
  const rarityStyle = getRarityStyle(normalizeRarity(metadata.rarity));

  registerFonts();

  const loaded = await loadWeaponImage(metadata.image);
  const canvas = createCanvas(CARD_WIDTH, CARD_HEIGHT);
  const ctx = canvas.getContext('2d');

  ctx.textBaseline = 'alphabetic';
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.save();
  roundedRectPath(ctx, 0, 0, CARD_WIDTH, CARD_HEIGHT, OUTER_RADIUS);
  ctx.clip();

  drawBackground(ctx, rarityStyle);
  drawWeaponPanel(ctx, rarityStyle);
  drawWeapon(ctx, loaded.image, loaded.width, loaded.height);
  drawInfoArea(ctx, metadata.name, metadata.type, rarityStyle, metadata.submittedBy);

  ctx.restore();

  return canvas.encode('png');
}

module.exports = {
  renderCard
};
