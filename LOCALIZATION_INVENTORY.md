# Localization Inventory

Generated during the English localization pass on 2026-07-04.

## Completed In This Pass

| File | Original text/category | English translation/action | Type |
| --- | --- | --- | --- |
| `README.md` | Chinese upstream README and legal disclaimer | Rewritten as English fork README with upstream attribution, AGPL-3.0 notice, build usage, disclaimer, and syncing notes | docs/compliance |
| `ATTRIBUTION.md` | Missing attribution notice | Added unofficial English-language fork attribution and modification notice | compliance |
| `package.json` | Root license metadata was `ISC` | Changed to `AGPL-3.0` to match `LICENSE.md` | legal/config |
| `package-lock.json` | Root package lock license metadata was `ISC` | Changed root package metadata to `AGPL-3.0`; dependency licenses are unchanged | legal/config |
| `app/renderer/engine-link-startup/src/pages/StartupPage/utils.ts` | Local/remote/unknown mode labels and progress comments | Translated to `Local Mode`, `Remote Mode`, `Unknown Mode`, and English documentation comments | UI/comment |
| `app/renderer/engine-link-startup/src/pages/StartupPage/components/SoftwareBasics/index.tsx` | Commented-out Chinese language selector | Removed dead commented JSX containing Chinese UI text | UI/comment |
| `app/renderer/engine-link-startup/src/pages/StartupPage/components/RemoteEngine/RemoteEngine.tsx` | Remote connection labels, placeholders, TLS/PEM help, history notice | Translated visible startup remote-connection UI to English | UI/help |
| `app/renderer/engine-link-startup/src/pages/StartupPage/components/YaklangEngineWatchDog/index.tsx` | Startup console messages and documentation comments | Translated visible startup log messages to English | UI/log/comment |
| `app/renderer/engine-link-startup/src/pages/StartupPage/components/YakitLoading/index.tsx` | `重新执行` and documentation comments in touched startup component | Translated to `Retry` and English comments | UI/comment |

## Existing English Locale Coverage

The repository already contains `app/renderer/src/main/public/locales/en` and `i18n.ts` defaults to English (`lng: 'en'`, `fallbackLng: 'en'`). Locale parity across `en`, `zh`, and `zh-TW` passed.

## Remaining Inventory

The full CJK scan still reports remaining matches outside the intentional Chinese locale directories. Broad categories include:

- `README_LEGACY.md` and `backups/README.md`: legacy Chinese documentation.
- `.github/ISSUE_TEMPLATE` and workflows/actions: bilingual issue templates and Chinese CI comments/messages.
- `app/main/**`: Electron main-process comments plus some user-facing dialogs/logs/templates.
- `app/renderer/engine-link-startup/src/pages/StartupPage/index.tsx`, `grpc.ts`, `LocalEngine`, `DownloadYaklang`, `AgreementContentModal`, and related tests: additional startup UI/log strings.
- `app/renderer/src/main/src/**`: main renderer UI, default constants, plugin templates, comments, and documentation.
- `app/renderer/src/main/src/alibaba/ali-react-table-dist/**`: bundled/vendor files; not translated in this pass because they appear to be third-party distributed artifacts.
- `app/renderer/src/main/public/locales/en/spaceEngine.json`: intentionally includes Chinese examples (`四川`, `成都`) to document supported search syntax.
- `app/renderer/src/main/public/locales/zh/**` and `zh-TW/**`: intentionally preserved Chinese locale source files.

## Intentionally Not Translated In This Pass

- `LICENSE.md`: preserved as the authoritative AGPL-3.0 license text.
- `app/renderer/src/main/public/locales/zh/**` and `app/renderer/src/main/public/locales/zh-TW/**`: intentional Chinese locale files.
- Third-party/vendor/generated artifacts under `app/renderer/src/main/src/alibaba/ali-react-table-dist/**` and built assets: avoided to prevent altering bundled third-party code.
- Image files and binary assets: not modified.
