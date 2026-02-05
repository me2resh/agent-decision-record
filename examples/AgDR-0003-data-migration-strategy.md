---
id: AgDR-0003
timestamp: 2026-02-04T12:20:00Z
agent: claude-code
model: claude-opus-4-5-20251101
trigger: user-prompt
status: executed
---

# Migration Strategy: Copy-on-First-Login

> In the context of migrating v1 DynamoDB data to v2 workspace-partitioned keys, facing the choice between automatic copy-on-login, a manual migration script, or lazy dual-read migration, I decided to use **copy-on-first-login** to achieve fully automatic zero-downtime migration with no manual steps, accepting the ~2-3 second latency on the first authenticated API call and lingering old items until manual cleanup.

## Context
- v1 data: ~100 items (`PK=ITEM#<hash>`), ~5 settings (`PK=SETTINGS`), members (`PK=MEMBERS`)
- v2 requires all items under `PK=WORKSPACE#<id>` (new key design)
- DynamoDB keys are immutable — must write new items with new keys
- Small user base, point-in-time recovery enabled, zero data loss tolerance
- Dataset is tiny: ~100 items, ~100KB total

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **Copy-on-first-login** — First auth'd API call detects legacy data, creates default workspace, batch-copies items with new keys, writes migration flag | Fully automatic. Non-destructive (old items stay). Idempotent (flag). No extra tooling. No manual steps. | ~2-3s latency on first call. Migration logic in app code. Old items linger until cleanup. |
| **One-time Lambda script** — Deploy migration Lambda, invoke manually, rewrite + delete old items | Clean separation. Runs once. No leftover data. Can test in staging. | Manual invocation required. Destructive (deletes old). Must coordinate with deploy timing. Partial state on failure. Extra infrastructure. |
| **Dual-read lazy migration** — Read new keys first, fall back to old. Migrate on write. | No big-bang. Spreads load. Always reads latest. | Complex repo logic (two read paths). Un-accessed items never migrate. Can't know when "done". Permanent tech debt. Double test surface. |

## Decision

Chosen: **Copy-on-first-login**, because:

1. Fully automatic — deploy v2, first login triggers migration, done. No manual steps or deployment coordination.
2. Non-destructive — old items remain as backup. Verify correctness, then clean up at leisure. Point-in-time recovery as additional safety net.
3. Idempotent — migration flag checked first via `GetItem`. Runs exactly once. Safe to retry if interrupted.
4. Tiny dataset — ~100 items via BatchWriteItem (4 batches of 25) = ~2 seconds. Invisible to user during first login flow.
5. Zero extra infrastructure — no migration Lambda to deploy, invoke, monitor, and tear down.

## Migration Flow

```
1. User completes auth login (first time)
2. First API call hits any handler
3. Handler extracts user identity from JWT
4. Check: GetItem(PK=MIGRATION, SK=V2_COMPLETE)
   → If exists: skip migration, proceed normally
   → If not exists:
     a. Create default workspace (PK=WORKSPACE#<newId>, SK=WORKSPACE)
     b. Add user as owner (PK=WORKSPACE#<id>, SK=MEMBER#<userId>)
     c. Scan legacy items (PK begins_with ITEM#)
     d. BatchWrite each as PK=WORKSPACE#<id>, SK=ITEM#<itemId>
     e. Scan legacy settings (PK=SETTINGS)
     f. BatchWrite each as PK=WORKSPACE#<id>, SK=SET#<name>
     g. Write flag: PutItem(PK=MIGRATION, SK=V2_COMPLETE, {migratedBy, migratedAt, counts})
5. Proceed with original API request
```

## Consequences

- First authenticated API call takes ~2-3s extra (once, ever)
- Old DynamoDB items remain until explicit cleanup
- Migration flag includes metadata (who, when, counts) for audit
- Request handler contains migration check logic
- New users joining via invite see all migrated data immediately
- Manual cleanup step needed later: delete items with old key patterns (low priority, no cost impact)
