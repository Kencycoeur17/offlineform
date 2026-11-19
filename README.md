# OfflineForm

**Resilient React form drafts for unreliable networks.**

[![CI](https://github.com/Kencycoeur17/offlineform/actions/workflows/ci.yml/badge.svg)](https://github.com/Kencycoeur17/offlineform/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

OfflineForm is a small TypeScript/React toolkit for opt-in browser draft persistence and recovery. The initial MVP stores drafts locally; **it does not submit or synchronize data with a server**.

## Features

- React hook with typed form values
- Draft recovery after reload
- Explicit opt-in localStorage persistence (disabled by default)
- Optional draft expiration
- Clear draft operation
- Save status and storage-error reporting
- Storage adapter for testing or custom implementations

## Install and try locally

Node.js 20+ is recommended. The package is not published to npm yet.

```bash
git clone https://github.com/Kencycoeur17/offlineform.git
cd offlineform
npm install
npm test
```

## Example API

```tsx
import { useOfflineForm } from "@braintechken/offlineform-react";

function ContactForm() {
  const form = useOfflineForm({
    key: "contact-draft",
    initialValues: { name: "", message: "" },
    persistence: "local",
    maxAgeMs: 7 * 24 * 60 * 60 * 1000
  });

  if (!form.ready) return <p>Loading draft...</p>;

  return (
    <form onSubmit={(event) => {
      event.preventDefault();
      // Call your own validated API here.
      // Clear the draft only after the server confirms success.
    }}>
      <input
        aria-label="Name"
        value={form.values.name}
        onChange={event => form.setValue("name", event.target.value)}
      />
      <textarea
        aria-label="Message"
        value={form.values.message}
        onChange={event => form.setValue("message", event.target.value)}
      />
      <p>Draft status: {form.status}</p>
      <button type="submit">Submit</button>
      <button type="button" onClick={form.clearDraft}>Discard draft</button>
    </form>
  );
}
```

The package must be built or linked locally until a public npm release exists.

## Interactive demo

Run the demo locally:

```bash
npm install
npm run demo:dev
```

Open http://127.0.0.1:4173 and enter a draft, reload the page, or discard it. The demo does not send data to a server.

Browser end-to-end tests use Playwright:

```bash
npx playwright install chromium
npm run test:e2e
```

CI also builds the demo and runs the Chromium tests. Browser test results should be verified on the [Actions page](https://github.com/Kencycoeur17/offlineform/actions).

## How it works

When enabled, the hook loads a stored draft after mount, then saves subsequent edits to a browser storage adapter. It does not assume that browser storage is always available or durable.

## Important limitations

- Browser storage is **not encrypted** and is accessible to scripts on the same origin.
- Do not persist passwords, payment details, health information or other sensitive records without a separate security design.
- Draft persistence is not server submission.
- Browser storage can be evicted or cleared.
- Storage utility tests and browser end-to-end tests are included; broader browser compatibility and security reviews remain planned.

See [privacy guidance](docs/privacy.md), [synchronization roadmap](docs/synchronization.md) and [security policy](SECURITY.md).

## Roadmap

- [x] Draft serialization, restoration, expiration and storage tests
- [x] Opt-in React hook with TypeScript types
- [x] Browser end-to-end tests for restore, discard and preview
- [x] Runnable React demo
- [ ] Simulated network interruptions and browser compatibility tests
- [ ] IndexedDB adapter
- [ ] Explicit submission queue with idempotency safeguards
- [ ] npm package publication

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Contributions to tests, documentation, accessibility and browser compatibility are welcome.

## License

MIT — see [LICENSE](LICENSE).

Maintained by [Braintechken](https://github.com/Kencycoeur17).
