// Global state
let state = {
    currentManual: 'M1',
    currentYear: '2020',
    currentPage: 0,
    darkMode: false,
    documents: [],
    currentContent: '',
    searchMatches: [],
    currentSearchIndex: 0
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupPWA();
    loadDocuments();
    loadSidebar();
});

// Initialize application
function initializeApp() {
    console.log('Initializing application...');
    updateStatus('Initializing application...');
    
    // Load saved preferences
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') {
        toggleDarkMode(true);
    }
    
    // Check for updates
    checkLocalStorage();
}

// Load documents list
function loadDocuments() {
    updateStatus('Loading documents list...');
    
    // Document structure - sesuaikan dengan struktur folder Anda
    const basePath = './mmc-manuals.ru/manuals/l200_v/online/Service_Manual_v2';
    state.documents = [
        { id: 'M100100010361401ENG', title: 'Introduction', file: 'html/M100100010361401ENG.html' },
        { id: 'M100100031100000ENG', title: 'Safety Precautions', file: 'html/M100100031100000ENG.html' },
        { id: 'M100100070136400ENG', title: 'Tools and Equipment', file: 'html/M100100070136400ENG.html' },
        { id: 'M100100540416300ENG', title: 'Engine Overhaul', file: 'html/M100100540416300ENG.html' },
        { id: 'M114100010319800ENG', title: 'Fuel System', file: 'html/M114100010319800ENG.html' },
        { id: 'M115100030272500ENG', title: 'Cooling System', file: 'html/M115100030272500ENG.html' },
        { id: 'M121100010030800ENG', title: 'Electrical System', file: 'html/M121100010030800ENG.html' },
        { id: 'M122110010064100ENG', title: 'Battery', file: 'html/M122110010064100ENG.html' },
        { id: 'M126100010210500ENG', title: 'Charging System', file: 'html/M126100010210500ENG.html' },
        { id: 'M127100010188000ENG', title: 'Starting System', file: 'html/M127100010188000ENG.html' },
        { id: 'M135100010238300ENG', title: 'Suspension System', file: 'html/M135100010238300ENG.html' },
        { id: 'M142100010157000ENG', title: 'Brake System', file: 'html/M142100010157000ENG.html' },
        { id: 'M151100030167400ENG', title: 'Steering System', file: 'html/M151100030167400ENG.html' },
        { id: 'M152100060117100ENG', title: 'Transmission', file: 'html/M152100060117100ENG.html' },
    ];
    
    updateStatus(`Loaded ${state.documents.length} documents`);
}

// Load sidebar content
function loadSidebar() {
    updateStatus('Loading navigation...');
    
    let sidebarHTML = '';
    
    // Group documents by category
    const categories = {
        'General Information': state.documents.slice(0, 3),
        'Engine System': state.documents.slice(3, 5),
        'Cooling & Fuel': state.documents.slice(5, 6),
        'Electrical System': state.documents.slice(6, 10),
        'Suspension & Steering': state.documents.slice(10, 12),
        'Transmission & Drive': state.documents.slice(12, 14)
    };
    
    for (const [category, docs] of Object.entries(categories)) {
        sidebarHTML += `
            <div class="sidebar-section">
                <h3 onclick="toggleCategory(this)">
                    <span class="toggle">▶</span> ${category}
                </h3>
                <ul class="sidebar-items">
                    ${docs.map((doc, idx) => `
                        <li onclick="openDocument('${doc.id}', '${doc.file}', this)">
                            ${doc.title}
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }
    
    document.getElementById('sidebarContent').innerHTML = sidebarHTML;
    updateStatus('Navigation loaded');
}

// Toggle category expansion
function toggleCategory(element) {
    const list = element.nextElementSibling;
    const toggle = element.querySelector('.toggle');
    
    if (list.classList.contains('active')) {
        list.classList.remove('active');
        toggle.textContent = '▶';
    } else {
        list.classList.add('active');
        toggle.textContent = '▼';
    }
}

