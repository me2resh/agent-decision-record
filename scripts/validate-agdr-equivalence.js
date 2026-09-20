#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const root = path.resolve(__dirname, '..');
const markdownPath = process.argv[2] || path.join(root, 'examples/AgDR-0001-auth-provider-choice.md');
const jsonPath = process.argv[3] || path.join(root, 'examples/json/AgDR-0001-auth-provider-choice.json');
const frontmatterPattern = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

function normalize(text) {
  return String(text).replace(/\*\*/g, '').replace(/`/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
}

function section(body, heading) {
  const start = body.indexOf(heading);
  if (start < 0) return '';
  const contentStart = body.indexOf('\n', start) + 1;
  const next = body.indexOf('\n## ', contentStart);
  return body.slice(contentStart, next < 0 ? body.length : next);
}

function bullets(body, heading) {
  return section(body, heading).split(/\r?\n/).filter((line) => /^-\s+/.test(line)).map((line) => normalize(line.replace(/^-\s+/, '')));
}

function parseMarkdown(filename) {
  const raw = fs.readFileSync(filename, 'utf8');
  const match = raw.match(frontmatterPattern);
  if (!match) throw new Error(`${filename}: missing YAML frontmatter`);
  const frontmatter = yaml.load(match[1], { schema: yaml.JSON_SCHEMA }) || {};
  const body = match[2];
  const title = body.match(/^#\s+(.+)$/m)?.[1];
  const yStatement = body.match(/^>\s*(.+)$/m)?.[1];
  const optionsSection = section(body, '## Options Considered');
  const options = optionsSection.split(/\r?\n/).filter((line) => /^\|/.test(line) && !/^\|\s*-/.test(line)).slice(1)
    .map((line) => {
      const cells = line.split('|').map((cell) => normalize(cell));
      return { name: cells[1], pros: cells[2], cons: cells[3] };
    }).filter((option) => option.name);
  const decision = section(body, '## Decision');
  const chosen = decision.match(/Chosen:\s*\*\*([^*]+)\*\*/)?.[1];
  return { frontmatter, title: normalize(title), yStatement: normalize(yStatement), context: bullets(body, '## Context'), options, chosen: normalize(chosen), consequences: bullets(body, '## Consequences') };
}

function main() {
  const markdown = parseMarkdown(markdownPath);
  const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const errors = [];
  for (const field of ['id', 'timestamp', 'agent', 'model', 'trigger', 'status']) {
    if (markdown.frontmatter[field] !== json[field]) errors.push(`${field} differs`);
  }
  if (markdown.title !== normalize(json.title)) errors.push('title differs');
  if (markdown.yStatement !== normalize(json.yStatement)) errors.push('yStatement differs');
  if (JSON.stringify(markdown.context) !== JSON.stringify((json.context || []).map(normalize))) errors.push('context differs');
  const jsonOptions = json.optionsConsidered.map((option) => ({ name: normalize(option.name), pros: normalize(option.pros.join(', ')), cons: normalize(option.cons.join(', ')) }));
  if (JSON.stringify(markdown.options) !== JSON.stringify(jsonOptions)) errors.push('optionsConsidered fields differ');
  if (!normalize(json.decision).includes(markdown.chosen)) errors.push('decision does not contain the Markdown chosen option');
  if (JSON.stringify(markdown.consequences) !== JSON.stringify((json.consequences || []).map(normalize))) errors.push('consequences differ');
  if (errors.length) {
    console.error(`FAIL ${path.basename(markdownPath)} ↔ ${path.basename(jsonPath)}`);
    errors.forEach((error) => console.error(`  ${error}`));
    process.exit(1);
  }
  console.log(`ok   ${path.basename(markdownPath)} ↔ ${path.basename(jsonPath)}`);
}

main();
