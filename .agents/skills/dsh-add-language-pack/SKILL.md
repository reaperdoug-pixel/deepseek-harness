---
name: dsh-add-language-pack
description: Use when adding a new UI language (for example pt-BR, es, ja) to deepseek-harness, or when refreshing an existing language pack after an upstream merge added namespaces or keys. Covers the client language-pack plugin, the Electron desktop dictionary, workspace registration, docs gates, verification, and the errors already hit once.
---

# DSH Add Language Pack

The web GUI ships `en` and `zh`. Any other language is a **client plugin** that calls `ctx.locale.addLanguage()` and `ctx.locale.register(ns, '<id>', dict)` once per namespace (see `packages/client/locale/README.md`, "Registering a language pack"). The Electron shell is separate: `apps/desktop/src/locale.ts` holds its own typed dictionaries. The reference implementation is `packages/client/locale-pt-br`; copy its layout.

Replace `pt-BR` / `ptBR` / `locale-pt-br` below with the new language's BCP 47 id, identifier, and package suffix.

## 0. Environment rules

- Work from the repository root. A bare `cd` into a package persists in the shell; use absolute paths.
- If the checkout is under OneDrive, avoid extra full installs; `node_modules` is large and syncs.
- The GateGuard hook denies the first `Write`/`Edit` of every path until the reply states: callers, duplicates checked, data shape, and the user's instruction verbatim. After stating them, retry the same call. Denied paths are not created, so retries are safe. To avoid resending large content, make a tiny first attempt per new path, then write the real content.
- Node 24 strips TypeScript types, so scripts can `import` `locales.ts` files directly with `node script.mjs`; no `tsx` needed.

## 1. Inventory the namespaces

Every dictionary-owning plugin registers one namespace. List them, never trust an old table:

```sh
git grep -nE "locale\.register\(" -- 'packages/**/src/**' 'apps/**/src/**'
git grep -nE "(const|let) (NS|MENU_NS|LOCALE_NS|SETTINGS_NS|PERMISSION_ACCESS_NS|namespace)\b[^=]*= " -- 'packages/client/**/src/**'
```

Irregular sites found last time (handle by hand in `scripts/extract.mjs` / `extract2.mjs`):

| Site | Why irregular |
|---|---|
| `ui-permission-presets` | Two namespaces: `settings.permission` and `permission.access` (`accessEn`/`accessZh`) |
| `ui-agent-preset` `locales.ts` | Re-exports `@deepseek-ai/dsh-agent-presets/display`, which Node cannot resolve. Strip those lines into a temp copy before importing |
| `ui-directory-picker-browse` | Dictionaries are inline in `index.ts` (namespace `directory-browser`), not in a `locales.ts` |
| `ui-sidebar-documentpreview` | Seven namespaces in sub-folders (`code`, `html`, `image`, `markdown`, `office`, `pdf`, root) |
| `ui-tool` | Registers no dictionary; it uses the `conversation` namespace |
| `ui-chat` | File is `locale.ts` (singular) |
| `apps/desktop/src/locale.ts` | Not a plugin; typed `DesktopMessages` |

Last count: 48 client namespaces, about 1,570 strings, plus 85 desktop strings.

## 2. Extract the English source

Scripts live in `scripts/` next to this file. Run them from a scratch directory (not the repo):

```sh
node <skill>/scripts/extract.mjs  <repo-root> dicts.json     # 46 regular sites
node <skill>/scripts/extract2.mjs <scratch-dir> <repo-root>  # agent-preset, directory-browser, desktop
node <skill>/scripts/show.mjs common chat approval           # print English per namespace
```

`extract*.mjs` hardcode the site list; update it from step 1. Parity of `en` and `zh` key sets is checked by `extract2.mjs`. Translate from `en`; use `zh` only to disambiguate.

## 3. Write the dictionaries

One file per namespace in `packages/client/locale-pt-br/src/locales/`, file name = namespace with `.` replaced by `-` (`settings.models` becomes `settings-models.ts`; names without dots keep their casing, for example `sidebarRight.ts`, `workflowRun.ts`). Shape:

```ts
/** pt-BR dictionary for the `<ns>` namespace. */
export const ptBR = {
  'key': 'text with {placeholder}',
} as const satisfies Record<string, string>
```

