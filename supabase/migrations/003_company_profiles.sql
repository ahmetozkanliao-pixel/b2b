-- Firma profil alanları
ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS tagline TEXT,
  ADD COLUMN IF NOT EXISTS cover_image_url TEXT,
  ADD COLUMN IF NOT EXISTS founded_year INTEGER,
  ADD COLUMN IF NOT EXISTS employee_count TEXT,
  ADD COLUMN IF NOT EXISTS profile_public BOOLEAN DEFAULT true;

CREATE INDEX IF NOT EXISTS idx_companies_slug ON companies(slug);

-- Önceki işler / portföy
CREATE TABLE IF NOT EXISTS portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  year INTEGER,
  client_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_portfolio_company ON portfolio_items(company_id);

ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view portfolio of approved companies"
  ON portfolio_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = portfolio_items.company_id
        AND companies.status = 'approved'
        AND companies.profile_public = true
    )
  );

CREATE POLICY "Owners can manage their portfolio"
  ON portfolio_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = portfolio_items.company_id
        AND companies.owner_id = auth.uid()
    )
  );
