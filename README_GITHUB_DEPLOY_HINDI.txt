GITHUB + SUPABASE DEPLOYMENT - THE AKASH TOOL

1) GitHub par new PRIVATE repository banayein: THE-AKASH-TOOL
2) Is ZIP ke saare contents repository ke root mein upload karein. Hidden .github folder bhi upload hona chahiye.
   Root mein index.html, supabase/ aur .github/ dikhna chahiye.
3) GitHub repository -> Settings -> Secrets and variables -> Actions -> New repository secret.
   Ye 3 secrets add karein:
   SUPABASE_ACCESS_TOKEN = Supabase Dashboard -> Account -> Access Tokens se generated personal access token.
   SUPABASE_PROJECT_ID = gqypsmqgoybxpktrjzcu
   SUPABASE_SERVICE_ROLE_KEY = Supabase Settings -> API Keys -> Secret key (sb_secret_...) OR service_role secret.
   Never put SUPABASE_SERVICE_ROLE_KEY in index.html, Blogger, C# client, public repo, or chat.
4) GitHub -> Actions tab -> Deploy THE AKASH TOOL backend -> Run workflow. Or push a commit to main.
5) Wait until green success check. If failed, open the run and inspect logs; do not paste secrets in chat.
6) Enable GitHub Pages: repository Settings -> Pages -> Build and deployment -> Deploy from a branch (if available) / GitHub Actions workflow. For a simple static page, use main branch and /(root) if UI offers it. Root index.html is ready.
7) Update index.html config values if needed:
   SUPABASE_URL already set to https://gqypsmqgoybxpktrjzcu.supabase.co
   SUPABASE_ANON_KEY already set to your publishable key.
8) Admin sign-in uses the Supabase Auth admin account whose app_metadata.role was set to admin.
9) Do not publish database passwords, access tokens, or secret/service role keys.

Security notes:
- Keep the repository PRIVATE as it contains backend source. Public GitHub Pages can still publish the static dashboard from a private repository only if your GitHub plan supports private repo Pages; otherwise keep the dashboard private or publish only index.html in a separate public repo after checking no secrets exist in it.
- The dashboard contains only Project URL and publishable key, which are intended for browser use with RLS and secured Edge Function.
- Edge Function checks the signed-in user's role on the server before admin actions.
