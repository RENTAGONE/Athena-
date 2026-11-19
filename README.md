# ATHENA app scaffold v0.1

Local-first, phone-first capability and knowledge system. This archive is the **first repository drop**: a tested domain core plus an **unrun** UI, storage and PWA layer.
Read `STATUS.md` before trusting anything here. It lists exactly what was executed and what was not.

## Put it in a repository (Codespaces, no PC needed)

1. On GitHub, create a new **private, empty** repository (UD-08: you own it).
2. Open it in a Codespace (Code → Codespaces → Create codespace on main).
3. Upload `athena-app-scaffold-v0.1.zip` into the Codespace file explorer (drag and drop, or the upload action).
4. In the Codespace terminal:
   ```
   unzip athena-app-scaffold-v0.1.zip -d /tmp/athena-unzip
   cp -a /tmp/athena-unzip/athena/. .
   rm athena-app-scaffold-v0.1.zip
   npm install
   npm run verify
   ```
5. Copy the **full terminal output** of `npm run verify` back to Claude. Do not summarise it: the first real run is expected to show errors in the unrun layers, and the exact text is what gets them fixed.
6. When it is acceptable, commit and push: `git add -A && git commit -m "ATHENA scaffold v0.1" && git push`. Commit `package-lock.json` too, then change `npm install` to `npm ci` in `.github/workflows/verify.yml`.

## Commands

| Command | What it does |
| --- | --- |
| `npm test` | Domain, importer, evidence, competency and Pack-seed tests (Node built-in runner, no dependencies). Verified in the authoring sandbox. |
| `npm run test:ajv` | The same tests with real Ajv validation instead of the test-only stand-in. **Unrun.** |
| `npm run test:dexie` | Dexie store contract tests on fake-indexeddb. **Unrun.** |
| `npm run validate:pack` | Every Pack v0.9 fixture record against its schema with Ajv. **Unrun.** |
| `npm run build` | Typecheck, precompile validators, Vite build. **Unrun.** |
| `npm run test:e2e` | Playwright: offline reopen, no horizontal scroll at 360 px, no third-party requests. **Unrun.** |
| `npm run dev` / `npm run preview` | Local app. Use `preview` to test the installable PWA. |

## Phone testing

Installing a PWA needs HTTPS. In a Codespace, `npm run preview` forwards a port with an HTTPS URL that is **private to your GitHub login by default**. Open it on your phone while signed in. Do not set the port to Public (UD-09: no public URL without your approval).

## Layout

```
schemas/exchange/   Pack v0.9 JSON Schemas, vendored, read-only
fixtures/pack-v0.9/ Pack v0.9 draft seed registries (content owner's files, unmodified)
src/domain/         pure logic: ids, codes, graph rules, change sets, evidence, competency, archive, integrity
src/app/            importer pipeline, backup helpers, runtime wiring
src/adapters/       Dexie store, precompiled-validator adapter, Pack format adapter
src/ui/             Cognitive Atlas tokens and screens
tests/              node:test suites (conformance IMP-001..022 and more)
tools/              validator precompile, Pack validation
docs/               Stage 0 package v0.3
```
