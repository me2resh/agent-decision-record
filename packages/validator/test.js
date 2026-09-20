import test from 'node:test';
import assert from 'node:assert/strict';
import { validateAgdr } from './index.js';

const valid = `---\nid: AgDR-0014\ntimestamp: 2026-09-20T08:00:00Z\nagent: codex\nmodel: test\ntrigger: user-prompt\nstatus: proposed\n---\n\n> In the context of an existing service, facing a release requirement, I decided to use the current workflow to achieve a safe deployment, accepting limited manual setup.\n\n## Options Considered\n\n## Decision\n`;

test('accepts a conforming structural record', () => assert.deepEqual(validateAgdr(valid, { filename: 'AgDR-0014-auth.md' }), []));
test('reports missing required sections', () => assert.ok(validateAgdr(valid.replace('## Decision', ''), { filename: 'AgDR-0014-auth.md' }).some((item) => item.path === 'body')));
