# 📦 Installation & Setup Guide

Panduan lengkap untuk menginstall dan menjalankan Mitsubishi L200 Manual Offline.

## 🚀 Quick Start (5 Menit)

### Opsi 1: Python (Recommended)

```bash
# Python 3 (built-in di kebanyakan sistem)
cd /path/to/L200-manual-offline
python -m http.server 8000

# Buka browser: http://localhost:8000
```

### Opsi 2: Node.js

```bash
npm install
npm start

# Buka browser: http://localhost:8000
```

### Opsi 3: Langsung Buka File

1. Ekstrak file
2. Double-click `index.html`
3. Aplikasi membuka di browser default

## 💻 Persyaratan Sistem

### Minimum
- OS: Windows 7+, macOS 10.12+, Linux
- Browser: Chrome 40+, Firefox 50+, Edge 15+, Safari 11+
- Storage: 150MB (untuk dokumentasi lengkap)

### Recommended
- OS: Windows 10+, macOS 11+, Linux (any)
- Browser: Chrome 90+, Firefox 88+, Edge 90+
- Storage: 500MB (untuk cache dan storage)
- RAM: 2GB

## 🔧 Setup Detail

### Linux/macOS

```bash
# Clone repository
git clone https://github.com/yourusername/L200-manual-offline.git
cd L200-manual-offline

# Jalankan server
python3 -m http.server 8000

# Atau menggunakan Node.js
npx http-server

# Buka di browser
open http://localhost:8000
```

### Windows (PowerShell)

```powershell
# Clone repository
git clone https://github.com/yourusername/L200-manual-offline.git
cd L200-manual-offline

# Jalankan dengan Python
python -m http.server 8000

# Atau dengan Node.js
npx http-server

# Browser akan membuka otomatis atau buka: http://localhost:8000
```

### Docker (Optimal untuk Production)

```bash
# Build image
docker build -t l200-manual .

# Run container
docker run -p 8000:8000 l200-manual

# Buka: http://localhost:8000
```

**Dockerfile:**
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY . .
EXPOSE 8000
CMD ["python", "-m", "http.server", "8000"]
```

## 📱 PWA Installation

### Chrome/Edge

1. Buka aplikasi di http://localhost:8000
2. Klik alamat bar → **"Install app"** atau tombol 📱
3. Klik **"Install"**
4. Aplikasi siap di desktop/home screen

### Firefox

1. Buka aplikasi di http://localhost:8000
2. Klik menu hamburger → **"Install app"**
3. Klik **"Install"**
4. Aplikasi siap di desktop

### Safari (iOS/macOS)

1. Buka aplikasi di Safari
2. Klik **"Share"** icon
3. Pilih **"Add to Home Screen"**
4. Aplikasi siap di home screen

## 🌐 Deploy ke Cloud

### GitHub Pages (Free)

```bash
# Persiapan
git init
git add .
git commit -m "Initial commit"

# Push ke GitHub
git remote add origin https://github.com/yourusername/L200-manual-offline.git
git branch -M main
git push -u origin main

# GitHub Pages otomatis aktif dari branch 'main'
# Akses: https://yourusername.github.io/L200-manual-offline
```

**Catatan**: Pastikan di GitHub:
1. Settings → Pages
2. Source: Deploy from a branch
3. Branch: main

### Netlify (Free with custom domain)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod

# Follow prompts dan setup selesai!
```

### Vercel (Free with GitHub)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Follow prompts
```

### AWS S3 + CloudFront

```bash
# Install AWS CLI
pip install awscli

# Configure
aws configure

# Upload ke S3
aws s3 sync . s3://your-bucket-name/

# Setup CloudFront distribution di AWS console
```

### DigitalOcean App Platform (Free tier available)

1. Create → App
2. Connect GitHub repo
3. Build: `npm run build`
4. Deploy!

## 🔒 HTTPS Setup

### Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt-get install certbot

# Generate certificate
sudo certbot certonly --standalone -d yourdomain.com

# Configure web server to use certificate
```

### CloudFlare (Free)

1. Add domain to CloudFlare
2. Enable Flexible SSL
3. Traffic → Enable Full SSL

## 🗜️ Optimization

### Compress Files

```bash
# Create distributable
bash build.sh

# Creates dist/L200-manual-[date]/
```

### Minify

```bash
# CSS
npm install -g cssnano
cssnano css/common.css > css/common.min.css

# JS
npm install -g terser
terser js/app.js -o js/app.min.js
```

## ✅ Verification

### Checklist Post-Installation

- [ ] Aplikasi loading di http://localhost:8000
- [ ] Sidebar navigasi menampilkan kategori
- [ ] Dokumen bisa dibuka
- [ ] Search berfungsi
- [ ] Dark mode berfungsi
- [ ] Service Worker terdaftar (F12 → Application)
- [ ] PWA bisa diinstall (address bar → install)
- [ ] Offline mode berfungsi

### Browser Console Checks

Buka DevTools (F12) dan jalankan di console:

```javascript
// Check Service Worker
navigator.serviceWorker.getRegistrations().then(r => 
  console.log('Service Workers:', r)
);

// Check manifest
fetch('/manifest.json').then(r => r.json()).then(m => 
  console.log('Manifest:', m)
);

// Check cache
caches.keys().then(names => 
  console.log('Caches:', names)
);
```

## 🐛 Troubleshooting

### Masalah: Port 8000 sudah terpakai

**Solusi:**
```bash
# Gunakan port lain
python -m http.server 8080
# atau
npx http-server -p 9000
```

### Masalah: "Cannot GET /"

**Solusi:**
- Pastikan di folder yang benar
- Cek `index.html` ada
- Restart server

### Masalah: Service Worker tidak bekerja

**Solusi:**
- Harus HTTPS atau localhost
- Check F12 → Application → Service Workers
- Clear cache: Ctrl+Shift+Delete

### Masalah: PWA tidak bisa diinstall

**Solusi:**
- Gunakan browser modern (Chrome 40+)
- Akses via HTTPS atau localhost
- Manifest harus valid
- Service Worker aktif

### Masalah: Slow loading

**Solusi:**
- Hard refresh: Ctrl+Shift+R
- Clear cache: Ctrl+Shift+Delete
- Restart server
- Check internet connection

## 📊 Performance Tips

1. **Enable Compression**
   ```nginx
   gzip on;
   gzip_types text/plain text/css application/javascript;
   ```

2. **Set Cache Headers**
   ```nginx
   expires 1y;
   add_header Cache-Control "public, immutable";
   ```

3. **Use CDN**
   - Gunakan CloudFlare (free)
   - Atau Bunny CDN

4. **Monitor Storage**
   - Cache: ~2MB (app)
   - Docs: ~500MB
   - Total: ~150MB setelah compression

## 📚 Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [HTTP Server Setup](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/set_up_a_local_testing_server)

## 🆘 Get Help

- **GitHub Issues**: Report bugs
- **GitHub Discussions**: Ask questions
- **Stack Overflow**: Tag #pwa #offline
- **Email**: support@example.com

---

**Selamat menggunakan Mitsubishi L200 Manual Offline! 🎉**
