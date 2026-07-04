#!/usr/bin/env node
/**
 * check-changelog-lockstep.js
 *
 * Traceability check for this repo's own release process: if a PR bumps the
 * plugin version, CHANGELOG.md must gain a matching entry in the same PR.
 * A project whose entire pitch is auditability shouldn't let its own
 * release log drift — this is the check that would have caught the Codex
 * integration and SkillShield-badge commits landing without a version bump
 * or a CHANGELOG entry (see #9).
 *
 * Checks:
 *   1. .claude-plugin/plugin.json and .claude-plugin/marketplace.json
 *      report the same version (manifests must agree with each other).
 *   2. If the version changed between BASE_REF and HEAD_REF, CHANGELOG.md
 *      must contain a `## [<new-version>]` heading.
 *
 * Usage:
 *   node scripts/check-changelog-lockstep.js [baseRef] [headRef]
 *
 * Defaults: baseRef=HEAD~1, headRef=HEAD (a local "did my last commit keep
 * lockstep" check). CI passes the PR's actual base/head SHAs — see
 * .github/workflows/changelog-lockstep.yml.
 */

'use strict';

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const PLUGIN_MANIFEST = '.claude-plugin/plugin.json';
const MARKETPLACE_MANIFEST = '.claude-plugin/marketplace.json';
const CHANGELOG = 'CHANGELOG.md';

function readJsonAt(ref, relPath) {
  try {
    const raw = execFileSync('git', ['show', `${ref}:${relPath}`], {
      cwd: REPO_ROOT,
      encoding: 'utf8',
    });
    return JSON.parse(raw);
  } catch (err) {
    return null; // file didn't exist at that ref, or wasn't valid JSON yet
  }
}

function readFileAt(ref, relPath) {
  try {
    return execFileSync('git', ['show', `${ref}:${relPath}`], {
      cwd: REPO_ROOT,
      encoding: 'utf8',
    });
  } catch (err) {
    return null;
  }
}

function pluginVersion(manifest) {
  if (!manifest) return null;
  return manifest.version || null;
}

function marketplaceVersion(manifest) {
  if (!manifest) return null;
  // marketplace.json nests the canonical version under metadata, and again
  // per-plugin — both are expected to track plugin.json.
  return (manifest.metadata && manifest.metadata.version) || null;
}

function main() {
  const [baseRef = 'HEAD~1', headRef = 'HEAD'] = process.argv.slice(2);
  const errors = [];

  const headPlugin = readJsonAt(headRef, PLUGIN_MANIFEST);
  const headMarketplace = readJsonAt(headRef, MARKETPLACE_MANIFEST);
  const headPluginVersion = pluginVersion(headPlugin);
  const headMarketplaceVersion = marketplaceVersion(headMarketplace);

  if (!headPluginVersion) {
    errors.push(`${PLUGIN_MANIFEST} at ${headRef} has no "version" field.`);
  }
  if (!headMarketplaceVersion) {
    errors.push(`${MARKETPLACE_MANIFEST} at ${headRef} has no "metadata.version" field.`);
  }
  if (headPluginVersion && headMarketplaceVersion && headPluginVersion !== headMarketplaceVersion) {
    errors.push(
      `manifest versions out of lockstep: ${PLUGIN_MANIFEST}=${headPluginVersion} vs ` +
        `${MARKETPLACE_MANIFEST}=${headMarketplaceVersion}`
    );
  }

  const basePlugin = readJsonAt(baseRef, PLUGIN_MANIFEST);
  const basePluginVersion = pluginVersion(basePlugin);

  if (headPluginVersion && headPluginVersion !== basePluginVersion) {
    console.log(`Version bump detected: ${basePluginVersion || '(none)'} -> ${headPluginVersion}`);

    const headChangelog = readFileAt(headRef, CHANGELOG) || '';
    const escaped = headPluginVersion.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const headingRe = new RegExp(`^##\\s*\\[${escaped}\\]`, 'm');

    if (!headingRe.test(headChangelog)) {
      errors.push(
        `${PLUGIN_MANIFEST} was bumped to ${headPluginVersion} but ${CHANGELOG} has no ` +
          `"## [${headPluginVersion}]" entry. Every version bump needs a matching changelog entry.`
      );
    } else {
      console.log(`${CHANGELOG} has a matching "## [${headPluginVersion}]" entry — lockstep OK.`);
    }
  } else {
    console.log(`No version bump between ${baseRef} and ${headRef} (${headPluginVersion || 'unknown'}).`);
  }

  if (errors.length > 0) {
    console.log('');
    console.log('FAIL — changelog / manifest lockstep check:');
    for (const err of errors) {
      console.log(`  - ${err}`);
    }
    process.exit(1);
  }

  console.log('Changelog / manifest lockstep check passed.');
}

main();
