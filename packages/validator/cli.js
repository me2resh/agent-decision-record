#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { basename } from 'node:path';
import { validateAgdr } from './index.js';

const file = process.argv[2];
if (!file) {
  console.error('Usage: agdr-validate <record.md>');
  process.exit(2);
}
const diagnostics = validateAgdr(await readFile(file, 'utf8'), { filename: basename(file) });
if (diagnostics.length === 0) {
  console.log(`Valid AgDR: ${file}`);
  process.exit(0);
}
for (const item of diagnostics) console.log(`${item.severity}: ${item.path}: ${item.message}`);
console.error(`${diagnostics.length} validation issue(s).`);
process.exit(1);
