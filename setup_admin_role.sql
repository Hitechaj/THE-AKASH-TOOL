-- Replace the email below with the admin email you created in Supabase Auth.
-- Run once. This marks that Auth account as an administrator.
update auth.users
set raw_app_meta_data =
    coalesce(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', 'admin')
where lower(email) = lower('ADMIN_EMAIL');

-- Verify: the query should return role=admin for your admin user.
select email, raw_app_meta_data->>'role' as role
from auth.users
where lower(email) = lower('ADMIN_EMAIL');
