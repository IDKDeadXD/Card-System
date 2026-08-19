'use strict';

const { createMetadata } = require('./metadata/create');
const { loadCard } = require('./metadata/load');
const { validateMetadata } = require('./metadata/validate');
const { renderCard } = require('./renderer/renderCard');
const { getRarities, getRarityStyle } = require('./styles/rarities');
const { getTypes, CURRENT_VERSION } = require('./metadata/schema');
const { CardSystemError } = require('./utils/errors');

const Card = {
  CardSystemError,

  create(metadata) {
    return createMetadata(metadata);
  },

  validate(metadata) {
    return validateMetadata(metadata);
  },

  async render(metadata) {
    return renderCard(metadata);
  },

  async load(metadata) {
    return loadCard(metadata);
  },

  getRarities() {
    return getRarities();
  },

  getRarity(rarity) {
    return { ...getRarityStyle(rarity) };
  },

  getTypes() {
    return getTypes();
  },

  getVersion() {
    return CURRENT_VERSION;
  }
};

module.exports = Card;
