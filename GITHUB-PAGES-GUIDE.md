# 🚀 GitHub Pages Deployment Guide

## Strategi: Hosting Standar + Offline Mode

Aplikasi ini dioptimalkan untuk di-hosting di GitHub Pages dengan strategi sederhana namun efektif:

### ✅ Keunggulan Strategi Ini

- **Gratis selamanya** - GitHub Pages tidak ada biaya
- **Auto deploy** - Push ke GitHub, otomatis live
- **HTTPS otomatis** - Keamanan built-in
- **CDN global** - Loading cepat dari mana saja
- **Offline support** - Service Worker untuk offline browsing
- **Sederhana** - Tidak perlu konfigurasi rumit

---

## 📋 Prerequisites

Sebelum mulai, pastikan Anda memiliki:

1. **GitHub Account** (gratis di github.com)
2. **Git installed** di komputer
3. **Repository** sudah dibuat di GitHub
4. **Local clone** dari repository

---

## 🔧 Langkah 1: Persiapan Repository

### 1.1 Tentukan Branch untuk GitHub Pages

GitHub Pages dapat menggunakan:
- Branch `main` root folder
- Branch `main` folder `/docs`
- Branch `gh-pages` khusus

**Rekomendasi**: Gunakan branch `main` root folder (paling sederhana)

### 1.2 Update README.md

```bash
cd /workspaces/L200-L300-euro-4
cat > README.md << 'EOF'
# Mitsubishi L200 Service Manual

Akses dokumentasi teknis Mitsubishi L200 lengkap, online dan offline.

## 🌐 Live Demo

**👉 Buka di:** https://YOUR_USERNAME.github.io/L200-L300-euro-4

Ganti `YOUR_USERNAME` dengan username GitHub Anda.

## ✨ Fitur

- 📚 Dokumentasi lengkap tahun 2019-2022
- 🌐 Akses online dari mana saja
- 📱 Mobile-friendly interface
- 🔍 Full-text search
- 💾 Offline mode dengan Service Worker
- ⚡ Lightning fast dengan caching

## 🚀 Quick Start

### Online
1. Kunjungi: https://YOUR_USERNAME.github.io/L200-L300-euro-4
2. Pilih tahun dan jenis manual
3. Mulai browsing dokumentasi

### Install sebagai App
1. Klik tombol "📥 Install App"
2. Aplikasi tersimpan di home screen/desktop
3. Akses offline kapan saja

### Lokal (Development)
```bash
python -m http.server 8000
# Buka http://localhost:8000
```

## 📁 Struktur Folder

```
├── index-landing.html    ← Landing page (entry point)
├── sw-simple.js          ← Service Worker untuk offline
├── manifest.json         ← PWA configuration
├── mmc-manuals.ru/       ← Original documentation
└── docs/                 ← Opsional untuk GitHub Pages
```

## 🔄 Deployment

Sudah otomatis! Setiap push ke GitHub akan di-deploy otomatis.

```bash
git add .
git commit -m "Update documentation"
git push origin main
```

Tunggu beberapa menit, kemudian cek di: https://YOUR_USERNAME.github.io/L200-L300-euro-4

## 🛠️ Troubleshooting

### Repository tidak muncul di GitHub Pages

1. Pastikan repository adalah **public**
2. Di GitHub → Settings → Pages
3. Pilih Source: `Deploy from a branch`
4. Branch: `main`
5. Folder: `/ (root)`
6. Klik Save

### Dokumentasi tidak loading

1. Hard refresh: `Ctrl+Shift+R`
2. Cek browser console: `F12 → Console`
3. Pastikan path relatif benar (mulai dengan `./`)

### Service Worker tidak bekerja

- Hanya bekerja di HTTPS atau localhost
- GitHub Pages otomatis HTTPS ✓
- Clear cache browser jika bermasalah

## 📚 Additional Resources

- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Service Workers MDN](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [PWA Manifest](https://web.dev/web-app-manifest/)

---

**Last Updated:** November 2025
EOF
```

### 1.3 Push ke GitHub

```bash
git add .
git commit -m "Setup GitHub Pages deployment"
git push origin main
```

---

## ⚙️ Langkah 2: Aktifkan GitHub Pages

### Via GitHub Web Interface

1. **Buka repository** di GitHub.com
2. **Klik Settings** (atau langsung ke: `github.com/YOUR_USERNAME/L200-L300-euro-4/settings`)
3. **Sidebar kiri** → Pages
4. **Source**:
   - Branch: `main`
   - Folder: `/ (root)`
5. **Klik Save**

### Screenshot

```
Repository Settings → Pages

Source
├─ Deploy from a branch
├─ Branch: main
├─ Folder: / (root)
└─ [Save]

Custom domain (opsional)
```

