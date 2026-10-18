import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeDaysSince,
  clampRangeInput,
  formatSeconds,
  parseLetterBlocks,
  normalizeRoute,
  tokenizeInlineIcons,
  getChapterNumber,
  createPlantedFlower,
  computeDodgeOffset,
  validatePasscode,
  extractYouTubeId,
  computeGardenSunriseProgress,
} from './proposalLogic.ts';

test('validatePasscode accepts 0710 and 1007 and never reveals hints or dates in error messages', () => {
  assert.equal(validatePasscode('0710').isValid, true);
  assert.equal(validatePasscode('1007').isValid, true);
  assert.equal(validatePasscode('07').isComplete, false);
  const wrong = validatePasscode('9999');
  assert.equal(wrong.isValid, false);
  assert.equal(wrong.errorMessage.includes('0710'), false);
  assert.equal(wrong.errorMessage.toLowerCase().includes('october'), false);
  assert.equal(wrong.errorMessage.toLowerCase().includes('ddmm'), false);
});

test('computeGardenSunriseProgress scales linearly from 0 flowers (0) to 10 flowers (1)', () => {
  assert.equal(computeGardenSunriseProgress(0), 0);
  assert.equal(computeGardenSunriseProgress(5), 0.5);
  assert.equal(computeGardenSunriseProgress(10), 1);
  assert.equal(computeGardenSunriseProgress(14), 1);
});

test('extractYouTubeId parses watch URLs, short URLs, embed URLs, and raw IDs', () => {
  assert.equal(
    extractYouTubeId('https://www.youtube.com/watch?v=frmal9gVzJw'),
    'frmal9gVzJw'
  );
  assert.equal(extractYouTubeId('https://youtu.be/frmal9gVzJw?si=123'), 'frmal9gVzJw');
  assert.equal(extractYouTubeId('frmal9gVzJw'), 'frmal9gVzJw');
  assert.equal(extractYouTubeId('not-a-valid-url'), null);
});

test('computeDaysSince calculates local days since 2026-10-07 accurately', () => {
  const oct18 = new Date(2026, 9, 18, 14, 30, 0);
  assert.equal(computeDaysSince('2026-10-07', oct18), 11);

  const sameDay = new Date(2026, 9, 7, 23, 59, 0);
  assert.equal(computeDaysSince('2026-10-07', sameDay), 0);

  const beforeDay = new Date(2026, 9, 1, 10, 0, 0);
  assert.equal(computeDaysSince('2026-10-07', beforeDay), 0);
});

test('clampRangeInput validates numeric bounds and handles invalid inputs', () => {
  assert.equal(clampRangeInput('45', 0, 100, 50), 45);
  assert.equal(clampRangeInput(-20, 0, 100, 50), 0);
  assert.equal(clampRangeInput(250, 0, 100, 50), 100);
  assert.equal(clampRangeInput('not-a-number', 0, 100, 80), 80);
});

test('formatSeconds formats seconds into M:SS safely', () => {
  assert.equal(formatSeconds(0), '0:00');
  assert.equal(formatSeconds(9), '0:09');
  assert.equal(formatSeconds(65), '1:05');
  assert.equal(formatSeconds(208), '3:28');
  assert.equal(formatSeconds(-5), '0:00');
});

test('parseLetterBlocks splits greeting and body paragraphs cleanly', () => {
  const sample = 'to rishika 🌻\n\nfirst paragraph here\n\nsecond paragraph 🤍';
  const parsed = parseLetterBlocks(sample);
  assert.equal(parsed.greeting, 'to rishika 🌻');
  assert.deepEqual(parsed.blocks, ['first paragraph here', 'second paragraph 🤍']);
});

test('normalizeRoute validates known chapter hashes and defaults empty hash to lock', () => {
  assert.equal(normalizeRoute('#/lock'), 'lock');
  assert.equal(normalizeRoute('#/0'), 'lock');
  assert.equal(normalizeRoute('#/1'), '1');
  assert.equal(normalizeRoute('#/4/garden'), '4/garden');
  assert.equal(normalizeRoute('#/4/letter'), '4/letter');
  assert.equal(normalizeRoute('#/4/song'), '4/song');
  assert.equal(normalizeRoute('#/7'), '7');
  assert.equal(normalizeRoute(''), 'lock');
});

test('tokenizeInlineIcons identifies sunflower and animated white-heart tokens', () => {
  const tokens = tokenizeInlineIcons('sunflowers or lilies 🌻🤍');
  assert.deepEqual(tokens, [
    { type: 'text', value: 'sunflowers or lilies ' },
    { type: 'sunflower' },
    { type: 'white-heart' },
  ]);
});

test('getChapterNumber extracts chapter 0-7 from route key', () => {
  assert.equal(getChapterNumber('lock'), 0);
  assert.equal(getChapterNumber('4/letter'), 4);
  assert.equal(getChapterNumber('7'), 7);
});

test('createPlantedFlower clamps coordinates and alternates flower species', () => {
  const f0 = createPlantedFlower(0, 2, 99);
  assert.equal(f0.xPercent, 10);
  assert.equal(f0.soilDepthPercent, 92);
  assert.equal(f0.kind, 'sunflower');

  const f1 = createPlantedFlower(1, 55, 82);
  assert.equal(f1.xPercent, 55);
  assert.equal(f1.kind, 'lily');
});

test('computeDodgeOffset shrinks and eventually hides the No button at NO_MAX_ATTEMPTS', () => {
  const d0 = computeDodgeOffset(0);
  assert.equal(d0.scale, 1);
  assert.equal(d0.hidden, false);

  const d1 = computeDodgeOffset(1);
  assert.equal(typeof d1.x, 'number');
  assert.equal(typeof d1.y, 'number');
  assert.ok(d1.scale < 1);
  assert.equal(d1.hidden, false);

  const d5 = computeDodgeOffset(5);
  assert.equal(d5.hidden, true);
  assert.equal(d5.scale, 0);
});

test('BGM uses the original uploaded Shinchan Family Theme Piano Cover MP3 file directly at twice the previous volume', async () => {
  const fs = await import('node:fs');
  const { BGM_AUDIO_SRC, BGM_DEFAULT_VOLUME } = await import('./soundEngine.ts');
  assert.equal(BGM_AUDIO_SRC, '/shinchan-bgm.mp3');
  assert.ok(BGM_DEFAULT_VOLUME >= 0.56 && BGM_DEFAULT_VOLUME <= 1.0);
  const stat = fs.statSync('public/shinchan-bgm.mp3');
  assert.ok(stat.size > 1_000_000, `Expected public/shinchan-bgm.mp3 > 1MB, got ${stat.size}`);
});

