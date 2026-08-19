'use strict';

const { FONTS, registerFonts } = require('../utils/files');

const CARD_WIDTH = 680;
const CARD_HEIGHT = 960;

const OUTER_RADIUS = 18;
const CONTENT_LEFT = 42;
const CONTENT_RIGHT = CARD_WIDTH - CONTENT_LEFT;
const CONTENT_WIDTH = CONTENT_RIGHT - CONTENT_LEFT;

const PANEL = {
  left: 28,
  top: 26,
  right: 652,
  bottom: 392,
  radius: 12
};

const WEAPON_SAFE = {
  left: 64,
  right: 616,
  top: 62,
  bottom: 356
};

const BASELINES = {
  name: 492,
  rarity: 556,
  type: 606,
  submittedBy: 690,
  footerLine: 852,
  brand: 902
};

const COLORS = Object.freeze({
  backgroundTop: '#101419',
  backgroundMiddle: '#0d1115',
  backgroundBottom: '#080a0d',
  panelTop: '#12171c',
  panelBottom: '#0b0e11',
  name: '#f4f6f8',
  typeValue: '#dce2e8',
  label: 'rgba(227, 233, 238, 0.46)',
  submittedBy: 'rgba(224, 229, 234, 0.54)',
  brand: 'rgba(231, 236, 240, 0.58)',
  separator: 'rgba(255, 255, 255, 0.075)'
});

module.exports = {
  FONTS,
  registerFonts,
  CARD_WIDTH,
  CARD_HEIGHT,
  OUTER_RADIUS,
  CONTENT_LEFT,
  CONTENT_RIGHT,
  CONTENT_WIDTH,
  PANEL,
  WEAPON_SAFE,
  BASELINES,
  COLORS
};
