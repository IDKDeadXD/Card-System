'use strict';

const { CardSystemError } = require('../utils/errors');

const CURRENT_VERSION = 1;
const SUPPORTED_VERSIONS = new Set([CURRENT_VERSION]);

const CATEGORY_DEFINITIONS = Object.freeze([
  { name: 'Assault Rifle', aliases: ['assault rifle', 'assault', 'ar', 'rifle'] },
  { name: 'Submachine Gun', aliases: ['submachine gun', 'submachine', 'smg'] },
  { name: 'Light Machine Gun', aliases: ['light machine gun', 'lmg', 'machine gun'] },
  { name: 'Sniper Rifle', aliases: ['sniper rifle', 'sniper', 'sr', 'marksman rifle'] },
  { name: 'Shotgun', aliases: ['shotgun', 'sg'] },
  { name: 'Sidearm', aliases: ['sidearm', 'handgun', 'pistol', 'hg'] },
  { name: 'Explosive', aliases: ['explosive', 'explosives', 'exp', 'grenade'] },
  { name: 'Launcher', aliases: ['launcher', 'lch', 'rocket launcher', 'rpg'] },
  { name: 'Special', aliases: ['special', 'spc', 'other'] }
]);

const byAlias = new Map();

for (const definition of CATEGORY_DEFINITIONS) {
  byAlias.set(definition.name.toLowerCase(), definition);

  for (const alias of definition.aliases) {
    byAlias.set(alias.toLowerCase(), definition);
  }
}

function normalizeInput(value) {
  return String(value ?? '').trim().replace(/\s+/g, ' ');
}

function titleCase(value) {
  const words = value.toLowerCase().split(' ').filter(Boolean);
  const smallWords = new Set(['of', 'the', 'and', 'for', 'with']);

  return words
    .map((word, index) => {
      if (index > 0 && smallWords.has(word)) {
        return word;
      }

      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

function normalizeCategory(value) {
  const input = normalizeInput(value);

  if (!input) {
    throw new CardSystemError('Missing required field "type"', 'MISSING_FIELD');
  }

  const known = byAlias.get(input.toLowerCase());

  if (known) {
    return { name: known.name };
  }

  return { name: titleCase(input) };
}

function getTypes() {
  return CATEGORY_DEFINITIONS.map((definition) => definition.name);
}

function assertSupportedVersion(version) {
  if (version === undefined || version === null || version === '') {
    // Version 1 predates explicit versioning, so missing versions are
    // accepted for backwards compatibility.
    return CURRENT_VERSION;
  }

  const numericVersion = Number(version);

  if (!Number.isInteger(numericVersion) || !SUPPORTED_VERSIONS.has(numericVersion)) {
    throw new CardSystemError(
      `Unsupported metadata version ${version}`,
      'UNSUPPORTED_METADATA_VERSION'
    );
  }

  return numericVersion;
}

module.exports = {
  CURRENT_VERSION,
  SUPPORTED_VERSIONS,
  CATEGORY_DEFINITIONS,
  normalizeCategory,
  getTypes,
  assertSupportedVersion
};
