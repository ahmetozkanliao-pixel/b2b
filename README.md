# B2B Üretim ve Tedarik Platformu

Üretici firmalar ile kurumsal firmaları tek platformda buluşturan B2B üretim ve tedarik platformu.

## Teknoloji Stack

| Katman | Teknoloji |
|--------|-----------|
| Frontend | Next.js 15 (App Router) |
| Backend | Supabase |
| Veritabanı | PostgreSQL |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Realtime Chat | Supabase Realtime |
| Ödeme | Stripe / iyzico |
| Hosting | Vercel |

## Özellikler

### Talep Sahibi Firma
- Kayıt / Giriş
- Firma profili yönetimi
- İlan oluşturma, düzenleme, kapatma
- Başvuru onaylama / reddetme
- Mesajlaşma ve teklif paylaşımı
- Bildirimler

### Üretici Firma
- Kayıt / Giriş
- Firma profili ve katalog yönetimi
- Sertifika yükleme
- İlanlara başvuru
- Başvuru takibi
- Mesajlaşma ve dosya paylaşımı

### Admin
- Kullanıcı yönetimi
- Firma onayı
- Haber yönetimi
- Üyelik paketleri
- İlan yönetimi
- Raporlar ve site ayarları

## Kurulum

### 1. Bağımlılıkları yükleyin

```bash
npm install
```

### 2. Supabase projesi oluşturun

[supabase.com](https://supabase.com) üzerinden yeni bir proje oluşturun.

### 3. Veritabanı şemasını uygulayın

Supabase SQL Editor'de `supabase/migrations/001_initial_schema.sql` dosyasını çalıştırın.

### 4. Ortam değişkenlerini ayarlayın

```bash
cp .env.example .env.local
```

`.env.local` dosyasını Supabase proje bilgilerinizle doldurun:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 5. Geliştirme sunucusunu başlatın

```bash
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini açın.

## Proje Yapısı

```
src/
├── app/
│   ├── (public)/          # Ana sayfa, ilanlar, SEO sayfaları
│   ├── (auth)/            # Giriş, kayıt
│   ├── dashboard/         # Kullanıcı paneli
│   └── admin/             # Admin paneli
├── components/
│   ├── ui/                # Temel UI bileşenleri
│   ├── layout/            # Header, Footer
│   ├── home/              # Ana sayfa bölümleri
│   ├── auth/              # Auth formları
│   ├── listings/          # İlan bileşenleri
│   ├── applications/      # Başvuru bileşenleri
│   ├── chat/              # Mesajlaşma
│   └── admin/             # Admin bileşenleri
├── lib/
│   ├── supabase/          # Supabase client'ları
│   └── utils.ts           # Yardımcı fonksiyonlar
└── types/                 # TypeScript tipleri
```

## GitHub + Canlı Yayın (Vercel)

### 1. GitHub reposu oluşturun

```bash
cd b2b
git init
git add .
git commit -m "İlk commit: B2B üretim platformu"
```

[github.com/new](https://github.com/new) adresinde yeni repo oluşturun (ör. `b2b-platform`), ardından:

```bash
git branch -M main
git remote add origin https://github.com/KULLANICI_ADINIZ/b2b-platform.git
git push -u origin main
```

### 2. Vercel'e bağlayın

1. [vercel.com](https://vercel.com) → GitHub ile giriş yapın
2. **Add New Project** → repoyu seçin → **Deploy**
3. **Environment Variables** ekleyin:

| Değişken | Değer (demo için) |
|----------|-------------------|
| `DEMO_MODE` | `true` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://placeholder.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `placeholder-anon-key` |
| `NEXT_PUBLIC_SITE_URL` | Vercel URL'niz (ör. `https://b2b-platform.vercel.app`) |

4. Deploy tamamlanınca siteniz `https://xxx.vercel.app` adresinde yayında olur.

Her `git push` sonrası Vercel otomatik yeniden deploy eder.

### Demo hesaplar (canlıda)

| Rol | E-posta | Şifre |
|-----|---------|-------|
| Talep Sahibi | demo@talep.com | Talep2026! |
| Üretici | demo@uretici.com | Uretici2026! |
| Admin | demo@admin.com | Admin2026! |

## Lisans

Tüm hakları saklıdır.
