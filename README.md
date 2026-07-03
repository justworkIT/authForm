# AuthForm

A reusable signup/login module for Next.js apps: email/password + Google OAuth,
backed by Supabase Auth, styled with shadcn/ui.

## What's inside

```
app/
  (auth)/
    login/page.tsx        Login route
    signup/page.tsx        Signup route
    actions.ts             Server actions: signUpWithEmail, signInWithEmail,
                            signInWithGoogle, logout
  auth/callback/route.ts   OAuth + email-confirmation callback handler
  dashboard/page.tsx        Example protected route
  layout.tsx / page.tsx     Root layout + redirect-based landing page
components/
  auth/                    Form components (signup, login, password field,
                            status messages, Google button, card shell, logout)
  ui/                      shadcn/ui primitives (button, input, label, card, separator)
lib/
  supabase/
    client.ts               Browser Supabase client
    server.ts                Server Component / Server Action client
    middleware.ts            Session refresh logic used by middleware.ts
middleware.ts                Runs on every request to keep the session cookie fresh
```

## Using this in a new project

Every step below has to be redone per project — none of it is shared across apps.

### 1. Create a Supabase project
- [supabase.com/dashboard](https://supabase.com/dashboard) → New project
- Copy the Project URL and anon public key from **Settings → API**

### 2. Enable auth providers
- **Authentication → Providers → Email**: on by default, confirm "Confirm email" matches whether you want email verification before login
- **Authentication → Providers → Google**: toggle on, then follow Supabase's prompt for the Google Client ID/Secret (see step 3)
- **Authentication → URL Configuration**: set **Site URL** to your deployed URL (or `http://localhost:3000` during dev), and add `{your-url}/auth/callback` to **Redirect URLs**

### 3. Set up Google OAuth credentials
- [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials → Create OAuth client ID (Web application)
- Authorized redirect URI: the callback URL Supabase's Google provider screen shows you (a `supabase.co` URL, not your app's `/auth/callback`)
- Paste the resulting Client ID/Secret into Supabase's Google provider settings
- This step is tied to each Google Cloud project/domain — it does not carry over between apps

### 4. Configure environment variables
```bash
cp .env.local.example .env.local
```
Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from step 1.

### 5. Install and run
```bash
npm install
npm run dev
```

Visit `/signup` or `/login`. After auth, users land on `/dashboard` (replace
this with your app's real landing page — it's just a working example here).

## What's copy-paste-ready vs. project-specific

| Copy as-is | Needs redoing per project |
|---|---|
| All files in `components/`, `lib/`, `middleware.ts`, `app/(auth)/`, `app/auth/callback/` | New Supabase project + credentials |
| Form validation, error handling, accessibility behavior | Google OAuth consent screen / client ID |
| Session refresh logic | `.env.local` values |
| | Redirect targets in `actions.ts` / `callback/route.ts` if `/dashboard` isn't your landing page |

## Notes on design decisions

- **Generic error on bad login** ("Invalid email or password") is intentional — it avoids confirming whether an email is registered.
- **Server Actions validate independently of the client.** The client-side `required`/`minLength` attributes are just UX; `actions.ts` re-validates everything, since client checks can be bypassed.
- **`middleware.ts` matcher excludes static assets** so it doesn't run on every image/font request, only real navigations.
