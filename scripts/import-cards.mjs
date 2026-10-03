// Converts the reference cards-list.html markup into src/data/cards.json.
//
// Usage: node scripts/import-cards.mjs <path-to-cards-list.html>
//
// The source page is HTML, not data. Each card is a <li class="filterDiv ..."> whose
// classes carry the type, tags and set. Re-run this script whenever the source changes.

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';

const here = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(here, '../src/data/cards.json');

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Usage: node scripts/import-cards.mjs <path-to-cards-list.html>');
  process.exit(1);
}

// Source class name -> app card type. Checked in order, first match wins.
const TYPE_CLASSES = [
  ['global-card', 'globalEvent'],
  ['corporation', 'corporation'],
  ['prelude', 'prelude'],
  ['prelude-card', 'prelude'],
  ['prelude2', 'prelude'],
  ['colonies', 'colony'],
  ['colony-card', 'colony'],
  ['coloniess', 'colony'],
  ['events', 'event'],
  ['event', 'event'],
  ['active', 'active'],
  ['automated', 'automated'],
];

// Source class name -> app tag. Some source classes are misspelled in the page.
const TAG_CLASSES = {
  buildingTag: 'building',
  spaceTag: 'space',
  spacetag: 'space',
  scienceTag: 'science',
  plantTag: 'plant',
  microbeTag: 'microbe',
  animalTag: 'animal',
  powerTag: 'power',
  earthTag: 'earth',
  jovianTag: 'jovian',
  cityTag: 'city',
  venusTag: 'venus',
  eventTag: 'event',
  wildTag: 'wild',
};

// Expansion/set classes. The first one found on a card is used.
const SET_CLASSES = ['standard', 'corporate', 'promo', 'venusNext', 'colonies', 'turmoil', 'prelude'];

const clean = (s) => s.replace(/\s+/g, ' ').trim();

// Card names live in different places per card type.
const NAME_SELECTORS = ['.title', '[class*="title-global-sub-section"]', '.colony-card-title-span'];

// Labels that appear as plain text on corporation cards and are not names.
const NOT_NAMES = new Set(['corporation', 'effect', 'x', 'mc', 'vp']);

function findName($el, classes) {
  for (const sel of NAME_SELECTORS) {
    const text = clean($el.find(sel).first().text());
    if (text) return text;
  }

  // Corporations have no title element. The name is a plain text node that starts the
  // card's text and is followed by the starting MC, a bracket or the end, e.g. "helion 42 (…)".
  if (classes.includes('corporation')) {
    let found = '';
    $el.find('*').addBack().contents().each((_i, node) => {
      if (found || node.type !== 'text') return;
      // Skip rule text: effect/action boxes and description blocks also contain plain text.
      if ($(node.parent).closest('[class*="Effect"], [class*="Action"], [class*="description"], [class*="Label"]').length) return;
      const m = clean(node.data).match(/^([A-Za-z][A-Za-z .'&-]*?)\s*(?:\d|\(|$)/);
      if (!m) return;
      const candidate = m[1].trim();
      if (candidate.length >= 3 && !NOT_NAMES.has(candidate.toLowerCase())) found = candidate;
    });
    return found;
  }
  return '';
}

const html = readFileSync(inputPath, 'utf8');
const $ = cheerio.load(html);

const cards = [];
const seen = new Map();
const warnings = [];

$('.filterDiv').each((_, el) => {
  const $el = $(el);
  const classes = ($el.attr('class') ?? '').split(/\s+/);

  const typeHit = TYPE_CLASSES.find(([cls]) => classes.includes(cls));
  if (!typeHit) {
    warnings.push(`no type class: ${classes.join(' ')}`);
    return;
  }
  const type = typeHit[1];

  const tags = [...new Set(classes.map((c) => TAG_CLASSES[c]).filter(Boolean))];
  const set = SET_CLASSES.find((s) => classes.includes(s)) ?? 'unknown';

  const name = findName($el, classes);
  const number = clean($el.find('.number').first().text()).replace(/^#/, '');
  const costText = clean($el.find('.price').first().text());
  const cost = costText === '' ? 0 : Number.parseInt(costText, 10);
  const requirements = clean($el.find('.requirements').first().text()) || undefined;
  const text = clean($el.find('.description').first().text());

  if (!name) {
    warnings.push(`card without name (number ${number || '?'})`);
    return;
  }
  if (Number.isNaN(cost)) {
    warnings.push(`${name}: non-numeric cost "${costText}"`);
  }

  // Prefer the printed number. Otherwise use the element id (e.g. "#CORP01", "#EUROPA").
  // Anything left falls back to set and name.
  const elementId = ($el.attr('id') ?? '').replace(/^#/, '');
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const baseId = number || elementId || `${set}-${slug}`;
  const count = seen.get(baseId) ?? 0;
  seen.set(baseId, count + 1);
  const id = count === 0 ? baseId : `${baseId}-${count + 1}`;

  cards.push({
    id,
    name,
    type,
    set,
    cost: Number.isNaN(cost) ? 0 : cost,
    tags,
    ...(requirements ? { requirements } : {}),
    text,
  });
});

const dataset = { schemaVersion: 1, cards };
writeFileSync(outPath, JSON.stringify(dataset, null, 2) + '\n');

const byType = cards.reduce((acc, c) => {
  acc[c.type] = (acc[c.type] ?? 0) + 1;
  return acc;
}, {});
console.log(`Wrote ${cards.length} cards to ${outPath}`);
console.log('By type:', byType);
if (warnings.length > 0) {
  console.log(`${warnings.length} warnings:`);
  for (const w of warnings.slice(0, 40)) console.log(`  - ${w}`);
  if (warnings.length > 40) console.log(`  ...and ${warnings.length - 40} more`);
}
