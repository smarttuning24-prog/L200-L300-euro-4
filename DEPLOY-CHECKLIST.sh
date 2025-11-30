#!/bin/bash

# ==========================================
# GitHub Pages Deployment Checklist
# ==========================================

echo "🚀 Mitsubishi L200 - GitHub Pages Deployment Checklist"
echo "======================================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_mark="${GREEN}✓${NC}"
cross_mark="${RED}✗${NC}"

# Counter
total=0
passed=0

# Function to check file
check_file() {
    total=$((total + 1))
    if [ -f "$1" ]; then
        echo -e "${check_mark} File exists: $1"
        passed=$((passed + 1))
    else
        echo -e "${cross_mark} Missing: $1"
    fi
}

# Function to check directory
check_dir() {
    total=$((total + 1))
    if [ -d "$1" ]; then
        echo -e "${check_mark} Directory exists: $1"
        passed=$((passed + 1))
    else
        echo -e "${cross_mark} Missing directory: $1"
    fi
}

# Function to check file size
check_file_size() {
    total=$((total + 1))
    if [ -f "$1" ]; then
        size=$(du -h "$1" | cut -f1)
        echo -e "${check_mark} $1 (${size})"
        passed=$((passed + 1))
    else
        echo -e "${cross_mark} Missing: $1"
    fi
}

echo "📋 1. Core Files"
echo "================"
check_file_size "index-landing.html"
check_file_size "sw-simple.js"
check_file_size "manifest.json"
echo ""

echo "📋 2. Configuration Files"
echo "========================="
check_file "_config.yml"
check_file ".gitignore"
echo ""

echo "📋 3. Documentation"
echo "==================="
check_file "GITHUB-PAGES-GUIDE.md"
check_file "README.md"
check_file "INSTALLATION.md"
check_file "CONTRIBUTING.md"
echo ""

echo "📋 4. Source Documentation"
echo "==========================="
check_dir "mmc-manuals.ru"
check_dir "mmc-manuals.ru/manuals/l200_v"

# Count files in documentation
if [ -d "mmc-manuals.ru" ]; then
    html_count=$(find mmc-manuals.ru -name "*.html" -type f 2>/dev/null | wc -l)
    css_count=$(find mmc-manuals.ru -name "*.css" -type f 2>/dev/null | wc -l)
    js_count=$(find mmc-manuals.ru -name "*.js" -type f 2>/dev/null | wc -l)
    
    echo -e "${check_mark} HTML files: $html_count"
    echo -e "${check_mark} CSS files: $css_count"
    echo -e "${check_mark} JS files: $js_count"
    passed=$((passed + 3))
    total=$((total + 3))
fi
echo ""

echo "📋 5. Git Configuration"
echo "======================="
check_mark_if_git_repo() {
    total=$((total + 1))
    if [ -d ".git" ]; then
        echo -e "${check_mark} Git repository configured"
        passed=$((passed + 1))
        
        # Get origin URL
        origin=$(git config --get remote.origin.url 2>/dev/null)
        if [ -n "$origin" ]; then
            echo -e "${check_mark} Remote origin: $origin"
            passed=$((passed + 1))
            total=$((total + 1))
        fi
    else
        echo -e "${cross_mark} Not a git repository"
    fi
}
check_mark_if_git_repo
echo ""

echo "📋 6. File Permissions"
echo "======================"
# Check if files are readable
for file in "index-landing.html" "sw-simple.js" "manifest.json"; do
    total=$((total + 1))
    if [ -r "$file" ]; then
        echo -e "${check_mark} $file readable"
        passed=$((passed + 1))
    else
        echo -e "${cross_mark} $file not readable"
    fi
done
echo ""

echo "📋 7. Path Validation"
echo "===================="
# Check paths in index-landing.html
total=$((total + 1))
if grep -q "mmc-manuals.ru/manuals/l200_v" index-landing.html; then
    echo -e "${check_mark} Correct paths in index-landing.html"
    passed=$((passed + 1))
else
    echo -e "${cross_mark} Paths might be incorrect"
fi
echo ""

echo "📋 8. Service Worker"
echo "===================="
total=$((total + 1))
if grep -q "CACHE_NAME\|self.addEventListener" sw-simple.js; then
    echo -e "${check_mark} Service Worker properly configured"
    passed=$((passed + 1))
else
    echo -e "${cross_mark} Service Worker might have issues"
fi
echo ""

echo "📋 9. Manifest.json Validation"
echo "=============================="
total=$((total + 1))
if grep -q '"name".*"start_url".*"icons"' manifest.json; then
    echo -e "${check_mark} Manifest has required fields"
    passed=$((passed + 1))
else
    echo -e "${cross_mark} Manifest might be incomplete"
fi
echo ""

echo "========================================================="
echo "📊 Summary"
echo "========================================================="
echo -e "Tests Passed: ${GREEN}${passed}/${total}${NC}"

if [ $passed -eq $total ]; then
    echo -e "${GREEN}✓ All checks passed! Ready for GitHub Pages deployment.${NC}"
    echo ""
    echo "📝 Next steps:"
    echo "1. git add ."
    echo "2. git commit -m 'Prepare for GitHub Pages deployment'"
    echo "3. git push origin main"
    echo "4. Enable GitHub Pages in Settings → Pages"
    echo "5. Wait 1-5 minutes for deployment"
    echo "6. Visit: https://YOUR_USERNAME.github.io/L200-L300-euro-4"
    exit 0
else
    echo -e "${RED}✗ Some checks failed. Please review above.${NC}"
    exit 1
fi
