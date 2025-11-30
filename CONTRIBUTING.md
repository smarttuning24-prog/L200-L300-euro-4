# Contributing to Mitsubishi L200 Manual Offline

Terima kasih tertarik berkontribusi! Panduan ini akan membantu Anda mulai.

## Code of Conduct

- Hormati semua kontributor
- Laporkan perilaku tidak pantas ke maintainer
- Fokus pada perbaikan kode, bukan personal attacks

## Getting Started

### 1. Fork Repository

```bash
git clone https://github.com/yourusername/L200-manual-offline.git
cd L200-manual-offline
```

### 2. Create Branch

```bash
git checkout -b feature/your-feature-name
# atau untuk bugfix
git checkout -b bugfix/issue-description
```

### 3. Setup Development

```bash
# Install dependencies (optional)
npm install

# Start local server
python -m http.server 8000
```

### 4. Make Changes

```bash
# Edit files
# Test locally at http://localhost:8000

# Commit dengan pesan deskriptif
git add .
git commit -m "feat: Add your feature description"
```

## Commit Message Format

Format: `<type>: <subject>`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Tests
- `ci`: CI/CD changes

Examples:
```
feat: Add dark mode support
fix: Service Worker cache issue
docs: Update README with PWA setup
perf: Optimize search performance
```

## Testing

Sebelum submit PR:

1. **Test di browser lokal**
   ```bash
   python -m http.server 8000
   ```

2. **Test offline mode**
   - DevTools → Application → Service Workers
   - Check "offline"
   - Verifikasi aplikasi masih berfungsi

3. **Test PWA installation**
   - Chrome/Edge: Menu → Install app
   - Firefox: Menu → Install app
   - Safari: Share → Add to Home Screen

4. **Validate files**
   ```bash
   python3 -m json.tool manifest.json
   node -c sw.js
   node -c js/app.js
   ```

## Documentation

Jika menambah fitur baru, update:

1. **README.md** - Deskripsi fitur
2. **README_OFFLINE.md** - Petunjuk penggunaan
3. **Inline comments** - Untuk kode kompleks

## Style Guide

### JavaScript

```javascript
// Good
function loadDocument(filePath) {
  const content = fetch(filePath);
  return content;
}

// Bad
function ld(fp) {
  var c = fetch(fp);
  return c;
}
```

### HTML

```html
<!-- Good -->
<button id="installBtn" class="btn btn-primary" 
        onclick="installPWA()" 
        title="Install app">
  📱 Install
</button>

<!-- Bad -->
<button onclick="installPWA()">Install</button>
```

### CSS

```css
/* Good */
.document-viewer {
  flex: 1;
  overflow-y: auto;
  background: white;
  padding: 20px;
}

/* Bad */
.dv{flex:1;overflow-y:auto;background:white;padding:20px;}
```

## Pull Request Process

1. **Update branch**
   ```bash
   git pull origin main
   ```

2. **Push changes**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create PR**
   - Clear title describing changes
   - Detailed description of what changed and why
   - Link to related issues
   - Screenshots untuk UI changes

4. **PR Template**
   ```markdown
   ## Description
   Jelaskan perubahan yang dilakukan
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation update
   
   ## Testing
   - [ ] Tested locally
   - [ ] Tested offline mode
   - [ ] Tested PWA installation
   
   ## Screenshots
   (jika ada UI changes)
   
   ## Checklist
   - [ ] Code follows style guide
   - [ ] Self-reviewed code
   - [ ] No new warnings
   - [ ] Documentation updated
   ```

## Reporting Bugs

1. **Check existing issues** - Cek apakah sudah dilaporkan
2. **Use bug template**
3. **Include details**:
   - Browser & version
   - OS & version
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots/logs

## Suggesting Features

1. **Check discussions** - Lihat apakah sudah dibahas
2. **Use feature template**
3. **Provide context**:
   - Masalah apa yang dipecahkan?
   - Contoh use case
   - Alternatif solusi

## Issues Guide

### Labels

- `bug` - Issues/PRs dengan bug
- `feature` - Fitur baru
- `documentation` - Dokumentasi
- `good first issue` - Cocok untuk pemula
- `help wanted` - Butuh bantuan
- `in progress` - Sedang dikerjakan
- `wontfix` - Tidak akan diperbaiki

### Triaging

1. Berikan label yang sesuai
2. Isi milestone jika applicable
3. Link ke issues terkait
4. Berikan umpan balik

## Development Workflow

```
┌─────────────────────────────────┐
│ Fork repository                 │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ Create feature branch            │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ Make changes & test locally      │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ Commit dengan pesan deskriptif  │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ Push ke fork Anda               │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ Create Pull Request             │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ Review & discuss                │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ Merge ke main branch            │
└─────────────────────────────────┘
```

## Questions?

- **GitHub Issues** - Untuk bug reports & features
- **GitHub Discussions** - Untuk tanya jawab
- **Email** - contact@example.com

## Recognition

Semua kontributor akan dicantumkan dalam:
- `CONTRIBUTORS.md`
- Release notes
- GitHub contributors page

---

**Terima kasih atas kontribusinya! 🎉**
