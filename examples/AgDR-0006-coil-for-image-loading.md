---
id: AgDR-0006
timestamp: 2026-01-30T17:00:00Z
agent: claude-code
model: claude-opus-4-5-20251101
trigger: user-prompt
status: executed
---

# Use Coil for Image Loading

> In the context of building an Android app with photo capture functionality, facing the choice between Coil and Glide for image loading, I decided to use Coil to achieve Kotlin-first integration with Compose support, accepting the slightly smaller ecosystem compared to Glide.

## Context
- Android app uses Jetpack Compose for UI
- Need to load photos from camera/gallery
- Need to display cached images efficiently
- App is 100% Kotlin with Coroutines

## Options Considered
| Option | Pros | Cons |
|--------|------|------|
| **Coil** | Kotlin-first, native Coroutines, built-in Compose support, lightweight (~1500 methods), modern API, backed by Instacart | Smaller ecosystem than Glide, newer library |
| **Glide** | Battle-tested, huge ecosystem, extensive documentation, Google recommended for years | Java-based API, Compose support via extension, larger size (~2800 methods), requires annotation processor |

## Decision
Chosen: **Coil**, because:
1. Native Kotlin and Coroutines integration matches our tech stack
2. First-class Jetpack Compose support with `AsyncImage` composable
3. Smaller binary footprint (important for mobile)
4. Modern, idiomatic Kotlin API
5. Backed by Instacart with active maintenance
6. No annotation processing required (faster builds)

## Consequences
- Add Coil dependencies (`io.coil-kt:coil-compose`)
- Use `AsyncImage` composable for image loading in Compose
- Image caching handled automatically by Coil
- Transformations available (circle crop, blur, etc.)
- Easy integration with camera capture via Uri/File

## Artifacts
- Related PR implementing image loading functionality
