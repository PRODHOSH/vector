# API Documentation

> **Live interactive docs:** [https://vector.prodhosh.me/api-docs](https://vector.prodhosh.me/api-docs)

This folder contains the backend API documentation for **Vector OS**.


## Files

| File | Description |
|---|---|
| `openapi.yaml` | Full OpenAPI 3.0 specification covering all API routes and Server Actions |

## Viewing the Docs

**Option 1 — Swagger Editor (recommended):**
1. Open [editor.swagger.io](https://editor.swagger.io)
2. Paste the contents of `openapi.yaml`

**Option 2 — VS Code:**
Install the [OpenAPI (Swagger) Editor](https://marketplace.visualstudio.com/items?itemName=42Crunch.vscode-openapi) extension and open `openapi.yaml`.

**Option 3 — Redoc CLI:**
```bash
npx @redocly/cli preview-docs docs/openapi.yaml
```

## Architecture Note

Vector OS uses **Next.js Server Actions** for most mutations rather than traditional REST endpoints. Server Actions are documented in this spec as logical RPC operations (`/actions/*`) for clarity — they are not callable via standard HTTP clients like curl or Postman directly.

The only traditional HTTP route is:
- `GET /api/seed` — Seeds sample tasks for the authenticated user.
- `GET /auth/callback` — OAuth/email confirmation callback handled by Supabase.
