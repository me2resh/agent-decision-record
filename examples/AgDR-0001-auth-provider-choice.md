---
id: AgDR-0001
timestamp: 2026-02-04T12:00:00Z
agent: claude-code
model: claude-opus-4-5-20251101
trigger: user-prompt
status: executed
---

# Auth Provider for Serverless Chrome Extension

> In the context of replacing API key auth in a 100% AWS serverless stack, facing the need for proper user identity with minimal maintenance, I decided to use **AWS Cognito User Pools** to achieve native API Gateway integration and managed security, accepting the limited Hosted UI aesthetics and AWS vendor lock-in.

## Context
- Backend is 100% AWS (SAM, Lambda, API Gateway, DynamoDB)
- Currently uses API keys with actor name in request bodies — no real identity
- Chrome extension uses `chrome.identity.launchWebAuthFlow` for OAuth flows
- Small user base, personal project with minimal budget
- Need: login, token refresh, user identity in JWT claims

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **AWS Cognito** | Native API Gateway authorizer (zero auth code), free 50K MAU tier, SAM `AWS::Cognito::*` resources, OAuth2/OIDC compliant, managed password security | Hosted UI is basic, complex config surface, AWS lock-in |
| **Auth0** | Polished login UI, excellent DX, 7.5K MAU free tier | External vendor, custom Lambda authorizer needed, extra CORS config, additional billing account |
| **Firebase Auth** | Simple SDK, good Chrome extension support, generous free tier | Mixes GCP + AWS, custom Lambda authorizer, no SAM integration, two cloud vendors to manage |
| **Custom JWT** | Full control, no external deps | Must build: registration, bcrypt hashing, JWT signing/refresh/revocation, password reset. Security burden. Ongoing maintenance. |

## Decision

Chosen: **AWS Cognito**, because:

1. API Gateway's built-in Cognito Authorizer eliminates all custom auth middleware — one SAM resource replaces hundreds of lines of JWT verification code
2. Entire stack remains single-vendor AWS with unified billing, monitoring (CloudWatch), and IAM
3. 50K MAU free tier makes cost effectively zero for a small-scale project
4. Managed security (password hashing, brute-force protection, token rotation) removes the highest-risk custom code from the codebase
5. OAuth2 code flow works with `chrome.identity.launchWebAuthFlow` for the Chrome extension

## Consequences

- Hosted UI will be used for login (functional but not beautiful) — acceptable for early-stage product
- SAM template grows with `UserPool`, `UserPoolClient`, `UserPoolDomain` resources
- All existing API handlers must switch from API key check to `extractUserContext()` from Cognito JWT claims
- Extension needs `identity` permission in manifest and OAuth redirect handling
- Future migration away from Cognito would require replacing the authorizer and token format
