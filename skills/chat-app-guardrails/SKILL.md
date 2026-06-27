---
name: chat-app-guardrails
description: Apply engineering guardrails for this Next.js chat application. Use when Codex needs to implement or review code while preserving project standards for Next.js App Router, TypeScript strictness, validation, performance, security, and client-versus-server boundaries. Trigger this skill when adding features, reviewing diffs, proposing refactors, or sanity-checking whether a change is safe and maintainable.
---

# Chat App Guardrails

## Overview

Use this skill to keep implementation quality consistent across the chat application. Favor simple, explicit code paths, validate inputs at boundaries, and protect server-only concerns from leaking into client code.

## Core Rules

1. Inspect the existing implementation before introducing a new pattern.
2. Prefer server components and server-side data access by default; opt into client components only for interaction or browser APIs.
3. Keep route files, page files, and UI components thin; move reusable logic into feature or server modules.
4. Validate all external input with schemas before database writes, auth-sensitive actions, or socket emits.
5. Preserve strict TypeScript types; do not patch over uncertainty with `any`, non-null assertions, or broad casts unless there is no better option and the reason is explicit.

## Next.js Fundamentals

- Use App Router conventions and colocate route-specific composition inside `src/app`.
- Prefer server components for data fetching, permission checks, and initial render data.
- Add `"use client"` only when the file genuinely needs hooks, event handlers, or browser APIs.
- Keep API route handlers and server actions as boundaries, not as places to accumulate business logic.
- Prefer progressive enhancement and simple request flows over client-heavy orchestration when both solve the task.

Read [references/nextjs-typescript.md](references/nextjs-typescript.md) when you need more detailed guidance on typing and component boundaries.

## TypeScript Practices

- Keep `strict` TypeScript enabled and preserve compiler safety settings when adjusting `tsconfig.json`.
- Model domain data with narrow types close to the owning feature.
- Prefer inference for local implementation details, but annotate exported functions, route handlers, server actions, and other public module contracts.
- Infer from Zod schemas or Prisma payload helpers when possible instead of duplicating shapes manually.
- Avoid `any`; prefer `unknown` plus schema validation or type guards at boundaries.
- Type function inputs and outputs explicitly when the contract matters across modules.
- Prefer discriminated unions over enums for workflow and state modeling when the shape carries meaning.
- Avoid ambient global types when a module-scoped type or feature-local helper is sufficient.
- Co-locate types with the feature or module that owns them unless the type is intentionally shared across domains.
- Prefer enabling stricter compiler flags such as `noUncheckedIndexedAccess`, `noPropertyAccessFromIndexSignature`, and `exactOptionalPropertyTypes` once the codebase is ready to absorb them.
- Explicitly model server-to-client and client-to-server contracts with typed inputs and outputs.
- Prefer small helper functions over booleans that hide state transitions.
- Keep utility signatures honest; if a function can fail or return null, encode that in the type.

## Validation And Data Boundaries

- Validate form input, query params, route params, and socket payloads.
- Normalize data before persistence or broadcast.
- Keep Prisma access server-only and funnel writes through well-named functions with clear authorization checks.
- Treat socket events as untrusted input even if they come from authenticated clients.

## Performance

- Fetch only the data needed for the current screen or event.
- Avoid moving large data trees into client components when a server component can render them directly.
- Use streaming, suspense boundaries, and incremental rendering when it improves perceived responsiveness.
- Keep realtime updates targeted: emit to the smallest necessary room or audience.
- Avoid premature memoization; prefer simpler data flow first, then optimize based on measured hotspots.

Read [references/performance-security.md](references/performance-security.md) when changes affect payload size, auth flows, caching, or realtime fan-out.

## Security

- Verify authentication and authorization on every server-side mutation and room subscription flow.
- Never trust client-provided identifiers for room membership, sender identity, or privileged flags without re-checking them on the server.
- Keep secrets and private config on the server only.
- Sanitize or constrain rich user input before rendering it back into the UI.
- Return the minimum data required for each view or event.

## UI And Styling

- Prefer accessible HTML semantics before custom wrappers.
- Keep shared UI primitives reusable and feature UI specific to its domain.
- Use Tailwind utilities consistently; extract helpers or components only when repetition becomes meaningful.
- Preserve responsive behavior for room lists, message panes, and composer interactions.

## Code Style

- Prefer `interface ComponentProps` for component props when the shape is owned by that component.
- Keep props interfaces in the same file when they are not reused elsewhere.
- Prefer `export const ComponentName = (props: ComponentProps) => { ... }` for ordinary components in this project.
- Avoid `React.FC` or `FC` as the default component typing pattern.
- Destructure props in the parameter list only when it improves readability; otherwise keep `props` intact.
- Keep files small enough that the component contract, markup, and nearby helper types remain easy to scan together.

## Localization

- Do not hardcode user-facing copy inside components, pages, server actions, or route handlers when the text is part of the product UI.
- Prefer feature-based locale organization such as `src/locales/auth/en.ts` and `src/locales/auth/th.ts` over language-first trees such as `src/locales/en/auth.ts`.
- Use stable dotted translation keys such as `auth.login.title`, `auth.login.submit`, `rooms.create.title`, and `messages.empty.state`.
- Keep translation keys consistent across locales; only values should differ between `en`, `th`, or other locale files.
- Localize validation, empty-state, and user-visible error messages when they surface in the UI.
- Keep domain models and stored data language-neutral unless multilingual content is a product requirement.
- Build components so longer translations do not break layout, truncation, or button sizing unexpectedly.
- Prefer locale-aware formatting for dates, times, and relative timestamps when they are shown to users.

## Naming Conventions

- Name React components with `PascalCase`, such as `RoomList` or `MessageComposer`.
- Name custom hooks with the `useXxx` prefix, such as `useRoomMessages`.
- Name Zod schemas with the `xxxSchema` suffix, such as `sendMessageSchema`.
- Name schema-inferred or validated input types with `XxxInput` or `XxxData`, such as `SendMessageInput`.
- Name server actions and mutation helpers with verbs, such as `createRoom`, `sendMessage`, `joinRoom`, or `leaveRoom`.
- Name read-oriented query helpers with `getXxx` or `listXxx`, such as `getRoomById` or `listUserRooms`.
- Name booleans with `is`, `has`, or `can`, such as `isMember` or `canSendMessage`.
- Name event handlers with `handleXxx`, such as `handleSubmit` or `handleRoomSelect`.
- Name constants with `UPPER_SNAKE_CASE`, such as `MAX_MESSAGE_LENGTH`.
- Prefer domain-first names over generic technical names; for example, `RoomMessageList` is better than `ChatListComponent`.
- Prefer `kebab-case` file names such as `message-composer.tsx`, `send-message.schema.ts`, and `use-room-messages.ts`.

## Review Checklist

Before finalizing a change, check:

1. Does the code respect server-versus-client boundaries?
2. Are inputs validated before side effects?
3. Are auth and room permissions enforced on the server?
4. Is the TypeScript contract explicit and trustworthy?
5. Does the change introduce avoidable rendering, fetching, or broadcast overhead?

If a proposed change conflicts with these guardrails, prefer the safer and simpler path unless the user explicitly asks for a different tradeoff.
