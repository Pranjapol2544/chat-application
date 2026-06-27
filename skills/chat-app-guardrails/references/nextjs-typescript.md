# Next.js And TypeScript Notes

## Component Boundary Rules

- Default to server components.
- Add `"use client"` only for local interaction state, effects, refs, or browser-only libraries.
- Do not import server-only modules into client components.
- Pass serialized data from server to client rather than passing server helpers.

## Data Fetching

- Fetch initial page data on the server.
- Keep loaders close to the domain that owns them.
- Prefer one well-shaped query over multiple scattered requests when it keeps code simpler.

## Type Discipline

- Keep `strict: true` enabled.
- Prefer `type` or `interface` names that reflect the domain, not the transport layer.
- Use `z.infer<typeof schema>` for validated payloads.
- Prefer inference for local variables, but annotate exported contracts and boundary functions.
- Prefer `unknown` over `any` when accepting uncertain input.
- Avoid `as unknown as` and similar escapes unless bridging an external library.
- Prefer helpers that narrow types instead of downstream defensive casting.

## Component Typing Style

- Prefer local `interface ComponentProps` declarations for component props.
- Keep props interfaces in the same file unless they are intentionally shared.
- Prefer:

```ts
interface MyComponentProps {
  title: string;
}

export const MyComponent = (props: MyComponentProps) => {
  return <div>{props.title}</div>;
};
```

- Avoid `React.FC` or `FC` as the default component type wrapper.

## Naming Patterns

- Components: `PascalCase`
- Hooks: `useXxx`
- Schemas: `xxxSchema`
- Inferred input types: `XxxInput`
- Mutation or action helpers: verb-first names such as `createRoom`
- Query helpers: `getXxx` or `listXxx`
- Boolean flags: `isXxx`, `hasXxx`, `canXxx`
- File names: `kebab-case`

## Localization Patterns

- Prefer feature-based locale files such as `src/locales/auth/en.ts` and `src/locales/auth/th.ts`.
- Use stable dotted keys such as `auth.login.title` instead of local-only labels that can collide across features.
- Avoid hardcoding product copy in components when the UI is expected to support multiple languages.
- Keep translation objects `as const` when helpful so key access stays typed and predictable.

## Compiler Safety Flags

- `noUncheckedIndexedAccess` helps surface missing map or record entries.
- `noPropertyAccessFromIndexSignature` helps catch accidental property assumptions on loose objects.
- `exactOptionalPropertyTypes` makes optional fields behave more honestly and helps avoid silent `undefined` misuse.

Adopt these flags deliberately. If enabling them creates many errors, fix the highest-risk boundary code first rather than muting the compiler globally.
