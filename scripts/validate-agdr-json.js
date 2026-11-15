#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const Ajv = require('ajv/dist/2020');
const addFormats = require('ajv-formats');
const root = path.resolve(__dirname, '..');
const schema = JSON.parse(fs.readFileSync(path.join(root, 'schema/agdr-json.schema.json'), 'utf8'));
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);
const dir = path.join(root, 'examples/json');
const files = fs.readdirSync(dir).filter((name) => /^AgDR-\d{4,}-.*\.json$/.test(name) || /^AgDR-\d{4,}.*\.json$/.test(name));
const ids = new Set(); let failed = 0;
for (const name of files) {
  const file = path.join(dir, name); let value;
  try { value = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (error) { console.log(`FAIL ${name}\n  invalid JSON: ${error.message}`); failed++; continue; }
  const errors = [];
  if (!validate(value)) errors.push(...validate.errors.map((e) => `${e.instancePath || '(root)'} ${e.message}`));
  if (ids.has(value.id)) errors.push(`duplicate id ${value.id}`); else ids.add(value.id);
  if (errors.length) { console.log(`FAIL ${name}`); errors.forEach((e) => console.log(`  ${e}`)); failed++; } else console.log(`ok   ${name}`);
}
console.log(`${files.length} JSON file(s) checked, ${files.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);
