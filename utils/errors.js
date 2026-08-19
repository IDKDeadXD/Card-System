'use strict';

class CardSystemError extends Error {
  constructor(message, code = 'CARD_SYSTEM_ERROR', options) {
    super(message, options);
    this.name = 'CardSystemError';
    this.code = code;
  }
}

function cardSystemError(message, code) {
  return new CardSystemError(message, code);
}

module.exports = {
  CardSystemError,
  cardSystemError
};
