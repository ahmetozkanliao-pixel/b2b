#!/usr/bin/env bash
# Supabase migration'larını otomatik uygular.
# Gerekli: SUPABASE_ACCESS_TOKEN + veritabanı şifresi
#
# Kullanım:
#   export SUPABASE_ACCESS_TOKEN="sbp_..."
#   export SUPABASE_DB_PASSWORD="proje-olustururken-verdiginiz-sifre"
#   ./scripts/setup-supabase-db.sh

set -euo pipefail

PROJECT_REF="eibglpqaikkuqnygonra"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

if [[ -z "${SUPABASE_ACCESS_TOKEN:-}" ]]; then
  echo "Hata: SUPABASE_ACCESS_TOKEN tanımlı değil."
  echo "Supabase → Account → Access Tokens → Generate new token"
  exit 1
fi

if [[ -z "${SUPABASE_DB_PASSWORD:-}" ]]; then
  echo "Hata: SUPABASE_DB_PASSWORD tanımlı değil."
  echo "Supabase → Project Settings → Database → Database password"
  exit 1
fi

cd "$ROOT"

DB_URL="postgresql://postgres:${SUPABASE_DB_PASSWORD}@db.${PROJECT_REF}.supabase.co:5432/postgres"

echo "→ Migration'lar uygulanıyor..."
if ! npx supabase@latest db push --db-url "$DB_URL" --yes; then
  echo ""
  echo "Otomatik bağlantı başarısız olabilir (ağ/IPv6)."
  echo "Manuel: Supabase SQL Editor'da supabase/run-all-migrations.sql dosyasını çalıştırın."
  exit 1
fi

echo ""
echo "✓ Tamamlandı. Table Editor'da tabloları kontrol edin."
echo "  Sonraki adım: .env.local içinde DEMO_MODE=false yapın ve npm run dev:clean"
