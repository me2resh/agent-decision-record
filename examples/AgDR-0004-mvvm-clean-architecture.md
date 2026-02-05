---
id: AgDR-0004
timestamp: 2026-01-30T16:01:00Z
agent: claude-code
model: claude-opus-4-5-20251101
trigger: user-prompt
status: executed
---

# Use MVVM with Clean Architecture for Android App

> In the context of choosing an architecture pattern for a native Android app, facing the choice between MVVM, MVI, and MVP, I decided to use MVVM with Clean Architecture to achieve familiar patterns with good testability, accepting slightly less strict unidirectional data flow compared to MVI.

## Context
- Building native Android app with Jetpack Compose
- Need separation of concerns for maintainability
- Features: auth, dashboard, data entry, settings — standard CRUD operations
- Need testable, modular architecture

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **MVVM + Clean Architecture** | Google recommended, excellent Compose integration, familiar pattern, good testability, natural fit with StateFlow/LiveData | Less strict than MVI, state can be scattered |
| **MVI (Model-View-Intent)** | Strict unidirectional flow, single source of truth, easier debugging, great for complex state | More boilerplate, steeper learning curve, overkill for simpler screens |
| **MVP** | Simple, clear separation | Dated pattern, poor Compose fit, lifecycle issues |

## Decision

Chosen: **MVVM with Clean Architecture**, because:
1. Google's recommended architecture for Android with Compose
2. Natural integration with ViewModel, StateFlow, and Compose state
3. Clean Architecture layers (domain, data, presentation) provide testability
4. Familiar pattern reduces onboarding time
5. Sufficient for the app's complexity (not a highly stateful app)
6. Use cases provide clear business logic boundaries

## Consequences

- Project structure: `core/domain`, `core/data`, `feature/*/presentation`
- ViewModels expose StateFlow for UI state
- Use cases encapsulate business logic
- Repositories abstract data sources (API + Room)
- Easy to unit test each layer independently
