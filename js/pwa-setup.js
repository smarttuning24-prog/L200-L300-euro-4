// PWA Setup and Configuration

// Check if PWA is already installed
function isPWAInstalled() {
    return window.navigator.standalone === true || 
           window.matchMedia('(display-mode: standalone)').matches;
}

// Show install banner if needed
function showInstallBanner() {
    if (isPWAInstalled()) return;
    
    const banner = document.createElement('div');
    banner.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #4CAF50, #45a049);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 300px;
        font-size: 14px;
    `;
    
    banner.innerHTML = `
        <div style="margin-bottom: 10px;">
            📱 Install this app for offline access
        </div>
        <button id="installBannerBtn" style="
            background: white;
            color: #4CAF50;
            border: none;
            padding: 8px 15px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            margin-right: 10px;
        ">Install Now</button>
        <button id="closeBannerBtn" style="
            background: rgba(255,255,255,0.3);
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 4px;
            cursor: pointer;
        ">Later</button>
    `;
    
    document.body.appendChild(banner);
    
    document.getElementById('installBannerBtn').onclick = () => {
        if (window.deferredPrompt) {
            window.deferredPrompt.prompt();
        }
        banner.remove();
    };
    
    document.getElementById('closeBannerBtn').onclick = () => {
        banner.remove();
        localStorage.setItem('pwaInstallBannerDismissed', 'true');
    };
}

// Initialize PWA features
document.addEventListener('DOMContentLoaded', () => {
    // Show banner if not dismissed
    if (!localStorage.getItem('pwaInstallBannerDismissed')) {
        setTimeout(showInstallBanner, 2000);
    }
    
    // Handle app installed event
    window.addEventListener('appinstalled', () => {
        console.log('PWA was installed');
        updateStatus('App installed successfully!');
    });
    
    // Handle app launch
    if (isPWAInstalled()) {
        console.log('Running as PWA');
        updateStatus('Running as installed app');
    }
});
