# War Tycoon Dex Card System

A portable, Discord-free SDK for creating, validating, loading, and rendering War Tycoon Dex weapon cards.

## Installation

Copy this folder into your Node.js project, then install its renderer dependency:

```powershell
npm install @napi-rs/canvas
```

The folder itself has a `package.json`, so if you prefer to treat it as a standalone package or workspace you can run `npm install` inside it instead.

## Quick Start

```js
const Card = require('./Card System');

const metadata = Card.create({
  name: 'ARX-160',
  rarity: 'Secret',
  type: 'Assault Rifle',
  image: '/weapons/arx160.png',
  submittedBy: 'Dead'
});

const buffer = await Card.load(metadata);
```

## API

### `Card.create(metadata)`

Validates and normalizes metadata into JSON-safe form.

```js
const metadata = Card.create({
  name: 'ARX-160',
  rarity: 'Secret',
  type: 'Assault Rifle',
  image: 'https://cdn.example.com/weapons/arx160.png',
  submittedBy: 'Dead'
});
```

This does not save anything. `image` must be a string in `create()` so the result can be stored as JSON.

### `Card.validate(metadata)`

Validates required fields and returns normalized metadata, or throws a `CardSystemError`.

### `Card.load(metadata)`

Validates stored metadata and returns a rendered PNG `Buffer`.

```js
const record = await database.cards.findUnique({ where: { id: cardId } });
const buffer = await Card.load(record.metadata);
```

### `Card.render(metadata)`

Renders directly from already-supplied data. This accepts JSON metadata, local paths, URLs, and runtime `Buffer` image inputs.

```js
const buffer = await Card.render({
  name: 'AK-12',
  rarity: 'Legendary',
  type: 'Assault Rifle',
  image: imageBuffer,
  submittedBy: 'Collector'
});
```

### `Card.getRarities()`

Returns the canonical rarity list:

```js
[
  'Common',
  'Uncommon',
  'Rare',
  'Epic',
  'Legendary',
  'Mythic',
  'Limited',
  'Secret'
]
```

### `Card.getRarity(rarity)`

Returns the normalized rarity style object:

```js
const rarity = Card.getRarity('legendary');
```

Rarity input is case-insensitive.

### `Card.getTypes()`

Returns the supported weapon type list for UI choices.

## Metadata

Version `1` is the current schema:

```json
{
  "version": 1,
  "name": "ARX-160",
  "rarity": "Secret",
  "type": "Assault Rifle",
  "image": "https://cdn.example.com/weapons/arx160.png",
  "submittedBy": "Dead"
}
```

Missing versions are treated as version `1` for backwards compatibility. Unsupported versions throw a `CardSystemError`.

## Image Inputs

The renderer accepts:

- HTTP/HTTPS URL
- local file path
- `Buffer`
- `Uint8Array` / `ArrayBuffer`
- an object with `data`, `buffer`, `path`, `filePath`, `url`, or `src`

Supported formats are PNG, JPEG, and WebP.

## Errors

Card System errors use `CardSystemError` with a stable `code` property:

```text
CardSystemError: Missing required field "name"
CardSystemError: Unsupported rarity "UltraGod"
CardSystemError: Unable to load weapon image
CardSystemError: Unsupported metadata version 4
```

## Database Ownership

The Card System contains no database code. The calling application stores `Card.create()` output however it likes, then calls `Card.load()` later.
