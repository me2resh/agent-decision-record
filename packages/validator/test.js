import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateAgdr } from './index.js';

const packageDir = path.dirname(fileURLToPath(import.meta.url));
const repoDir = path.resolve(packageDir, '../..');

const valid = `---\nid: AgDR-0014\ntimestamp: 2026-09-20T08:00:00Z\nagent: codex\nmodel: test\ntrigger: user-prompt\nstatus: proposed\n---\n\n> In the context of an existing service, facing a release requirement, I decided to use the current workflow to achieve a safe deployment, accepting limited manual setup.\n\n## Options Considered\n\n## Decision\n`;

test('accepts a conforming structural record', () => assert.deepEqual(validateAgdr(valid, { filename: 'AgDR-0014-auth.md' }), []));
test('reports missing required sections', () => assert.ok(validateAgdr(valid.replace('## Decision', ''), { filename: 'AgDR-0014-auth.md' }).some((item) => item.path === 'body')));
test('validates every checked-in example', () => {
  const examplesDir = path.join(repoDir, 'examples');
  const files = fs.readdirSync(examplesDir).filter((name) => /^AgDR-\d{4,}-.*\.md$/.test(name));
  assert.ok(files.length > 0);
  for (const filename of files) {
    const errors = validateAgdr(fs.readFileSync(path.join(examplesDir, filename), 'utf8'), { filename });
    assert.deepEqual(errors, [], `${filename}: ${JSON.stringify(errors)}`);
  }
});
test('keeps the published schema synchronized with the repository schema', () => {
  const rootSchema = JSON.parse(fs.readFileSync(path.join(repoDir, 'schema/agdr.schema.json'), 'utf8'));
  const packageSchema = JSON.parse(fs.readFileSync(path.join(packageDir, 'schema/agdr.schema.json'), 'utf8'));
  assert.deepEqual(packageSchema, rootSchema);
});
test('reports schema violations', () => {
  const errors = validateAgdr(valid.replace('status: proposed', 'status: unknown'));
  assert.ok(errors.some((item) => item.path === 'frontmatter.status'));
});
