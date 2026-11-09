/*
# Update profile creation trigger for phone-based authentication

## Overview
The original `handle_new_user` trigger function was built for email auth — it derived
the display_name from `full_name` in user metadata, falling back to the email prefix.
Now that the app uses phone-number OTP authentication instead of email/password,
new users will not have `full_name` or an email. The trigger must be updated to
handle phone-based signups gracefully.

## Changes
1. Replaces `handle_new_user()` function body to:
   - Prefer `full_name` from raw_user_meta_data (if a name is ever set)
   - Fall back to `phone` from the auth user record (the phone number used for OTP)
   - Fall back to 'User' if neither is available
2. No schema changes — no new tables or columns.
3. No security changes — the trigger is SECURITY DEFINER, already revoked from
   PUBLIC/anon, and only granted to authenticated. All existing RLS policies
   and grants remain unchanged.

## Notes
1. The trigger itself (`on_auth_user_created`) is NOT recreated — only the
   function body changes. The existing trigger automatically uses the new
   function definition.
2. Safe to re-run: uses `CREATE OR REPLACE FUNCTION`.
*/

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.phone,
      NEW.email,
      'User'
    )
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
