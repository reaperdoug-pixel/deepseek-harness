---
description: "Brazilian Portuguese (pt-BR) language pack for the web GUI: how users select it, which namespaces it translates, and how it plugs into the locale catalog."
kind: "package-reference"
---

# @deepseek-ai/dsh-client-locale-pt-br

English | [中文](README.zh.md)

## Summary

Use `dsh-client-locale-pt-br` to read the web GUI in Brazilian Portuguese. The package is a language pack: it adds a `pt-BR` entry to the catalog owned by [`dsh-client-locale`](../locale/README.md) and registers one pt-BR dictionary for each namespace that the shipped client plugins translate. Selecting Português (Brasil) in Settings → General switches the UI copy without a reload; any key a dictionary lacks falls back to English.

## Table of Contents

- [Use this package](#use-this-package)
- [Understand the implementation](#understand-the-implementation)
- [Further Exploration](#further-exploration)
- [Model Experience](#model-experience)
- [Known Limitations and Deferred Work](#known-limitations-and-deferred-work)
- [Dev Note](#dev-note)

-----

<a id="use-this-package"></a>
## Use this package

Enable it by listing the plugin in the web client composition; it needs no configuration. Once loaded, the language appears in the Settings → General language selector.

### Choosing the language

Open Settings → General and select Português (Brasil). The UI copy switches immediately, `<html lang>` becomes `pt-BR`, and the choice is stored through the locale plugin's preference. A browser that requests `pt-BR`, or any `pt-*` tag, selects this language on first load when no stored preference exists.

### Command names stay in English

The `/goal`, `/plan`, `/feedback`, `/compact`, `/permission`, and `/export` spellings are the registered command names. The pack therefore keeps the `token.*` entries of the `command` namespace identical to English; translating them would produce a typed spelling that command resolution does not recognise.

### Adding or correcting a translation

Edit the dictionary file for the namespace under [`src/locales/`](src/locales/). Keys and `{placeholder}` names must match the English dictionary of that namespace; a missing key renders in English, and an extra key is never read. Register a new namespace by adding its file and one entry in [`src/locales/index.ts`](src/locales/index.ts).

-----

<a id="understand-the-implementation"></a>
## Understand the implementation

<details>
<summary>Implementation internals — click to expand</summary>

This section explains how the pack is built; observable behavior is covered in [Use this package](#use-this-package).

### Design concept

The pack is a client plugin with one injected service, `locale`. Its `apply` registers the language definition with `ctx.locale.addLanguage({ id: 'pt-BR', fallback: 'en' })` and then calls `ctx.locale.register(ns, 'pt-BR', dictionary)` once per namespace, each as an owned effect. Unloading the plugin removes the language and every dictionary, and an active `pt-BR` selection returns to the browser-derived or default locale.

### Namespace ownership

Each dictionary belongs to the namespace of the plugin that renders its keys, such as `chat`, `sidebarRight`, or `settings.models`. The pack does not import those plugins; it only mirrors their key sets. Alignment with the English dictionaries is checked by the pack's behavior specs and by review, not by the compiler, because the per-locale `register` form is untyped.

### Source map

| File | Role |
|---|---|
| [`src/client/index.ts`](src/client/index.ts) | Client plugin: registers the language and every namespace dictionary |
| [`src/index.ts`](src/index.ts) | Node half: empty `apply` so the plugin is listed in the Host composition |
| [`src/locales/index.ts`](src/locales/index.ts) | Namespace table `PT_BR_DICTIONARIES` |
| [`src/locales/`](src/locales/) | One pt-BR dictionary per namespace |

</details>

-----

<a id="further-exploration"></a>
## Further Exploration

Read these when the pack is not enough: the registry it extends and the client group it belongs to.

- [Locale plugin](../locale/README.md) — the language catalog, fallback chain, and dictionary registry this pack extends.
- [Client group map](../README.md) — the browser half this package belongs to.

-----

<a id="model-experience"></a>
## Model Experience

None, as the language pack is a browser-side UI plugin that registers nothing model-facing.

#### KV Cache effect

None; this package neither assembles nor sends a provider request.

## Known Limitations and Deferred Work

<a id="known-limitations-and-deferred-work"></a>


These limits define where Portuguese coverage is incomplete. They are current package constraints, not a task backlog.

- **Electron shell copy is not covered** — the desktop application resolves its own dialogs and menus from its own dictionary, which is separate from this browser pack.
- **Registry-held text reads its translation once** — copy captured at registration time outside the slot render path keeps the language it was registered under until re-registration, as documented for the locale plugin.
- **Plural rules are per key** — pt-BR treats zero as singular in speech, but the shared `.one`/`.other` key convention selects `.one` only for a count of one.

<a id="dev-note"></a>
### Dev Note

<details>
<summary>Working context for maintainers — click to expand</summary>

None.

</details>

**Runtime invariant:** No companion is published. The pack has no independent runtime source to compare against; registration and disposal are asserted by behavior specs.
