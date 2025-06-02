-- AlterTable
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'username') THEN
ALTER TABLE "users" ADD COLUMN "username" TEXT DEFAULT 'system';
END IF;
END $$;

-- add delete_user function
CREATE OR REPLACE FUNCTION delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;
