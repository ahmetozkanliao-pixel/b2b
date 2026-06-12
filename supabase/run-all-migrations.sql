-- B2B Platform: Tüm migration'lar (tek seferde çalıştırın)
-- Supabase SQL Editor → New query → Yapıştır → Run

-- ========== 001_initial_schema.sql ==========
-- B2B Üretim ve Tedarik Platformu - Veritabanı Şeması

-- Enum tipleri
CREATE TYPE user_role AS ENUM ('demand_owner', 'producer', 'admin');
CREATE TYPE company_type AS ENUM ('demand_owner', 'producer');
CREATE TYPE company_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');
CREATE TYPE listing_status AS ENUM ('draft', 'active', 'closed', 'cancelled');
CREATE TYPE application_status AS ENUM ('pending', 'approved', 'rejected', 'withdrawn');
CREATE TYPE notification_type AS ENUM (
  'new_listing', 'new_application', 'application_approved',
  'application_rejected', 'new_message', 'membership_expiring', 'company_approved'
);
CREATE TYPE membership_plan AS ENUM ('free', 'pro', 'basic', 'premium');
CREATE TYPE message_type AS ENUM ('text', 'file', 'image', 'pdf', 'offer');

-- Profiller (auth.users ile bağlantılı)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'demand_owner',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Firmalar
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type company_type NOT NULL,
  status company_status NOT NULL DEFAULT 'pending',
  description TEXT,
  logo_url TEXT,
  website TEXT,
  tax_number TEXT,
  address TEXT,
  city TEXT,
  country TEXT DEFAULT 'Türkiye',
  phone TEXT,
  email TEXT,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Üretici katalogları
CREATE TABLE producer_catalogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Üretici sertifikaları
CREATE TABLE producer_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  issuer TEXT,
  file_url TEXT NOT NULL,
  expiry_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Üyelik paketleri
CREATE TABLE membership_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  company_type company_type NOT NULL,
  plan membership_plan NOT NULL,
  price_monthly DECIMAL(10,2) NOT NULL DEFAULT 0,
  price_yearly DECIMAL(10,2) NOT NULL DEFAULT 0,
  listing_limit INT,
  application_limit INT,
  features JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Firma üyelikleri
CREATE TABLE company_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  package_id UUID NOT NULL REFERENCES membership_packages(id),
  starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Kategoriler
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- İlanlar
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES profiles(id),
  category_id UUID REFERENCES categories(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  technical_details TEXT,
  budget_min DECIMAL(12,2),
  budget_max DECIMAL(12,2),
  delivery_time TEXT,
  city TEXT,
  application_deadline DATE,
  status listing_status NOT NULL DEFAULT 'draft',
  view_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- İlan dosyaları
CREATE TABLE listing_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Başvurular
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  producer_company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL REFERENCES profiles(id),
  cover_letter TEXT,
  proposed_budget DECIMAL(12,2),
  proposed_delivery TEXT,
  status application_status NOT NULL DEFAULT 'pending',
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(listing_id, producer_company_id)
);