---

## ✅ Langkah 3: Verifikasi Deployment

### Cek Status Deployment

1. Repository → **Deployments** atau **Actions**
2. Tunggu sampai status **"Active"** ✓

### Buka Website

Akses URL: `https://YOUR_USERNAME.github.io/L200-L300-euro-4`

### Debugging jika Error

```bash
# 1. Cek apakah file ada di root
ls -la /path/to/repo/
# Harus ada: index-landing.html, sw-simple.js, manifest.json, mmc-manuals.ru/

# 2. Cek file permissions
chmod 644 index-landing.html
chmod 644 sw-simple.js
chmod 644 manifest.json

# 3. Git push ulang jika perlu
git add .
git commit -m "Fix file permissions"
git push origin main
```

---

## 🔍 Langkah 4: Testing

### Test Landing Page

- [ ] Halaman landing terbuka
- [ ] Dropdown pilihan tahun dan tipe
- [ ] Tombol "📚 Buka Manual" bekerja
- [ ] Tombol "📥 Install App" muncul

### Test Documentation Access

- [ ] Klik link manual (2019, 2020, 2022)
- [ ] Dokumentasi terbuka dengan benar
- [ ] Navigation sidebar berfungsi
- [ ] Search bekerja (jika ada)

### Test Offline Mode

1. **Buka documentation** sambil online
2. **Buka DevTools**: F12 → Application → Service Workers
3. **Buka tab baru** ke landing page
4. **Disconnect internet** (DevTools → Network → Offline)
5. **Refresh halaman** - harus masih bisa buka

---

## 🎯 Langkah 5: Customization (Opsional)

### Ubah Landing Page

Edit file: `index-landing.html`

```html
<!-- Ubah tema warna -->
--primary: #e74c3c;    ← Warna merah Mitsubishi
--secondary: #2c3e50;  ← Warna sekunder

<!-- Ubah judul -->
<h1>Mitsubishi L200 Service Manual</h1>

<!-- Ubah tagline -->
<p class="tagline">✓ Online | ✓ Offline | ✓ Mobile Friendly</p>
```

Kemudian push:

```bash
git add index-landing.html
git commit -m "Customize landing page"
git push origin main
```

### Update Navigation Links

Jika dokumentasi sudah di-mirror atau dipindah lokasi, update link di `index-landing.html`:

```html
<a href="./path/to/documentation/">2020 Manual</a>
```

---

## 📊 Monitoring & Analytics

### Enable GitHub Insights

1. Repository → **Insights** → **Traffic**
2. Lihat jumlah visitors dan pageviews

### Add Google Analytics (Opsional)

Tambah ke `index-landing.html` sebelum `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

Ganti `GA_MEASUREMENT_ID` dengan ID Analytics Anda.

---

## 🔐 Security Headers

GitHub Pages otomatis menambahkan security headers. Jika perlu custom headers untuk dokumentasi lokal, gunakan `.htaccess` atau server config.

---

## 🚀 Auto-Deployment dengan GitHub Actions

### Setup Workflow (Opsional)

File sudah ada di: `.github/workflows/deploy.yml`

Ini akan otomatis run tests dan deploy saat ada push ke main.

---

## 📈 Best Practices

✅ **DO:**
- Commit messages yang deskriptif
- Test lokal sebelum push
- Gunakan branches untuk fitur baru
- Regular backups

❌ **DON'T:**
- Push sensitive data
- Commit node_modules atau build files
- Direct push ke production (gunakan branches)
- Edit files langsung di GitHub web

---

## 🆘 FAQ

**Q: Berapa lama sampai website live?**
A: Biasanya 1-5 menit setelah push

**Q: Bisakah ganti URL?**
A: Ya, di GitHub Pages settings → Custom domain

**Q: Dokumentasi tidak update setelah push?**
A: Hard refresh (Ctrl+Shift+R) atau clear cache

**Q: Bagaimana jika ada error?**
A: Cek GitHub → Actions untuk error logs

---

## 🎉 Selesai!

Dokumentasi Mitsubishi L200 Anda sudah live di GitHub Pages!

**Live URL:** https://YOUR_USERNAME.github.io/L200-L300-euro-4

Setiap kali Anda push update ke GitHub, website otomatis ter-update.

---

**Next Steps:**
1. ✅ Buka landing page di browser
2. ✅ Test offline mode dengan DevTools
3. ✅ Share link ke tim/community
4. ✅ Monitor analytics (optional)

**Support:**
- GitHub Docs: https://docs.github.com/en/pages
- Issues: github.com/YOUR_USERNAME/L200-L300-euro-4/issues

---

**Last Updated:** November 30, 2025
Version: 1.0.0
Status: Production Ready ✓