// Open document
function openDocument(docId, filePath, element) {
    updateStatus(`Opening ${docId}...`);
    
    // Remove previous active state
    document.querySelectorAll('.sidebar-items li').forEach(li => {
        li.classList.remove('active');
    });
    
    // Add active state to clicked item
    if (element) {
        element.classList.add('active');
    }
    
    // Build full path
    const fullPath = `./mmc-manuals.ru/manuals/l200_v/online/Service_Manual_v2/${state.currentYear}/${state.currentManual}/${filePath}`;
    
    // Load document
    loadDocumentContent(fullPath, docId);
}

// Load document content
function loadDocumentContent(filePath, docId) {
    const viewer = document.getElementById('docViewer');
    
    viewer.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <span>Loading document...</span>
        </div>
    `;
    
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            // Extract body content
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const bodyContent = doc.body ? doc.body.innerHTML : html;
            
            // Store current content for search
            state.currentContent = doc.body ? doc.body.innerText : '';
            
            // Display content
            viewer.innerHTML = `<div class="doc-content active">${bodyContent}</div>`;
            
            // Adjust images path if needed
            adjustImagePaths(viewer, filePath);
            
            // Update status
            updateStatus(`Loaded: ${docId}`);
            
            // Reset page number
            state.currentPage = 0;
            updatePageInfo();
        })
        .catch(error => {
            console.error('Load error:', error);
            viewer.innerHTML = `
                <div class="error-message">
                    Error loading document: ${error.message}<br>
                    <small>Path: ${filePath}</small>
                </div>
            `;
            updateStatus(`Error: ${error.message}`);
        });
}

// Adjust image paths
function adjustImagePaths(container, filePath) {
    const baseDir = filePath.substring(0, filePath.lastIndexOf('/') + 1);
    
    container.querySelectorAll('img').forEach(img => {
        if (img.src && !img.src.startsWith('http')) {
            img.src = baseDir + img.src;
        }
    });
    
    // Also adjust links
    container.querySelectorAll('a').forEach(a => {
        if (a.href && !a.href.startsWith('http') && !a.href.startsWith('#')) {
            const newPath = baseDir + a.href;
            a.onclick = (e) => {
                e.preventDefault();
                openDocument(a.textContent, a.href, null);
            };
        }
    });
}

// Search in document
function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const resultsDiv = document.getElementById('searchResults');
    
    if (!searchTerm || searchTerm.length < 2) {
        resultsDiv.style.display = 'none';
        return;
    }
    
    const content = state.currentContent.toLowerCase();
    const regex = new RegExp(searchTerm, 'gi');
    const matches = content.match(regex);
    
    if (matches && matches.length > 0) {
        resultsDiv.innerHTML = `Found ${matches.length} matches for "${searchTerm}"`;
        resultsDiv.style.display = 'block';
        updateStatus(`Search: Found ${matches.length} matches`);
        
        // Highlight in document
        highlightSearchTerms(searchTerm);
    } else {
        resultsDiv.innerHTML = `No matches found for "${searchTerm}"`;
        resultsDiv.style.display = 'block';
        updateStatus('Search: No matches found');
    }
}

// Highlight search terms
function highlightSearchTerms(term) {
    const docContent = document.querySelector('.doc-content');
    if (!docContent) return;
    
    const regex = new RegExp(`(${term})`, 'gi');
    const walker = document.createTreeWalker(
        docContent,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    const nodesToReplace = [];
    let node;
    
    while (node = walker.nextNode()) {
        if (regex.test(node.nodeValue)) {
            nodesToReplace.push(node);
        }
    }
    
    nodesToReplace.forEach(node => {
        const span = document.createElement('span');
        span.innerHTML = node.nodeValue.replace(
            new RegExp(`(${term})`, 'gi'),
            '<mark style="background: yellow;">$1</mark>'
        );
        node.parentNode.replaceChild(span, node);
    });
}

// Navigation functions
function previousPage() {
    if (state.currentPage > 0) {
        state.currentPage--;
        updatePageInfo();
    }
}

function nextPage() {
    state.currentPage++;
    updatePageInfo();
}

function goToPage() {
    const pageNum = parseInt(document.getElementById('gotoPage').value);
    if (pageNum > 0) {
        state.currentPage = pageNum - 1;
        updatePageInfo();
    }
}

function updatePageInfo() {
    const info = document.getElementById('pageInfo');
    info.textContent = `Page ${state.currentPage + 1}`;
}

// Switch manual type
function switchManual() {
    const newType = document.getElementById('manualType').value;
    state.currentManual = newType;
    updateStatus(`Switched to ${newType}`);
    loadSidebar();
}

// Switch year
function switchYear() {
    const newYear = document.getElementById('modelYear').value;
    state.currentYear = newYear;
    updateStatus(`Switched to ${newYear}`);
    loadSidebar();
}

// Dark mode toggle
function toggleDarkMode(forceState = null) {
    if (forceState !== null) {
        state.darkMode = forceState;
    } else {
        state.darkMode = !state.darkMode;
    }
    
    localStorage.setItem('darkMode', state.darkMode);
    
    if (state.darkMode) {
        document.body.style.background = '#1e1e1e';
        document.body.style.color = '#e0e0e0';
        document.querySelectorAll('header, .sidebar, .content').forEach(el => {
            el.style.background = '#2d2d2d';
            el.style.color = '#e0e0e0';
        });
    } else {
        document.body.style.background = '#f5f5f5';
        document.body.style.color = '#000';
        document.querySelectorAll('header, .sidebar, .content').forEach(el => {
            el.style.background = '';
            el.style.color = '';
        });
    }
    
    updateStatus(`Dark mode: ${state.darkMode ? 'ON' : 'OFF'}`);
}

// Print document
function printDocument() {
    updateStatus('Preparing to print...');
    window.print();
}

// Download document
function downloadDocument() {
    const docContent = document.querySelector('.doc-content');
    if (!docContent) {
        alert('No document loaded');
        return;
    }
    
    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <link rel="stylesheet" href="../css/common.css">
</head>
<body>
    ${docContent.innerHTML}
</body>
</html>`;
    
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `document_${new Date().getTime()}.html`;
    a.click();
    URL.revokeObjectURL(url);
    
    updateStatus('Document downloaded');
}

