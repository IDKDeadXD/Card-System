'use strict';

const { normalizeMetadata } = require('./validate');

function createMetadata(input) {
  const normalized = normalizeMetadata(input, { jsonSafe: true });

  return {
    version: normalized.version,
    name: normalized.name,
    rarity: normalized.rarity,
    type: normalized.type,
    image: normalized.image,
    ...(normalized.submittedBy ? { submittedBy: normalized.submittedBy } : {})
  };
}

module.exports = {
  createMetadata
};
