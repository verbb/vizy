# Ship-risk browser checklist (beta-1 §6.9)

Automated coverage includes the compiled editor harness (`tests/browser/*.spec.ts`) and a disposable, installed Craft CP (`tests/browser-cp/authoring.spec.ts`). The CP suite logs in and verifies saved content independently of the browser.

| Check | Automated where | Status |
| --- | --- | --- |
| Editor boots / ProseMirror | `editor.spec.ts` | harness |
| FieldLayout adopt / batch | `editor.spec.ts` | harness |
| Dirty / revert baseline | `editor.spec.ts` | harness |
| Hosted editors boot (×10) | `editor.spec.ts` | harness |
| Hosted nested flush → input + `input` notify | `editor.spec.ts` | harness |
| Toolbar / collapse / bold | `authoring-ui.spec.ts` | harness |
| Field settings a11y / drag | `field-settings-*.spec.ts` | harness |
| Escape stays harness-safe | `editor.spec.ts` | harness |
| Real CP save/reopen, Hosted fields and required-field recovery | `browser-cp/authoring.spec.ts` | installed Craft |
| Matrix identity, relation removal, autosave/revert/publication | `browser-cp/authoring.spec.ts` | installed Craft |
| CSRF and asset metadata permissions | `browser-cp/authoring.spec.ts` | real HTTP |
| Assets widget upload, saved reference and destination bytes | `browser-cp/authoring.spec.ts` | installed Craft |

From the plugin checkout, run `npm run test:browser` for the harness or `npm run test:cp` for the installed CP. The latter owns the disposable runtime until the browser run finishes.
