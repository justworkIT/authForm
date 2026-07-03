# Contributing to AuthForm

Thanks for considering a contribution. This project is a reusable auth module,
so the bar for changes is: **does this make it more correct, more secure, or
more portable across projects** — not just "more features."

## Getting started

1. Fork the repo and clone your fork
2. `npm install`
3. Follow the [README setup steps](./README.md#getting-started) to connect a
   Supabase project (you'll need your own for local development)
4. Create a branch off `main`:
   ```bash
   git checkout -b fix/short-description
   ```

## Branch naming

- `fix/...` — bug fixes
- `feat/...` — new functionality
- `docs/...` — documentation-only changes
- `chore/...` — tooling, deps, CI

## Commit messages

Keep them short and in the imperative mood, e.g.:
```
Fix password toggle overriding controlled type prop
Add rate limiting note to login server action
```

## Before opening a PR

- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] You tested the signup, login, and Google OAuth flows manually against
      a real Supabase project (there's no test suite yet — see "Testing" below)
- [ ] Any new env vars or Supabase setup steps are added to `.env.local.example`
      and the README's setup section
- [ ] No secrets, API keys, or `.env.local` values are committed

## Code style

- TypeScript throughout; avoid `any`
- Server Actions validate input independently of client-side checks — never
  trust client validation alone (see `app/(auth)/actions.ts` for the pattern)
- Match existing component structure: shadcn/ui primitives in `components/ui/`,
  feature components in `components/auth/`
- Keep components accessible: proper labels, ARIA attributes on dynamic states,
  keyboard operability — this is an auth form, it needs to work for everyone

## Testing

There's no automated test suite yet. If you're adding one (very welcome),
open an issue first to align on the approach (Playwright for e2e auth flows
is a reasonable default) before investing significant time.

## Reporting bugs / requesting features

Open a [GitHub issue](https://github.com/justworkIT/authForm/issues) with:
- What you expected vs. what happened
- Steps to reproduce (for bugs)
- Whether it's specific to a Supabase config or general to the module

## Questions

Open an issue with the `question` label, or start a discussion if the repo
has GitHub Discussions enabled.
