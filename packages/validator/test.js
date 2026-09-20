import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { validateAgdr, validateAgdrJson } from './index.js';

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
test('reports missing frontmatter', () => {
  assert.equal(validateAgdr('# No frontmatter')[0].path, 'frontmatter');
});
test('reports malformed YAML', () => {
  const errors = validateAgdr('---\nid: [\n---\n\nbody');
  assert.equal(errors.length, 1);
  assert.match(errors[0].message, /Invalid YAML/);
});
test('reports invalid timestamp and trigger values', () => {
  const errors = validateAgdr(valid.replace('2026-09-20T08:00:00Z', 'tomorrow').replace('user-prompt', 'operator'));
  assert.ok(errors.some((item) => item.path === 'frontmatter.timestamp'));
  assert.ok(errors.some((item) => item.path === 'frontmatter.trigger'));
});
test('reports filename format and ID mismatches', () => {
  assert.ok(validateAgdr(valid, { filename: 'notes.md' }).some((item) => item.path === 'filename'));
  assert.ok(validateAgdr(valid, { filename: 'AgDR-0015-auth.md' }).some((item) => item.path === 'filename'));
});
test('validates JSON frontmatter values', () => {
  assert.deepEqual(validateAgdrJson({
    id: 'AgDR-0014', timestamp: '2026-09-20T08:00:00Z', agent: 'codex', model: 'test',
    trigger: 'user-prompt', status: 'proposed'
  }), []);
  assert.ok(validateAgdrJson(null).some((item) => item.path === '$'));
  assert.ok(validateAgdrJson({ id: 'bad' }).some((item) => item.path === 'frontmatter.id'));
});
test('CLI returns success for a valid record and failure for an invalid record', () => {
  const cli = path.join(packageDir, 'cli.js');
  const validRun = spawnSync(process.execPath, [cli, path.join(repoDir, 'examples/AgDR-0001-auth-provider-choice.md')], { encoding: 'utf8' });
  assert.equal(validRun.status, 0);
  assert.match(validRun.stdout, /Valid AgDR/);
  const invalidFile = path.join(packageDir, '.tmp-invalid-agdr.md');
  fs.writeFileSync(invalidFile, '# invalid\n');
  try {
    const invalidRun = spawnSync(process.execPath, [cli, invalidFile], { encoding: 'utf8' });
    assert.equal(invalidRun.status, 1);
    assert.match(invalidRun.stderr, /validation issue/);
  } finally {
    fs.unlinkSync(invalidFile);
  }
});
