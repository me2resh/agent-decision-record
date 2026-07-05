#!/usr/bin/env node
/**
 * validate-agdr.js
 *
 * Validates Agent Decision Record (AgDR) markdown files against:
 *   1. schema/agdr.schema.json  — frontmatter fields, enums, patterns
 *   2. filename <-> id consistency (AgDR-NNNN-slug.md <-> id: AgDR-NNNN)
 *   3. required body sections (Y-statement, Options Considered, Decision)
 *   4. cross-file id uniqueness
 *
 * Usage:
 *   node scripts/validate-agdr.js                 # validates examples/*.md
 *   node scripts/validate-agdr.js path/to/*.md     # validates the given files
 *   node scripts/validate-agdr.js docs/agdr        # validates every AgDR-*.md under a directory
 *
 * Exit code 0 on success, 1 if any file fails validation.
 *
 * Zero required runtime config: this is the same check CI runs on every PR
 * (see .github/workflows/validate-agdr.yml), so you can confirm a new AgDR
 * locally before opening one.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const REPO_ROOT = path.resolve(__dirname, '..');
const SCHEMA_PATH = path.join(REPO_ROOT, 'schema', 'agdr.schema.json');
const DEFAULT_TARGET = path.join(REPO_ROOT, 'examples');

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;
const FILENAME_ID_RE = /^(AgDR-\d{4,})-[a-z0-9-]+\.md$/;

const REQUIRED_HEADINGS = ['## Options Considered', '## Decision'];

function loadSchema() {
  const raw = fs.readFileSync(SCHEMA_PATH, 'utf8');
  return JSON.parse(raw);
}

/** Recursively collect AgDR-*.md files under a directory (not README.md). */
function collectAgdrFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...collectAgdrFiles(full));
    } else if (entry.isFile() && /^AgDR-\d{4,}-.*\.md$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

function resolveTargets(args) {
  if (args.length === 0) {
    return collectAgdrFiles(DEFAULT_TARGET);
  }
  const files = [];
  for (const arg of args) {
    const stat = fs.existsSync(arg) ? fs.statSync(arg) : null;
    if (stat && stat.isDirectory()) {
      files.push(...collectAgdrFiles(arg));
    } else if (stat && stat.isFile()) {
      files.push(arg);
    } else {
      console.error(`error: path not found: ${arg}`);
      process.exitCode = 1;
    }
  }
  return files;
}

function validateFile(filePath, validateSchema, seenIds) {
  const errors = [];
  const raw = fs.readFileSync(filePath, 'utf8');
  const basename = path.basename(filePath);

  const match = raw.match(FRONTMATTER_RE);
  if (!match) {
    errors.push('missing YAML frontmatter (expected a leading `---` … `---` block)');
    return errors;
  }

  const [, frontmatterRaw, body] = match;
  let frontmatter;
  try {
    // JSON_SCHEMA (vs. the default schema) keeps ISO-8601 timestamps as
    // plain strings instead of auto-casting them to JS Date objects.
    frontmatter = yaml.load(frontmatterRaw, { schema: yaml.JSON_SCHEMA }) || {};
  } catch (err) {
    errors.push(`frontmatter is not valid YAML: ${err.message}`);
    return errors;
  }

  const valid = validateSchema(frontmatter);
  if (!valid) {
    for (const issue of validateSchema.errors) {
      const field = issue.instancePath ? issue.instancePath.replace(/^\//, '') : '(root)';
      errors.push(`frontmatter.${field} ${issue.message}`);
    }
  }

  // Filename <-> id consistency
  const filenameMatch = basename.match(FILENAME_ID_RE);
  if (!filenameMatch) {
    errors.push(
      `filename "${basename}" does not match the naming convention AgDR-NNNN-slug.md`
    );
  } else if (frontmatter.id && frontmatter.id !== filenameMatch[1]) {
    errors.push(
      `frontmatter id "${frontmatter.id}" does not match the filename prefix "${filenameMatch[1]}"`
    );
  }

  // Cross-file id uniqueness
  if (frontmatter.id) {
    if (seenIds.has(frontmatter.id)) {
      errors.push(`duplicate id "${frontmatter.id}" — also used by ${seenIds.get(frontmatter.id)}`);
    } else {
      seenIds.set(frontmatter.id, basename);
    }
  }

  // Y-statement: a blockquote line carrying the Y-statement shape
  const hasYStatement = /^>\s*In the context of.+facing.+I decided.+to achieve.+accepting.+\.\s*$/m.test(
    body
  );
  if (!hasYStatement) {
    errors.push(
      'missing Y-statement — expected a blockquote matching ' +
        '"> In the context of …, facing …, I decided … to achieve …, accepting ….'
    );
  }

  // Required body sections
  for (const heading of REQUIRED_HEADINGS) {
    if (!body.includes(heading)) {
      errors.push(`missing required section "${heading}"`);
    }
  }

  return errors;
}

function main() {
  const args = process.argv.slice(2);
  const schema = loadSchema();
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const validateSchema = ajv.compile(schema);

  const targets = resolveTargets(args);
  if (targets.length === 0) {
    console.error('No AgDR files found to validate.');
    process.exit(1);
  }

  const seenIds = new Map();
  let failures = 0;

  for (const file of targets) {
    const relPath = path.relative(process.cwd(), file);
    const errors = validateFile(file, validateSchema, seenIds);
    if (errors.length === 0) {
      console.log(`ok    ${relPath}`);
    } else {
      failures += 1;
      console.log(`FAIL  ${relPath}`);
      for (const err of errors) {
        console.log(`      - ${err}`);
      }
    }
  }

  console.log('');
  console.log(`${targets.length} file(s) checked, ${targets.length - failures} passed, ${failures} failed.`);

  if (failures > 0) {
    process.exit(1);
  }
}

main();
