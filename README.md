# Quiver 🏹

> The most complete React hooks library ever built.  
> 13 packages · 100+ hooks · Zero runtime dependencies · Universally compatible.

[![CI](https://github.com/pthanksdev/react-hooks/actions/workflows/ci.yml/badge.svg)](https://github.com/pthanksdev/react-hooks/actions)
[![npm](https://img.shields.io/npm/v/@quiver-lib/core)](https://npmjs.com/package/@quiver-lib/core)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## Packages

| Package | Description | Install |
|---|---|---|
| `@quiver-lib/core` | Lifecycle, state machine, undo/redo | `pnpm add @quiver-lib/core` |
| `@quiver-lib/async` | Fetch, retry, optimistic updates, infinite scroll | `pnpm add @quiver-lib/async` |
| `@quiver-lib/form` | Form validation, field arrays, autosave, masks | `pnpm add @quiver-lib/form` |
| `@quiver-lib/storage` | localStorage, IndexedDB, expirable, encrypted | `pnpm add @quiver-lib/storage` |
| `@quiver-lib/ui` | DOM, scroll, keyboard, parallax, context menu | `pnpm add @quiver-lib/ui` |
| `@quiver-lib/utils` | Debounce, throttle, timers, typewriter, FSM | `pnpm add @quiver-lib/utils` |
| `@quiver-lib/realtime` | WebSocket, SSE, CRDT, presence, BroadcastChannel | `pnpm add @quiver-lib/realtime` |
| `@quiver-lib/hardware` | Bluetooth, USB, NFC, Gamepad, WebXR, sensors | `pnpm add @quiver-lib/hardware` |
| `@quiver-lib/crypto` | AES-256-GCM, WebAuthn, HMAC, CSRF, rate limiting | `pnpm add @quiver-lib/crypto` |
| `@quiver-lib/ai` | LLM streaming, speech, smart search, classifier | `pnpm add @quiver-lib/ai` |
| `@quiver-lib/a11y` | Focus trap, ARIA live, WCAG contrast, reduced motion | `pnpm add @quiver-lib/a11y` |
| `@quiver-lib/perf` | Web Vitals, FPS, memory pressure, long tasks | `pnpm add @quiver-lib/perf` |
| `@quiver-lib/data` | Virtual list, table, sort, filter, paginate, CSV | `pnpm add @quiver-lib/data` |

---

## Quick Start

```tsx
// State & lifecycle
import { useToggle, useUndoable, useStateMachine } from '@quiver-lib/core';

// Data fetching
import { useFetch, useSmartRetry, useOptimisticUpdate } from '@quiver-lib/async';

// Forms
import { useForm, useFieldArray, useMaskedInput } from '@quiver-lib/form';

// Storage
import { useLocalStorage, useIndexedDB, useExpirableStorage } from '@quiver-lib/storage';

// UI / DOM
import { useMediaQuery, useHotkey, useScrollProgress } from '@quiver-lib/ui';

// Real-time
import { useWebSocket, useCRDT, usePresence } from '@quiver-lib/realtime';

// Cryptography
import { useWebCrypto, useWebAuthn, useCSRFToken } from '@quiver-lib/crypto';

// AI
import { useAIStream, useSpeechRecognition, useSmartSearch } from '@quiver-lib/ai';

// Hardware
import { useGeolocation, useGamepad, useWebBluetooth } from '@quiver-lib/hardware';

// Accessibility
import { useFocusTrap, useAnnounce, useColorContrast } from '@quiver-lib/a11y';

// Performance
import { useWebVitals, useFPS, useMemoryPressure } from '@quiver-lib/perf';

// Data management
import { useTable, useVirtualList, useCSVExport } from '@quiver-lib/data';
```

---

## Security

Quiver has a **zero-tolerance policy** on vulnerabilities:

- ✅ Runtime input validation on every hook that accepts external data
- ✅ Only `http://` / `https://` URLs accepted — `javascript:`, `data:`, `blob:` throw errors
- ✅ Storage keys validated against strict allowlist regex
- ✅ SSRF protection in `useFetch` and `useAIStream`
- ✅ `useCookies` enforces `Secure` + `SameSite=Strict` by default
- ✅ `useSecureStorage` encrypts at rest with AES-256-GCM
- ✅ `useRateLimit` uses `performance.now()` — immune to `Date` manipulation
- ✅ `npm audit --audit-level=high` blocks CI on HIGH/CRITICAL CVEs
- ✅ Packages published with `--provenance` for supply-chain trust

---

## Framework Compatibility

| Framework | CJS | ESM | SSR-Safe |
|---|---|---|---|
| Next.js 13/14/15 | ✅ | ✅ | ✅ |
| Remix v2 | ✅ | ✅ | ✅ |
| Vite 5 | ✅ | ✅ | — |
| Create React App 5 | ✅ | ✅ | — |
| Gatsby 5 | ✅ | ✅ | ✅ |
| Expo (web) | ✅ | ✅ | — |
| Astro 4 | ✅ | ✅ | ✅ |
| T3 Stack | ✅ | ✅ | ✅ |

- React 17 / 18 / 19 compatible
- Strict Mode safe · Concurrent Mode safe
- `"sideEffects": false` — fully tree-shakeable
- Zero runtime dependencies

---

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run all tests
pnpm test

# Type check
pnpm typecheck

# Lint
pnpm lint

# Run docs (Storybook)
pnpm docs:dev
```

---

## License

MIT © [Quiver Contributors](https://github.com/pthanksdev/react-hooks)
# Quiver