-- Mesaj odaları (onaylanan başvurular için)
CREATE TABLE chat_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL UNIQUE REFERENCES applications(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  demand_company_id UUID NOT NULL REFERENCES companies(id),
  producer_company_id UUID NOT NULL REFERENCES companies(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Mesajlar
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  type message_type NOT NULL DEFAULT 'text',
  content TEXT,
  file_url TEXT,
  file_name TEXT,
  offer_amount DECIMAL(12,2),
  offer_details JSONB,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Bildirimler
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Haberler
CREATE TABLE news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  author_id UUID REFERENCES profiles(id),
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Blog yazıları
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  author_id UUID REFERENCES profiles(id),
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Site ayarları
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Mesaj raporları
CREATE TABLE message_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL REFERENCES profiles(id),
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- İndeksler
CREATE INDEX idx_companies_owner ON companies(owner_id);
CREATE INDEX idx_companies_type ON companies(type);
CREATE INDEX idx_companies_status ON companies(status);
CREATE INDEX idx_listings_company ON listings(company_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_category ON listings(category_id);
CREATE INDEX idx_applications_listing ON applications(listing_id);
CREATE INDEX idx_applications_producer ON applications(producer_company_id);
CREATE INDEX idx_messages_room ON messages(room_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;

-- updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER listings_updated_at BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER applications_updated_at BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Yeni kullanıcı kaydında profil oluştur
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'demand_owner')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Başvuru onaylandığında mesaj odası oluştur
CREATE OR REPLACE FUNCTION create_chat_room_on_approval()
RETURNS TRIGGER AS $$
DECLARE
  v_listing listings%ROWTYPE;
BEGIN
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    SELECT * INTO v_listing FROM listings WHERE id = NEW.listing_id;
    INSERT INTO chat_rooms (application_id, listing_id, demand_company_id, producer_company_id)
    VALUES (NEW.id, NEW.listing_id, v_listing.company_id, NEW.producer_company_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_application_approved
  AFTER UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION create_chat_room_on_approval();

-- Varsayılan kategoriler
INSERT INTO categories (name, slug, sort_order) VALUES
  ('Metal İşleme', 'metal-isleme', 1),
  ('Plastik Enjeksiyon', 'plastik-enjeksiyon', 2),
  ('Tekstil Üretimi', 'tekstil-uretimi', 3),
  ('Elektronik Montaj', 'elektronik-montaj', 4),
  ('Gıda Üretimi', 'gida-uretimi', 5),
  ('Mobilya Üretimi', 'mobilya-uretimi', 6),
  ('Ambalaj', 'ambalaj', 7),
  ('Kimya', 'kimya', 8),
  ('Otomotiv Yan Sanayi', 'otomotiv-yan-sanayi', 9),
  ('Diğer', 'diger', 10);

-- Varsayılan üyelik paketleri
INSERT INTO membership_packages (name, slug, company_type, plan, price_monthly, price_yearly, listing_limit, application_limit, features) VALUES
  ('Ücretsiz', 'demand-free', 'demand_owner', 'free', 0, 0, 3, NULL, '["Aylık 3 ilan", "Temel destek"]'),
  ('Pro', 'demand-pro', 'demand_owner', 'pro', 499, 4990, NULL, NULL, '["Sınırsız ilan", "Öncelikli destek", "Gelişmiş raporlar"]'),
  ('Basic', 'producer-basic', 'producer', 'basic', 299, 2990, NULL, 10, '["Aylık 10 başvuru", "Temel profil"]'),
  ('Premium', 'producer-premium', 'producer', 'premium', 799, 7990, NULL, NULL, '["Sınırsız başvuru", "Profil öne çıkarma", "Doğrulanmış üretici rozeti", "İhale bildirimleri"]');

-- RLS Politikaları
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Profiller: kendi profilini okuyabilir/güncelleyebilir
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Firmalar
CREATE POLICY "Anyone can view approved companies" ON companies FOR SELECT USING (status = 'approved' OR owner_id = auth.uid());
CREATE POLICY "Owners can insert companies" ON companies FOR INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Owners can update own companies" ON companies FOR UPDATE USING (owner_id = auth.uid());

-- İlanlar: aktif ilanlar herkese açık
CREATE POLICY "Anyone can view active listings" ON listings FOR SELECT USING (status = 'active' OR created_by = auth.uid());
CREATE POLICY "Company owners can manage listings" ON listings FOR ALL USING (
  EXISTS (SELECT 1 FROM companies WHERE companies.id = listings.company_id AND companies.owner_id = auth.uid())
);

-- Başvurular
CREATE POLICY "Applicants can view own applications" ON applications FOR SELECT USING (
  applicant_id = auth.uid() OR
  EXISTS (SELECT 1 FROM listings l JOIN companies c ON c.id = l.company_id WHERE l.id = applications.listing_id AND c.owner_id = auth.uid())
);
CREATE POLICY "Producers can create applications" ON applications FOR INSERT WITH CHECK (applicant_id = auth.uid());
CREATE POLICY "Demand owners can update applications" ON applications FOR UPDATE USING (
  EXISTS (SELECT 1 FROM listings l JOIN companies c ON c.id = l.company_id WHERE l.id = applications.listing_id AND c.owner_id = auth.uid())
);

-- Mesajlar
CREATE POLICY "Room participants can view messages" ON messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM chat_rooms cr
    JOIN companies dc ON dc.id = cr.demand_company_id
    JOIN companies pc ON pc.id = cr.producer_company_id
    WHERE cr.id = messages.room_id AND (dc.owner_id = auth.uid() OR pc.owner_id = auth.uid())
  )
);
CREATE POLICY "Room participants can send messages" ON messages FOR INSERT WITH CHECK (sender_id = auth.uid());

-- Bildirimler
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());

-- Haberler ve blog: yayınlananlar herkese açık
CREATE POLICY "Anyone can view published news" ON news FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Anyone can view published blog" ON blog_posts FOR SELECT USING (is_published = TRUE);

-- Realtime için mesajlar tablosunu etkinleştir
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- ========== 002_company_categories.sql ==========
-- Üretici firmaların üretim kategorileri
ALTER TABLE companies ADD COLUMN IF NOT EXISTS category_ids TEXT[] DEFAULT '{}';

-- İlanlarda kategori zorunluluğu (yeni ilanlar için uygulama katmanında kontrol edilir)
COMMENT ON COLUMN companies.category_ids IS 'Üretici firmaların uzmanlık kategorileri (categories.id dizisi)';

-- ========== 002_deal_status.sql ==========
ALTER TYPE application_status ADD VALUE IF NOT EXISTS 'agreed';
ALTER TYPE application_status ADD VALUE IF NOT EXISTS 'no_agreement';

-- ========== 003_category_hierarchy.sql ==========
ALTER TABLE categories ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES categories(id);

-- ========== 003_company_profiles.sql ==========
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

-- ========== 004_membership_plan.sql ==========
ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS membership_plan TEXT DEFAULT 'free'
    CHECK (membership_plan IN ('free', 'pro'));

-- Üreticiler varsayılan ücretsiz; talep sahipleri plan kullanmaz
UPDATE companies SET membership_plan = 'free' WHERE type = 'producer' AND membership_plan IS NULL;

