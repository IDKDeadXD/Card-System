'use strict';

const { normalizeMetadata } = require('./validate');
const { renderCard } = require('../renderer/renderCard');

function loadCard(metadata) {
  const normalized = normalizeMetadata(metadata);
  return renderCard(normalized);
}

module.exports = {
  loadCard
};
