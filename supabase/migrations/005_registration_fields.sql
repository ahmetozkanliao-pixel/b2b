ALTER TABLE profiles ADD COLUMN IF NOT EXISTS national_id TEXT;

COMMENT ON COLUMN profiles.national_id IS 'TC kimlik numarası';
