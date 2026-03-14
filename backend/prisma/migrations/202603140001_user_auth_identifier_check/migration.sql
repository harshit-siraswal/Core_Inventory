-- Enforce that users always have at least one auth identifier.
-- Supports both current mapped table/column names and legacy quoted names.
DO $$
DECLARE
  target_table regclass;
  password_col text;
  firebase_col text;
  table_name_only text;
BEGIN
  IF to_regclass('public.users') IS NOT NULL THEN
    target_table := 'public.users'::regclass;
  ELSIF to_regclass('public."User"') IS NOT NULL THEN
    target_table := 'public."User"'::regclass;
  ELSE
    RAISE EXCEPTION 'Cannot apply users_auth_identifier_check: neither public.users nor public."User" exists.';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'users_auth_identifier_check'
      AND conrelid = target_table
  ) THEN
    SELECT c.relname INTO table_name_only
    FROM pg_class c
    WHERE c.oid = target_table;

    SELECT
      CASE
        WHEN EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = table_name_only
            AND column_name = 'password_hash'
        ) THEN 'password_hash'
        WHEN EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = table_name_only
            AND column_name = 'passwordHash'
        ) THEN 'passwordHash'
        ELSE NULL
      END,
      CASE
        WHEN EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = table_name_only
            AND column_name = 'firebase_uid'
        ) THEN 'firebase_uid'
        WHEN EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = table_name_only
            AND column_name = 'firebaseUid'
        ) THEN 'firebaseUid'
        ELSE NULL
      END
    INTO password_col, firebase_col;

    IF password_col IS NULL AND firebase_col IS NULL THEN
      RAISE EXCEPTION
        'Cannot apply users_auth_identifier_check: expected at least one of passwordHash/password_hash or firebaseUid/firebase_uid columns on %.',
        target_table::text;
    END IF;

    IF password_col IS NOT NULL AND firebase_col IS NOT NULL THEN
      EXECUTE format(
        'ALTER TABLE %s ADD CONSTRAINT users_auth_identifier_check CHECK (%I IS NOT NULL OR %I IS NOT NULL)',
        target_table::text,
        password_col,
        firebase_col
      );
    ELSIF password_col IS NOT NULL THEN
      EXECUTE format(
        'ALTER TABLE %s ADD CONSTRAINT users_auth_identifier_check CHECK (%I IS NOT NULL)',
        target_table::text,
        password_col
      );
    ELSE
      EXECUTE format(
        'ALTER TABLE %s ADD CONSTRAINT users_auth_identifier_check CHECK (%I IS NOT NULL)',
        target_table::text,
        firebase_col
      );
    END IF;
  END IF;
END
$$;
