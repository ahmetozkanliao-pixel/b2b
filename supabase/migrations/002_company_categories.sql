-- Üretici firmaların üretim kategorileri
ALTER TABLE companies ADD COLUMN IF NOT EXISTS category_ids TEXT[] DEFAULT '{}';

-- İlanlarda kategori zorunluluğu (yeni ilanlar için uygulama katmanında kontrol edilir)
COMMENT ON COLUMN companies.category_ids IS 'Üretici firmaların uzmanlık kategorileri (categories.id dizisi)';
