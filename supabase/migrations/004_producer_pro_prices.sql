UPDATE membership_packages
SET
  price_monthly = 999,
  price_yearly = 9999
WHERE slug = 'producer-premium' OR (company_type = 'producer' AND plan = 'premium');
