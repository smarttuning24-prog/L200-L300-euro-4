#!/bin/bash
# Build script untuk Mitsubishi L200 Manual Offline

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Building Mitsubishi L200 Service Manual - Offline         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js not found. Some features will be limited.${NC}"
fi

# Create directories
echo "📁 Creating directories..."
mkdir -p js css img dist

# Validate JSON files
echo "✓ Checking JSON files..."
if command -v python3 &> /dev/null; then
    python3 -m json.tool manifest.json > /dev/null 2>&1 || {
        echo -e "${RED}✗ Invalid manifest.json${NC}"
        exit 1
    }
    echo "✓ manifest.json is valid"
fi

# Check critical files
echo ""
echo "🔍 Checking critical files..."
files=("index.html" "sw.js" "js/app.js" "manifest.json" "offline.html")

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        size=$(du -h "$file" | cut -f1)
        echo "✓ $file ($size)"
    else
        echo -e "${RED}✗ Missing: $file${NC}"
        exit 1
    fi
done

# Count HTML files
echo ""
echo "📊 File Statistics:"
html_count=$(find mmc-manuals.ru -name "*.html" -type f 2>/dev/null | wc -l)
css_count=$(find mmc-manuals.ru -name "*.css" -type f 2>/dev/null | wc -l)
js_count=$(find mmc-manuals.ru -name "*.js" -type f 2>/dev/null | wc -l)
img_count=$(find mmc-manuals.ru -name "*.jpg" -o -name "*.png" -o -name "*.gif" 2>/dev/null | wc -l)

echo "  • HTML files: $html_count"
echo "  • CSS files: $css_count"
echo "  • JS files: $js_count"
echo "  • Images: $img_count"

# Calculate total size
echo ""
echo "💾 Calculating size..."
total_size=$(du -sh . | cut -f1)
echo "  • Total size: $total_size"

# Verify Service Worker syntax
echo ""
echo "🔐 Validating Service Worker..."
if command -v node &> /dev/null; then
    node -c sw.js 2>/dev/null && echo "✓ Service Worker syntax OK" || {
        echo -e "${YELLOW}⚠️  Service Worker syntax check failed${NC}"
    }
fi

# Create distribution
echo ""
echo "📦 Creating distribution..."
dist_name="L200-manual-offline-$(date +%Y%m%d)"
mkdir -p dist/$dist_name

# Copy files
echo "  Copying files..."
cp -r index.html manifest.json sw.js offline.html dist/$dist_name/
cp -r js css dist/$dist_name/
if [ -d "mmc-manuals.ru" ]; then
    cp -r mmc-manuals.ru dist/$dist_name/
fi

# Create README for distribution
cat > dist/$dist_name/INSTALL.md << 'EOF'
# Installation Instructions

## Quick Start

### Option 1: Local Server (Recommended)

```bash
# Python 3
python -m http.server 8000

# Or Node.js
npx http-server
```

Then open: http://localhost:8000

### Option 2: Direct File Access

Simply open `index.html` in a modern web browser.

### Option 3: Deploy to Web

Upload all files to your web server. Ensure:
- HTTPS enabled (for PWA)
- Server supports HTML5
- CORS headers configured

## Browser Requirements

- Chrome 40+ (Full support)
- Edge 15+ (Full support)
- Firefox 50+ (Limited PWA)
- Safari 11+ (Limited offline)

## Offline Features

1. **First Visit**: Browser caches ~2MB of app files
2. **Document Cache**: Each document cached on first view
3. **Full Offline**: After first view, all accessed docs work offline
4. **Sync**: New documents auto-sync when online

## PWA Installation

1. **Chrome/Edge**: Menu → More → Install app
2. **Firefox**: Menu → Install app
3. **Safari**: Share → Add to Home Screen

## Troubleshooting

### Not installing?
- Ensure HTTPS or localhost
- Check browser supports PWA
- Clear cache and retry

### Slow loading?
- Hard refresh: Ctrl+Shift+R
- Clear Service Worker cache
- Reload page

### Offline not working?
- Ensure Service Worker is active (F12 → Application)
- Visit page while online first
- Check browser offline support

---

For more help, see README_OFFLINE.md
EOF

chmod +x dist/$dist_name/INSTALL.md

# Create zip
echo "  Creating archive..."
if command -v zip &> /dev/null; then
    cd dist
    zip -r ${dist_name}.zip ${dist_name}/ > /dev/null 2>&1
    cd ..
    zip_size=$(du -h dist/${dist_name}.zip | cut -f1)
    echo "✓ Created: dist/${dist_name}.zip ($zip_size)"
elif command -v tar &> /dev/null; then
    tar -czf dist/${dist_name}.tar.gz -C dist ${dist_name}/
    tar_size=$(du -h dist/${dist_name}.tar.gz | cut -f1)
    echo "✓ Created: dist/${dist_name}.tar.gz ($tar_size)"
fi

# Build complete
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo -e "║ ${GREEN}✓ Build Complete!${NC}                                        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "📍 Output directory: dist/$dist_name"
echo ""
echo "Next steps:"
echo "  1. cd dist/$dist_name"
echo "  2. python -m http.server 8000"
echo "  3. Open http://localhost:8000"
echo ""
