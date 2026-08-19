'use strict';

const fs = require('node:fs/promises');
const { loadImage } = require('@napi-rs/canvas');
const { CardSystemError } = require('./errors');

const SUPPORTED_IMAGE_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp'
]);

const SUPPORTED_IMAGE_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.webp'
]);

const DEFAULT_MAX_IMAGE_BYTES = 12 * 1024 * 1024;
const DEFAULT_MAX_IMAGE_PIXELS = 24_000_000;

function getExtensionFromName(name) {
  if (!name) {
    return '';
  }

  const match = String(name).toLowerCase().match(/\.[a-z0-9]+$/);
  return match ? match[0] : '';
}

function assertSupportedImage({
  contentType,
  name,
  size,
  maxBytes = DEFAULT_MAX_IMAGE_BYTES
} = {}) {
  const extension = getExtensionFromName(name);
  const normalizedType = String(contentType ?? '').toLowerCase().split(';')[0].trim();
  const supportedType = SUPPORTED_IMAGE_MIME_TYPES.has(normalizedType);
  const supportedExtension = SUPPORTED_IMAGE_EXTENSIONS.has(extension);

  if (normalizedType && !supportedType) {
    throw new CardSystemError(
      `Unsupported image format "${normalizedType}". Use PNG, JPEG, or WebP.`,
      'UNSUPPORTED_IMAGE'
    );
  }

  if (!supportedType && !supportedExtension) {
    throw new CardSystemError(
      'Unsupported image format. Use a PNG, JPEG, or WebP image.',
      'UNSUPPORTED_IMAGE'
    );
  }

  if (size !== undefined && size !== null && Number(size) > maxBytes) {
    throw new CardSystemError(
      `Image is too large (${Math.ceil(Number(size) / 1024 / 1024)} MB). The limit is ${Math.ceil(maxBytes / 1024 / 1024)} MB.`,
      'IMAGE_TOO_LARGE'
    );
  }
}

async function fetchImageBuffer({
  url,
  maxBytes = DEFAULT_MAX_IMAGE_BYTES,
  timeoutMs = 15_000
} = {}) {
  if (!url) {
    throw new CardSystemError('Image URL is missing.', 'DOWNLOAD_FAILED');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  let response;

  try {
    response = await fetch(url, { signal: controller.signal });
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new CardSystemError('Image download timed out.', 'DOWNLOAD_TIMEOUT');
    }

    throw new CardSystemError('Unable to load weapon image.', 'DOWNLOAD_FAILED');
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new CardSystemError(
      `Image download failed with status ${response.status}.`,
      'DOWNLOAD_FAILED'
    );
  }

  const contentLength = Number(response.headers.get('content-length') ?? 0);
  if (contentLength > maxBytes) {
    throw new CardSystemError('Image is too large to process.', 'IMAGE_TOO_LARGE');
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (buffer.byteLength > maxBytes) {
    throw new CardSystemError('Image is too large to process.', 'IMAGE_TOO_LARGE');
  }

  return buffer;
}

async function bufferFromInput(input) {
  if (Buffer.isBuffer(input)) {
    return input;
  }

  if (input instanceof Uint8Array) {
    return Buffer.from(input);
  }

  if (input instanceof ArrayBuffer) {
    return Buffer.from(input);
  }

  if (input && typeof input === 'object') {
    if (Buffer.isBuffer(input.data)) {
      return input.data;
    }

    if (Buffer.isBuffer(input.buffer)) {
      return input.buffer;
    }

    if (input.data instanceof Uint8Array) {
      return Buffer.from(input.data);
    }

    const pathValue = input.path ?? input.filePath;
    if (pathValue) {
      return fs.readFile(pathValue);
    }

    const url = input.url ?? input.src;
    if (url) {
      return fetchImageBuffer({ url, maxBytes: input.maxBytes });
    }
  }

  if (typeof input === 'string') {
    if (/^https?:\/\//i.test(input)) {
      return fetchImageBuffer({ url: input });
    }

    return fs.readFile(input);
  }

  throw new CardSystemError('A weapon image source is required.', 'MISSING_IMAGE');
}

async function loadWeaponImage(
  input,
  {
    maxPixels = DEFAULT_MAX_IMAGE_PIXELS,
    maxBytes = DEFAULT_MAX_IMAGE_BYTES
  } = {}
) {
  const buffer = await bufferFromInput(input);

  if (buffer.byteLength > maxBytes) {
    throw new CardSystemError('Image is too large to process.', 'IMAGE_TOO_LARGE');
  }

  let image;

  try {
    image = await loadImage(buffer);
  } catch {
    throw new CardSystemError(
      'Unable to load weapon image. Make sure it is a valid PNG, JPEG, or WebP.',
      'INVALID_IMAGE'
    );
  }

  const width = image.width;
  const height = image.height;

  if (!width || !height) {
    throw new CardSystemError('Weapon image has invalid dimensions.', 'INVALID_IMAGE');
  }

  if (width * height > maxPixels) {
    throw new CardSystemError(
      `Image has too many pixels (${width}x${height}). Use an image under ${Math.round(maxPixels / 1_000_000)} megapixels.`,
      'IMAGE_TOO_LARGE'
    );
  }

  return { image, width, height };
}

module.exports = {
  SUPPORTED_IMAGE_MIME_TYPES,
  SUPPORTED_IMAGE_EXTENSIONS,
  DEFAULT_MAX_IMAGE_BYTES,
  DEFAULT_MAX_IMAGE_PIXELS,
  assertSupportedImage,
  fetchImageBuffer,
  loadWeaponImage
};
