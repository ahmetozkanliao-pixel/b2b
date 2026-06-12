# Canlıya Alma — Adım Adım (Türkçe)

Takıldıysanız bu rehberi sırayla izleyin. Toplam ~10 dakika.

---

## Sorun: `KULLANICI_ADINIZ` yazıyordu

README'deki `KULLANICI_ADINIZ` bir **örnek metindi**, olduğu gibi kopyalanmamalıydı.
Kendi GitHub kullanıcı adınızı yazmalısınız (ör. `ahmetozkanli`).

---

## Yöntem A — Otomatik script (önerilen)

Terminalde:

```bash
cd /Users/ahmetozkanli/Documents/b2b
chmod +x deploy.sh
./deploy.sh ahmetozkanli
```

`ahmetozkanli` yerine **kendi GitHub kullanıcı adınızı** yazın.

Script sizi adım adım yönlendirir.

---

## Yöntem B — Elle (görsel adımlar)

### Adım 1: GitHub hesabı

- [github.com](https://github.com) → Giriş yapın (yoksa Sign up)

### Adım 2: Yeni repo oluşturun

1. [github.com/new](https://github.com/new) açın
2. **Repository name:** `b2b-platform`
3. **Public** seçin
4. ❌ "Add a README" işaretlemeyin
5. **Create repository** tıklayın

### Adım 3: Kodu yükleyin

GitHub size komutlar gösterecek. Terminalde şunları çalıştırın
(`KULLANICI_ADINIZ` → kendi adınız):

```bash
cd /Users/ahmetozkanli/Documents/b2b

git remote set-url origin https://github.com/KULLANICI_ADINIZ/b2b-platform.git

git push -u origin main
```

İlk seferde GitHub kullanıcı adı + şifre (veya Personal Access Token) isteyebilir.

**Şifre çalışmıyorsa:** GitHub artık şifre kabul etmiyor.
→ [github.com/settings/tokens](https://github.com/settings/tokens) → Generate new token (classic)
→ `repo` yetkisi verin → token'ı şifre yerine yapıştırın

### Adım 4: Vercel'de canlıya alın

1. [vercel.com](https://vercel.com) → **Sign Up** → **Continue with GitHub**
2. **Add New…** → **Project**
3. `b2b-platform` reposunu bulun → **Import**
4. **Environment Variables** bölümüne ekleyin:

| Name | Value |
|------|-------|
| `DEMO_MODE` | `true` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://placeholder.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `placeholder-anon-key` |

5. **Deploy** tıklayın
6. 2-3 dakika sonra **Visit** ile sitenizi açın

---

## Sık hatalar

| Hata | Çözüm |
|------|-------|
| `remote: Repository not found` | GitHub'da repo oluşturmadınız veya kullanıcı adı yanlış |
| `Authentication failed` | Personal Access Token kullanın (yukarıda) |
| `KULLANICI_ADINIZ` in URL | `git remote set-url origin https://github.com/GERCEK_ADINIZ/b2b-platform.git` |
| Vercel build fail | Environment Variables'ı kontrol edin |

---

## Yardım

Hangi adımda takıldığınızı yazın (ör. "push yapamıyorum", "Vercel'de hata veriyor").
GitHub kullanıcı adınızı paylaşırsanız komutları sizin için hazırlarım.