// PWA functions
function installPWA() {
    if (window.deferredPrompt) {
        window.deferredPrompt.prompt();
        window.deferredPrompt.userChoice.then(choiceResult => {
            if (choiceResult.outcome === 'accepted') {
                updateStatus('App installed successfully!');
            }
        });
    } else {
        alert('This feature is only available on supported browsers');
    }
}

function setupPWA() {
    // Handle install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        window.deferredPrompt = e;
        document.getElementById('installBtn').style.display = 'block';
    });
    
    // Register service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);
                updateStatus('Service Worker ready');
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    }
}

// Check local storage and update
function checkLocalStorage() {
    const storage = navigator.storage ? navigator.storage.estimate() : null;
    if (storage) {
        storage.then(info => {
            const percent = Math.round(info.usage / info.quota * 100);
            console.log(`Storage: ${percent}% used`);
        });
    }
}

// Update status bar
function updateStatus(message) {
    document.getElementById('statusLeft').textContent = `Status: ${message}`;
    console.log(`[STATUS] ${message}`);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key.toLowerCase()) {
            case 'f':
                e.preventDefault();
                document.getElementById('searchInput').focus();
                break;
            case 'p':
                e.preventDefault();
                printDocument();
                break;
            case 's':
                e.preventDefault();
                downloadDocument();
                break;
        }
    }
    
    switch(e.key) {
        case 'ArrowLeft':
            previousPage();
            break;
        case 'ArrowRight':
            nextPage();
            break;
    }
});
