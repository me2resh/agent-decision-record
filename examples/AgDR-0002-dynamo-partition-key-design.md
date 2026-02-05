---
id: AgDR-0002
timestamp: 2026-02-04T12:10:00Z
agent: claude-code
model: claude-opus-4-5-20251101
trigger: user-prompt
status: executed
---

# DynamoDB Key Design: Workspace-Partitioned Single Table

> In the context of introducing a Workspace aggregate root in a DynamoDB single-table design, facing the choice between workspace-partitioned keys, entity-first keys, or GSI overloading, I decided to use **workspace-partitioned keys** (`PK=WORKSPACE#<id>` for all child entities) to achieve natural aggregate boundaries and single-query aggregate loading, accepting the need for a GSI to list a user's workspaces.

## Context
- Existing single-table design: `PK=ITEM#<hash>/SK=ITEM`, `PK=SETTINGS/SK=SET#<name>`, GSI1 (all items), GSI2 (by status)
- Workspace becomes aggregate root — items, settings, members all belong to a workspace
- Key access patterns: load full workspace aggregate, list user's workspaces, O(1) membership check, resolve invite code
- Must coexist with legacy keys during migration
- Scale: ~200 items per workspace, 2-5 members, 10 settings

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **Workspace-partitioned** (`PK=WORKSPACE#<id>`, SK discriminates type) | Single partition = one query for full aggregate. O(1) membership check via GetItem. Natural DDD aggregate boundary. Invite code as simple top-level item. | Can't query all items globally without GSI. Large partitions theoretically (irrelevant at this scale). |
| **Entity-first** (separate PKs per entity type, workspaceId as attribute + GSI) | Each entity type independent. Easy global item queries. Familiar from v1. | Breaks aggregate boundary. Multiple queries to load workspace. Membership check needs GSI query instead of GetItem. More GSIs = more cost. |
| **Composite GSI overloading** (keep v1 keys, add workspaceId attribute, new GSI for workspace scope) | Minimal change to v1 keys. Backward compatible by default. | Domain not modeled correctly in keys. Complex GSI overloading. Harder to reason about. Workspace isn't a first-class concept. |

## Decision

Chosen: **Workspace-partitioned design**, because:

1. `PK=WORKSPACE#<id>` makes the aggregate boundary explicit — Query returns workspace metadata + members + items + settings in one round trip
2. Membership check is `GetItem(PK=WORKSPACE#<id>, SK=MEMBER#<userId>)` — O(1), called on every authenticated request
3. GSI1 with `GSI1PK=USER#<userId>` efficiently handles "list my workspaces" without scanning
4. Invite code resolution is a simple `GetItem(PK=INVITE#<code>, SK=INVITE)` — no GSI needed
5. At small scale (~200 items per workspace), partition size concerns are irrelevant (well under 10GB limit)

### Key Design

| Item | PK | SK | GSI1PK | GSI1SK |
|------|----|----|--------|--------|
| Workspace | `WORKSPACE#<id>` | `WORKSPACE` | `USER#<createdBy>` | `WORKSPACE#<createdAt>` |
| Member | `WORKSPACE#<id>` | `MEMBER#<userId>` | `USER#<userId>` | `WORKSPACE#<workspaceId>` |
| Invite code | `INVITE#<code>` | `INVITE` | — | — |
| Item (v2) | `WORKSPACE#<wsId>` | `ITEM#<itemId>` | `WSITEMS#<wsId>` | `<createdAt>` |
| Setting (v2) | `WORKSPACE#<wsId>` | `SET#<name>` | — | — |

### Access Pattern Resolution

| Pattern | Query |
|---------|-------|
| Load full workspace | `Query PK=WORKSPACE#<id>` |
| List user's workspaces | `Query GSI1PK=USER#<userId>, GSI1SK begins_with WORKSPACE#` |
| Check membership | `GetItem PK=WORKSPACE#<id>, SK=MEMBER#<userId>` |
| List items in workspace | `Query PK=WORKSPACE#<id>, SK begins_with ITEM#` |
| Resolve invite code | `GetItem PK=INVITE#<code>, SK=INVITE` |

## Consequences

- All new items use `PK=WORKSPACE#<id>` prefix — aggregate-aligned
- Legacy items coexist until migration completes
- Item ID generation changes from content hash to UUID (uniqueness is per-workspace, not global)
- Repository layer needs dual read support during migration: try v2 keys first, fall back to legacy
