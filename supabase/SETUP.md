# Supabase Setup — Prerequisite for `add-admin-auth`

> **Read this before running the app.** The `add-admin-auth` change adds full Supabase Auth
> integration for the admin panel. Without these settings configured in the Supabase dashboard,
> flows like email confirmation, password reset, and logout will not work end-to-end.

---

## 1. Project URL and API Keys

In the [Supabase dashboard](https://supabase.com/dashboard), open your project and go to
**Project Settings → API**.

Copy the following values into your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-public-key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

| Variable | Where to find it | Notes |
|----------|-----------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Settings → API → Project URL | Public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Settings → API → `anon` `public` key | Public |
| `NEXT_PUBLIC_SITE_URL` | Set manually | Used in `emailRedirectTo` for email links |
| `SUPABASE_SERVICE_ROLE_KEY` | Settings → API → `service_role` key | **Secret — never expose client-side** |

> **Production**: change `NEXT_PUBLIC_SITE_URL` to your production domain (e.g. `https://app.tiendalabs.com`).

---

## 2. Authentication → URL Configuration

Go to **Authentication → URL Configuration** in the dashboard.

### Site URL

Set to your app's base URL:

- **Development**: `http://localhost:3000`
- **Production**: `https://app.tiendalabs.com` (your actual domain)

### Redirect URLs (whitelist)

Add these entries — **without this, email confirmation links will fail**:

```
http://localhost:3000/auth/confirm
https://app.tiendalabs.com/auth/confirm
```

The `/auth/confirm` route handler exchanges the OTP token from confirmation/recovery emails.

---

## 3. Authentication → Providers → Email

Go to **Authentication → Providers → Email**.

| Setting | Value | Why |
|---------|-------|-----|
| Enable email confirmations | **ON** | Required by REQ-AA-02 — unconfirmed users cannot log in |
| Minimum password length | 6 | Supabase default; the app enforces ≥ 6 on the form |

> **Note**: Supabase's default "Confirm email" template is in English. See section 5 for customization.

---

## 4. Dev Email — Handling the SMTP Limit

Supabase free tier is limited to **~3 emails per hour** on the shared SMTP server. This is inadequate for development loops. Use one of these strategies:

### Option A — Inbucket (recommended for local dev)

If you're running the **local Supabase stack** (`supabase start`), all emails are automatically captured by Inbucket — no real SMTP needed.

1. Start the local stack: `supabase start`
2. Open Inbucket at [http://localhost:54324](http://localhost:54324)
3. Sign up a user and find the confirmation email in Inbucket

This is the zero-config approach for local development.

### Option B — Disable email confirmation (separate dev project)

In your Supabase dev project dashboard:
**Authentication → Providers → Email → Confirm email → OFF**

Users sign up and are immediately active without confirmation.
⚠️ Do this only in a dedicated dev/staging project, never in production.

### Option C — Custom SMTP

Go to **Project Settings → Authentication → SMTP Settings** and configure a provider like
[Resend](https://resend.com), [SendGrid](https://sendgrid.com), or [Postmark](https://postmarkapp.com)
with higher limits. Recommended for staging environments.

---

## 5. Email Templates (optional)

Go to **Authentication → Email Templates**.

Available templates:
- **Confirm signup** — sent after `signUp()` when email confirmation is ON
- **Reset password** — sent by `resetPasswordForEmail()`
- **Magic link** — not used in this project
- **Change email address** — not used in this project

The default templates are in English. If you want Spanish (Rioplatense) copy, you can customize
the template body directly in the dashboard. The confirmation link variable is `{{ .ConfirmationURL }}`.

---

## 6. Env Vars Summary

Full `.env.local` for this change:

```env
# Supabase — required for auth
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-public-key>

# App base URL — used in emailRedirectTo (signup + password reset)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Service role — needed for privileged API routes (e.g. /api/orders/[token])
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>

# MercadoPago (unchanged)
MERCADOPAGO_ACCESS_TOKEN=your_mercadopago_access_token
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=your_mercadopago_public_key
```

---

## 7. Post-Configuration Checklist

Run through these manually after completing the steps above:

- [ ] Sign up a test user via `/admin/signup`
- [ ] Confirmation email arrives in Inbucket (or real inbox)
- [ ] Clicking the confirmation link activates the account and logs the user in
- [ ] Can log in at `/admin/login` after confirmation
- [ ] Visiting `/admin/products` without a session redirects to `/admin/login`
- [ ] Clicking "Salir" in the sidebar logs out and redirects to `/admin/login`
- [ ] "Olvidé mi contraseña" flow sends a reset email
- [ ] Clicking the reset link in the email lands at `/admin/reset-password`
- [ ] Submitting a new password redirects to `/admin`
