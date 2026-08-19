'use strict';

const path = require('node:path');
const { GlobalFonts } = require('@napi-rs/canvas');

const cardSystemRoot = path.resolve(__dirname, '..');
const fontRoot = path.join(cardSystemRoot, 'assets', 'fonts');

const FONT_FILES = Object.freeze({
  'Barlow Condensed Bold': 'BarlowCondensed-Bold.ttf',
  'Barlow Condensed Medium': 'BarlowCondensed-Medium.ttf',
  'Barlow Condensed Regular': 'BarlowCondensed-Regular.ttf',
  'Rajdhani Regular': 'Rajdhani-Regular.ttf',
  'Rajdhani Medium': 'Rajdhani-Medium.ttf',
  'Rajdhani SemiBold': 'Rajdhani-SemiBold.ttf',
  'Rajdhani Bold': 'Rajdhani-Bold.ttf'
});

const FONTS = Object.freeze({
  NAME: 'Barlow Condensed Bold',
  CATEGORY: 'Barlow Condensed Medium',
  BODY: 'Rajdhani Regular',
  BODY_MEDIUM: 'Rajdhani Medium',
  BODY_SEMIBOLD: 'Rajdhani SemiBold',
  BODY_BOLD: 'Rajdhani Bold'
});

let fontsRegistered = false;

function registerFonts() {
  if (fontsRegistered) {
    return;
  }

  for (const [family, filename] of Object.entries(FONT_FILES)) {
    GlobalFonts.registerFromPath(path.join(fontRoot, filename), family);
  }

  fontsRegistered = true;
}

function resolveAssetPath(...segments) {
  return path.join(cardSystemRoot, 'assets', ...segments);
}

module.exports = {
  cardSystemRoot,
  fontRoot,
  FONTS,
  registerFonts,
  resolveAssetPath
};
