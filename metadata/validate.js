'use strict';

const { CardSystemError } = require('../utils/errors');
const { getRarityStyle, normalizeRarity } = require('../styles/rarities');
const { normalizeCategory, assertSupportedVersion } = require('./schema');

const MAX_NAME_LENGTH = 80;
const MAX_SUBMITTED_BY_LENGTH = 60;

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isSupportedImageInput(value) {
  if (Buffer.isBuffer(value)) {
    return true;
  }

  if (value instanceof Uint8Array || value instanceof ArrayBuffer) {
    return true;
  }

  if (typeof value === 'string' && value.trim()) {
    return true;
  }

  if (isObject(value)) {
    return Boolean(
      Buffer.isBuffer(value.data) ||
      Buffer.isBuffer(value.buffer) ||
      value.data instanceof Uint8Array ||
      typeof value.path === 'string' ||
      typeof value.filePath === 'string' ||
      typeof value.url === 'string' ||
      typeof value.src === 'string'
    );
  }

  return false;
}

function normalizeMetadata(input, { jsonSafe = false } = {}) {
  if (!isObject(input)) {
    throw new CardSystemError('Card metadata must be an object.', 'INVALID_METADATA');
  }

  const version = assertSupportedVersion(input.version);

  if (!input.name || !String(input.name).trim()) {
    throw new CardSystemError('Missing required field "name"', 'MISSING_FIELD');
  }

  const name = String(input.name).trim();

  if (name.length > MAX_NAME_LENGTH) {
    throw new CardSystemError(
      `Weapon name must be ${MAX_NAME_LENGTH} characters or fewer.`,
      'INVALID_NAME'
    );
  }

  const rarityKey = normalizeRarity(input.rarity);
  const rarityStyle = getRarityStyle(rarityKey);
  const type = normalizeCategory(input.type).name;

  if (!isSupportedImageInput(input.image)) {
    throw new CardSystemError('Missing required field "image"', 'MISSING_FIELD');
  }

  if (jsonSafe && typeof input.image !== 'string') {
    throw new CardSystemError(
      'Card.create() requires a JSON-safe image string. Use Card.render() for Buffer inputs.',
      'NON_JSON_IMAGE'
    );
  }

  let submittedBy;

  if (input.submittedBy !== undefined && input.submittedBy !== null && input.submittedBy !== '') {
    if (typeof input.submittedBy !== 'string') {
      throw new CardSystemError(
        'The "submittedBy" field must be a string.',
        'INVALID_SUBMITTED_BY'
      );
    }

    submittedBy = input.submittedBy.trim();

    if (submittedBy.length > MAX_SUBMITTED_BY_LENGTH) {
      throw new CardSystemError(
        `"submittedBy" must be ${MAX_SUBMITTED_BY_LENGTH} characters or fewer.`,
        'INVALID_SUBMITTED_BY'
      );
    }
  }

  const metadata = {
    version,
    name,
    rarity: rarityStyle.label,
    type,
    image: input.image
  };

  if (submittedBy) {
    metadata.submittedBy = submittedBy;
  }

  return metadata;
}

function validateMetadata(input, options) {
  return normalizeMetadata(input, options);
}

module.exports = {
  validateMetadata,
  normalizeMetadata,
  isSupportedImageInput
};