Rules learned the hard way:

- Keys and `{placeholder}` names must match English exactly. Missing key falls back to English; extra key is never read.
- Plural pairs keep `.one` / `.other` keys (the code picks `.one` only for a count of one).
- **Command tokens stay English.** `command` namespace `token.goal|plan|feedback|compact|permission|export` must equal the registered command names. `resolveCommand` only knows the built-in `zh` and `en` aliases, so a translated token is typed into the composer and then not recognised.
- Locale formats: `chat` `number.groupSeparator`, `clock.md`, `clock.ymd`, `workspace` `date.ymd`, `number.thousand/million`, relative-time suffix (`time.ago`). Localise each to the language's convention.
- Keep product and tool names verbatim: DeepSeek Harness, DSH, Cordis, PTC, Bash, Pwsh, Grep, Glob, VS Code, GitHub, Feishu, `dsh plugin add`, file names, URLs, `allowBuilds`.
- Preserve `\n` and leading/trailing spaces in values such as `' ({tokens} ...)'` and `'Retry delay: '`.
- Use single-quoted strings; avoid raw apostrophes in the target text or escape them. Use `"…"` inside single-quoted text for quotes.
- `settings.locale` has a single key, `language.title`.

## 4. Verify the dictionaries

```sh
node <skill>/scripts/verify.mjs <repo>/packages/client/locale-pt-br/src/locales
```

Run it from the directory holding `dicts.json`. It reports `MISSING`, `EXTRA`, `PLACEHOLDER` mismatches and which namespaces are still `TODO`. `UNKNOWN FILE index.ts` is expected. Target: `todo 0` and no other problems.

## 5. Scaffold the package

Copy `packages/client/locale-pt-br` and rename. Files:

| File | Notes |
|---|---|
| `package.json` | name `@deepseek-ai/dsh-client-locale-<suffix>`, `dsh.client.inject: ["@deepseek-ai/dsh-client-locale"]`, `platform: web`, `immediately: true`, devDependencies `@deepseek-ai/cordis` and `@deepseek-ai/dsh-client-locale` |
| `tsconfig.json` | extends `tsconfig.base.client.json`; references `../../../vendor/cordis` and `../locale` |
| `tsdown.config.ts` | `clientBundle('<package name>', ['lib/types/index.js'])` |
| `src/index.ts` | empty node-half `apply(): void {}` |
| `src/client/index.ts` | `inject = ['locale']`; `addLanguage({ id, label: '<native name>', fallback: 'en' })` then one `ctx.effect(() => ctx.locale.register(ns, ID, { ...dict }), label)` per namespace |
| `src/locales/index.ts` | `PT_BR_DICTIONARIES` table of `[namespace, dictionary]` |
| `tests/apply.client.spec.ts` | see step 8 |
| `README.md`, `README.zh.md`, `README.i18n.yaml` | bilingual pair, same section ids as `packages/client/locale/README.md` |

Fallback must be `en` (the chain must end at English). `register(ns, id, dict)` throws if the namespace already has that locale, so a second pack with the same id conflicts.

## 6. Register in the workspace

Edit each of these (the first edit of each path needs the GateGuard facts):

1. `tsconfig.base.json`: path alias `"@deepseek-ai/dsh-client-locale-<suffix>": ["./packages/client/locale-<suffix>/src"]` after the `dsh-client-locale` alias.
2. `tsconfig.client.json`: `{ "path": "./packages/client/locale-<suffix>" }` after `locale`.
3. `packages/bundle/web-app/package.json`: `"@deepseek-ai/dsh-client-locale-<suffix>": "workspace:^"`.
4. `packages/bundle/web-app/cordis.patch.yml`: entry `id: locale-<suffix>`, `name: '@deepseek-ai/dsh-client-locale-<suffix>'` after the `locale` entry.
5. `scripts/verify-package-readme-model-experience.ts`: `'packages/client/locale-<suffix>': { kind: 'none', reason: 'Browser-side language pack; registers nothing model-facing.' }`.
6. `packages/client/README.md` and `README.zh.md`: add a table row after `locale/`; then update `packages/client/README.i18n.yaml` with `git hash-object README.md` and `README.zh.md`.
7. Lockfile: `pnpm install --lockfile-only --ignore-scripts` (offline fails on missing metadata; online works). It also injects unrelated `deprecated:` lines for `@modelcontextprotocol/server-everything` and `server-filesystem`; delete exactly those two lines so the diff only holds the new importer and the web-app dependency.
8. Config catalog: `pnpm run gen-config-catalog`, add the same bullet to `docs/config-catalog.zh.md` (full-width parentheses form), then `pnpm run verify-translation-pairing --write docs/config-catalog.md`.

