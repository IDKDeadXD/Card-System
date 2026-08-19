'use strict';

const { CardSystemError } = require('../utils/errors');

const RARITY_STYLES = Object.freeze({
  common: {
    key: 'common',
    label: 'Common',
    color: '#9aa4ad',
    accent: '#77828c',
    secondaryAccent: '#59616a',
    glow: 'rgba(154, 164, 173, 0.16)',
    cardTintOpacity: 0,
    panelTintOpacity: 0,
    patternOpacity: 0.09,
    backgroundPatternOpacity: 0.045,
    backgroundAccentOpacity: 0.20,
    borderOpacity: 0.42,
    pattern: 'minimal',
    particleShape: 'diamond',
    particleCount: 0,
    holo: false
  },
  uncommon: {
    key: 'uncommon',
    label: 'Uncommon',
    color: '#7fbf82',
    accent: '#5f9e70',
    secondaryAccent: '#437a52',
    glow: 'rgba(118, 185, 126, 0.20)',
    cardTintOpacity: 0,
    panelTintOpacity: 0,
    patternOpacity: 0.13,
    backgroundPatternOpacity: 0.06,
    backgroundAccentOpacity: 0.22,
    borderOpacity: 0.44,
    pattern: 'hatch',
    particleShape: 'diamond',
    particleCount: 0,
    holo: false
  },
  rare: {
    key: 'rare',
    label: 'Rare',
    color: '#5c9ce6',
    accent: '#3f7fc2',
    secondaryAccent: '#2d5f95',
    glow: 'rgba(76, 141, 214, 0.23)',
    cardTintOpacity: 0,
    panelTintOpacity: 0,
    patternOpacity: 0.16,
    backgroundPatternOpacity: 0.075,
    backgroundAccentOpacity: 0.24,
    borderOpacity: 0.46,
    pattern: 'grid',
    particleShape: 'diamond',
    particleCount: 18,
    holo: false
  },
  epic: {
    key: 'epic',
    label: 'Epic',
    color: '#a878d8',
    accent: '#7d55ad',
    secondaryAccent: '#5b3b82',
    glow: 'rgba(156, 108, 206, 0.25)',
    cardTintOpacity: 0,
    panelTintOpacity: 0,
    patternOpacity: 0.19,
    backgroundPatternOpacity: 0.085,
    backgroundAccentOpacity: 0.26,
    borderOpacity: 0.48,
    pattern: 'angular',
    particleShape: 'diamond',
    particleCount: 32,
    holo: false
  },
  legendary: {
    key: 'legendary',
    label: 'Legendary',
    color: '#d8aa4f',
    accent: '#a87a25',
    secondaryAccent: '#7c5718',
    glow: 'rgba(218, 168, 74, 0.27)',
    cardTintOpacity: 0,
    panelTintOpacity: 0,
    patternOpacity: 0.23,
    backgroundPatternOpacity: 0.10,
    backgroundAccentOpacity: 0.28,
    borderOpacity: 0.51,
    pattern: 'radial',
    particleShape: 'diamond',
    particleCount: 54,
    holo: true
  },
  mythic: {
    key: 'mythic',
    label: 'Mythic',
    color: '#dc6b72',
    accent: '#a53d46',
    secondaryAccent: '#7a2d36',
    glow: 'rgba(215, 91, 101, 0.28)',
    cardTintOpacity: 0,
    panelTintOpacity: 0,
    patternOpacity: 0.25,
    backgroundPatternOpacity: 0.105,
    backgroundAccentOpacity: 0.29,
    borderOpacity: 0.53,
    pattern: 'slash',
    particleShape: 'diamond',
    particleCount: 72,
    holo: true
  },
  limited: {
    key: 'limited',
    label: 'Limited',
    color: '#e58a3a',
    accent: '#c56d26',
    secondaryAccent: '#8f4d18',
    glow: 'rgba(229, 138, 58, 0.27)',
    cardTintOpacity: 0,
    panelTintOpacity: 0,
    patternOpacity: 0.25,
    backgroundPatternOpacity: 0.105,
    backgroundAccentOpacity: 0.29,
    borderOpacity: 0.53,
    pattern: 'banded',
    particleShape: 'diamond',
    particleCount: 66,
    holo: false
  },
  secret: {
    key: 'secret',
    label: 'Secret',
    color: '#e7d8a8',
    accent: '#bfae74',
    secondaryAccent: '#8d7e4e',
    glow: 'rgba(235, 225, 190, 0.30)',
    cardTintOpacity: 0,
    panelTintOpacity: 0,
    patternOpacity: 0.27,
    backgroundPatternOpacity: 0.115,
    backgroundAccentOpacity: 0.31,
    borderOpacity: 0.56,
    pattern: 'prismatic',
    particleShape: 'dot',
    particleCount: 84,
    holo: true
  }
});

const RARITY_ALIASES = Object.freeze({
  common: ['common', 'c', 'gray', 'grey'],
  uncommon: ['uncommon', 'uc', 'green'],
  rare: ['rare', 'r', 'blue'],
  epic: ['epic', 'e', 'purple'],
  legendary: ['legendary', 'leg', 'l', 'gold'],
  mythic: ['mythic', 'm', 'red', 'crimson'],
  limited: ['limited', 'lim', 'copper', 'orange', 'amber'],
  secret: ['secret', 's', 'platinum', 'pale gold', 'pale']
});

const aliasToKey = new Map();

for (const [key, aliases] of Object.entries(RARITY_ALIASES)) {
  for (const alias of aliases) {
    aliasToKey.set(alias, key);
  }
}

function normalizeKey(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function normalizeRarity(value) {
  const normalized = normalizeKey(value);
  const key = aliasToKey.get(normalized) ?? normalized;

  if (!RARITY_STYLES[key]) {
    throw new CardSystemError(
      `Unsupported rarity "${value}". Supported rarities: Common, Uncommon, Rare, Epic, Legendary, Mythic, Limited, Secret.`,
      'INVALID_RARITY'
    );
  }

  return key;
}

function getRarityStyle(value) {
  return RARITY_STYLES[normalizeRarity(value)];
}

function getRarities() {
  return Object.values(RARITY_STYLES).map((style) => style.label);
}

module.exports = {
  RARITY_STYLES,
  normalizeRarity,
  getRarityStyle,
  getRarities
};
