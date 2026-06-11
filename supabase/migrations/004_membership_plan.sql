ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS membership_plan TEXT DEFAULT 'free'
    CHECK (membership_plan IN ('free', 'pro'));

-- Üreticiler varsayılan ücretsiz; talep sahipleri plan kullanmaz
UPDATE companies SET membership_plan = 'free' WHERE type = 'producer' AND membership_plan IS NULL;
