THE AKASH TOOL - DARK ADMIN PANEL (Supabase)

IMPORTANT:
- This is a starter package. It is not deployed yet.
- Never put the Supabase service_role/secret key in dashboard HTML, Blogger, or the C# EXE.
- Dashboard uses Supabase Auth for admin sign-in.
- User management is performed by a Supabase Edge Function using server-side secrets.
- Admin authorization checks JWT app_metadata.role == "admin".

A) Configure Supabase:
1. In Project Settings -> API, copy Project URL and anon/public key.
2. Open dashboard/index.html and replace YOUR_SUPABASE_URL and YOUR_SUPABASE_ANON_KEY.
3. In Supabase Authentication -> Users, create your own admin account with an email and a strong password.
4. In SQL Editor, run the SQL in setup_admin_role.sql after replacing ADMIN_EMAIL with that exact email.
5. Deploy the Edge Function in supabase/functions/admin-users/index.ts:
   supabase functions deploy admin-users
   Set function secrets:
   supabase secrets set SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
   supabase secrets set SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
   (Use the service_role/secret key only as a Supabase Edge Function secret. Never share it.)
6. Host dashboard/index.html on GitHub Pages (or any HTTPS static hosting). GitHub Pages is static hosting only.

B) Admin panel:
- Sign in with the admin Auth account.
- Create users with username/password and optional expiry.
- Enable/disable and delete users.
- No HWID/PC identifier is collected.
- This starter expects your existing public.app_users table and trigger.

C) Important current schema note:
Your existing trigger create_app_user_profile() inserts username from auth user metadata.
The Edge Function creates users with user_metadata.username, so it matches.

D) Limitations:
- User password is set at creation. This first version does not include password reset.
- Expiry is stored in app_users.expires_at. A future C# login API must enforce status and expiry server-side.
- To use username/password in C#, implement a secure server-side username-to-auth-email login endpoint or use a consistent synthetic email mapping; do not store plaintext passwords.