Not needed: `docs/dependency-catalog.json` (generated from `node_modules`).

## 7. Desktop (Electron)

In `apps/desktop/src/locale.ts`: add `export const ptBR = {...} as const satisfies DesktopMessages` after `zh`, widen `DesktopLocale.id` to include `'pt-BR'`, and branch in `resolveDesktopLocale` on `language.startsWith('pt')`. `locale.id` is sent as the `x-client-locale` header to the update service, so confirm the backend accepts a new id. `installerLanguages` in `apps/desktop/scripts/electron-builder-config.mjs` is not touched by this change.

Extend `apps/desktop/tests/locale.spec.ts` with key-set parity and placeholder parity against `en`.

## 8. Tests that pass first time

In `tests/apply.client.spec.ts` of the pack:

```ts
const ctx = new Context()
const locale = new LocaleRuntime(ctx)   // from '@deepseek-ai/dsh-client-locale/client'
ctx.provide('locale', locale)
const plugin = ctx.plugin({ inject: [...inject], apply })
await plugin.await()
```

- `locale.bind('ns')` is typed to declared keys. Dynamic keys like `` `token.${name}` `` fail `tsc`; assert each literal key.
- A bare `LocaleRuntime` has **no** `en` dictionaries; assert the translated value after `setLocale`, not an English value before it.
- Unload test: `await plugin.dispose()`. Without `await` the language is still registered.
- Lint rule `no-confusing-void-expression`: use `expect(() => { hostApply() }).not.toThrow()`.
- Cover `src/index.ts` (empty `apply`); the repo requires 100% per-file coverage under `packages/*/*/src`.

## 9. Verification order

```sh
pnpm install --frozen-lockfile
pnpm run typecheck
pnpm run lint
pnpm exec vitest run packages/client/locale-pt-br packages/client/locale apps/desktop/tests/locale.spec.ts
pnpm run verify-translation-pairing
pnpm run doc-sync
pnpm run build
pnpm dsh web
```

Known behaviors:

- `pnpm install --frozen-lockfile` must run at the repository root; elsewhere it reports `ERR_PNPM_NO_LOCKFILE`.
- `pnpm dsh web` before `pnpm run build` fails with every plugin "failed to import" (no `lib/`). Build first.
- `doc-sync` can fail `refuses a target whose real path escapes the repository` with `EPERM ... symlink` on Windows without Developer Mode. This is environmental; ignore it and say so.
- `verify-config-catalog` fails until step 6.8 is done.
- `pnpm run test:coverage` is the authoritative coverage gate; a targeted `vitest --coverage` run did not list the new package.

Manual check in the browser: Settings, General shows the new language; the UI switches without reload; `document.documentElement.lang` equals the id; reload keeps the choice; the `/` command menu still resolves `/goal` and `/plan`; no raw keys such as `chat.loadingHistory` appear.

## 10. Refresh after an upstream merge

1. Re-run step 1; any namespace missing from `src/locales/index.ts` is new.
2. Re-run `extract.mjs`/`extract2.mjs`, then `verify.mjs`: `MISSING` lists new English keys, `EXTRA` lists removed ones, `PLACEHOLDER` lists changed templates.
3. Missing pack keys render in English, so nothing breaks at runtime; the desktop dictionary does break `typecheck` when `en` gains a key because `ptBR` must satisfy `DesktopMessages`.
4. Resolve conflicts in the shared files of step 6 (`pnpm-lock.yaml`: re-run `pnpm install --lockfile-only` instead of hand-merging).

## 11. Closing report

State what ran and what did not. Never claim `test:coverage`, the browser check, or the symlink-dependent gate passed unless they did.
