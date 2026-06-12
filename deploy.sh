#!/bin/bash
# B2B Platform — GitHub kurulum scripti
# Kullanım: ./deploy.sh GITHUB_KULLANICI_ADINIZ

GITHUB_USER="${1:-}"

if [ -z "$GITHUB_USER" ]; then
  echo "GitHub kullanici adinizi yazin:"
  echo "  ./deploy.sh ahmetozkanliao-pixel"
  exit 1
fi

REPO_NAME="b2b-platform"
REPO_URL="https://github.com/${GITHUB_USER}/${REPO_NAME}.git"

echo "============================================"
echo " B2B Platform - GitHub Deploy"
echo "============================================"
echo ""
echo "Repo: $REPO_URL"
echo ""

# Remote ayarla
if git remote get-url origin &>/dev/null; then
  git remote set-url origin "$REPO_URL"
else
  git remote add origin "$REPO_URL"
fi
echo "[OK] Git remote ayarlandi"
echo ""

echo "ONEMLI: Once GitHub'da repo olusturun:"
echo "  -> https://github.com/new"
echo "  -> Repository name: b2b-platform"
echo "  -> README EKLEMEYIN"
echo "  -> Create repository"
echo ""

echo "GitHub'a gonderiliyor..."
git branch -M main

if git push -u origin main; then
  echo ""
  echo "============================================"
  echo " BASARILI! Kod GitHub'a yuklendi."
  echo "============================================"
  echo ""
  echo "Simdi Vercel'de canliya alin:"
  echo "  1. https://vercel.com/new"
  echo "  2. GitHub ile giris"
  echo "  3. b2b-platform reposunu secin"
  echo "  4. Environment Variables:"
  echo "       DEMO_MODE = true"
  echo "       NEXT_PUBLIC_SUPABASE_URL = https://placeholder.supabase.co"
  echo "       NEXT_PUBLIC_SUPABASE_ANON_KEY = placeholder-anon-key"
  echo "  5. Deploy"
else
  echo ""
  echo "============================================"
  echo " HATA: Push basarisiz"
  echo "============================================"
  echo ""
  echo "Kontrol edin:"
  echo "  1. GitHub'da repo olusturdunuz mu?"
  echo "     https://github.com/${GITHUB_USER}/${REPO_NAME}"
  echo "  2. GitHub giris bilgileriniz dogru mu?"
  echo "     Sifre yerine Personal Access Token kullanin:"
  echo "     https://github.com/settings/tokens"
  echo ""
  exit 1
fi
