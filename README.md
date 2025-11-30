# Mitsubishi L200 Service Manual - GitHub Pages

> 📘 **Akses dokumentasi teknis Mitsubishi L200 dari mana saja, kapan saja - online dan offline!**

## 🌍 Live Demo

### **[👉 Buka di Browser](https://smarttuning24-prog.github.io/L200-L300-euro-4)**

---

## ✨ Fitur Utama

- 📚 **Dokumentasi Lengkap** - Semua versi 2019, 2020, 2022
- 🌐 **Akses Online** - Dari mana saja, browser apa saja
- 📱 **Mobile Friendly** - Responsive design sempurna
- 💾 **Mode Offline** - Service Worker auto-caching
- 🔍 **Full Search** - Cari di semua dokumen
- ⚡ **Lightning Fast** - CDN global GitHub Pages
- 🔒 **Aman** - HTTPS otomatis
- 🆓 **Gratis** - Selamanya, tanpa biaya

---

## 🚀 Quick Start

### Buka Manual Online

1. **Kunjungi landing page:**
   ```
   https://smarttuning24-prog.github.io/L200-L300-euro-4
   ```

2. **Pilih tahun dan tipe manual:**
   - 2019, 2020, 2022
   - Workshop, Technical, Body Repair, Maintenance

3. **Browsing dokumentasi** dengan navigation sidebar

### Install sebagai App

1. **Di landing page**, klik tombol **"📥 Install App"**

2. **Atau manual:**
   - **Chrome/Edge**: Address bar → **Install app**
   - **Firefox**: Menu → **Install**
   - **Safari**: Share → **Add to Home Screen**

3. **Akses dari home screen** seperti native app

4. **Bekerja offline** tanpa koneksi internet!

---

## 📋 Dokumentasi Lengkap

- **[GITHUB-PAGES-GUIDE.md](GITHUB-PAGES-GUIDE.md)** - Setup & deployment detail
- **[INSTALLATION.md](INSTALLATION.md)** - Berbagai cara instalasi
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Kontribusi & development
- **[README_OFFLINE.md](README_OFFLINE.md)** - Fitur offline detail

---

## 🔧 Local Development

### Jalankan Lokal

```bash
# Option 1: Python (built-in)
python -m http.server 8000

# Option 2: Node.js
npm install
npm start

# Option 3: Python dengan server custom
python3 server.py
```

Kemudian buka: http://localhost:8000

### Jalankan Checklist

```bash
bash DEPLOY-CHECKLIST.sh
```

---

## 🌐 Deployment

### Otomatis ke GitHub Pages

```bash
# 1. Push ke GitHub
git add .
git commit -m "Update documentation"
git push origin main

# 2. Tunggu 1-5 menit

# 3. Akses di browser
https://YOUR_USERNAME.github.io/L200-L300-euro-4
```

---

## 📊 Struktur Folder

```
├── index-landing.html          ← Landing page (entry point)
├── sw-simple.js                ← Service Worker
├── manifest.json               ← PWA manifest
├── _config.yml                 ← Jekyll config
├── mmc-manuals.ru/             ← Original documentation
│   └── manuals/l200_v/
│       └── online/
│           └── Service_Manual_v2/
│               ├── 2019/M1-M6/
│               ├── 2020/M1-M6/
│               └── 2022/M1-M6/
├── GITHUB-PAGES-GUIDE.md       ← Deployment guide
├── README.md                   ← This file
└── docs/                       ← Optional for GitHub Pages
```

---

## ✅ Testing

### Test Landing Page
- [ ] Halaman terbuka dengan sempurna
- [ ] Dropdown pilihan tahun/tipe ada
- [ ] Tombol "Buka Manual" berfungsi
- [ ] Tombol "Install App" muncul

### Test Documentation
- [ ] Link manual terbuka
- [ ] Navigation sidebar berfungsi
- [ ] Konten dokumentasi terlihat
- [ ] Mobile view responsive

### Test Offline Mode
1. Buka dokumentasi (online)
2. DevTools → F12 → Network → Offline
3. Refresh → Harus masih bisa diakses

---

## 🔍 Troubleshooting

### Dokumentasi tidak loading?
```bash
# 1. Hard refresh
Ctrl+Shift+R (Windows)
Cmd+Shift+R (Mac)

# 2. Clear cache
Ctrl+Shift+Delete

# 3. Check browser console
F12 → Console (cari error)
```

### Service Worker tidak bekerja?
- Hanya bekerja di HTTPS atau localhost ✓
- GitHub Pages = HTTPS otomatis ✓
- Clear browser cache jika bermasalah

### File tidak ditemukan?
- Pastikan path dimulai dengan `./`
- Check file permissions: `chmod 644 filename`
- Cek deployment status di GitHub → Actions

---

## 🚀 Status

✅ **Production Ready** - Siap di-deploy ke GitHub Pages

**Last Updated**: November 30, 2025

**Version**: 1.0.0

---

**👉 [Buka sekarang →](https://smarttuning24-prog.github.io/L200-L300-euro-4)**