#!/usr/bin/env python3
"""
Simple HTTP Server untuk Mitsubishi L200 Manual Offline
Dengan CORS headers dan caching headers yang tepat untuk PWA
"""

import http.server
import socketserver
import os
import sys
import json
from datetime import datetime
from urllib.parse import urlparse, unquote

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class CORSRequestHandler(http.server.SimpleHTTPRequestHandler):
    """HTTP Request Handler dengan CORS dan caching yang tepat"""
    
    def end_headers(self):
        """Tambah headers untuk CORS dan caching"""
        
        # CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        
        # Cache headers berdasarkan tipe file
        if self.path.endswith('.html'):
            self.send_header('Cache-Control', 'public, max-age=3600')
            self.send_header('Content-Type', 'text/html; charset=utf-8')
        elif self.path.endswith('.js'):
            self.send_header('Cache-Control', 'public, max-age=86400')
            self.send_header('Content-Type', 'application/javascript')
        elif self.path.endswith('.css'):
            self.send_header('Cache-Control', 'public, max-age=86400')
            self.send_header('Content-Type', 'text/css')
        elif self.path.endswith('.json'):
            self.send_header('Cache-Control', 'public, max-age=3600')
            self.send_header('Content-Type', 'application/json')
        elif self.path.endswith(('.png', '.jpg', '.jpeg', '.gif', '.svg')):
            self.send_header('Cache-Control', 'public, max-age=2592000')  # 30 hari
        elif self.path.endswith(('.woff', '.woff2', '.ttf', '.eot')):
            self.send_header('Cache-Control', 'public, max-age=31536000')  # 1 tahun
        else:
            self.send_header('Cache-Control', 'public, max-age=3600')
        
        # Security headers
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'SAMEORIGIN')
        self.send_header('X-XSS-Protection', '1; mode=block')
        
        super().end_headers()
    
    def do_GET(self):
        """Handle GET requests"""
        
        # Parse path
        path = unquote(self.path)
        
        # Log request
        print(f'[{datetime.now().strftime("%Y-%m-%d %H:%M:%S")}] GET {path} from {self.client_address[0]}')
        
        # Handle root
        if path == '/' or path == '/index.html':
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Cache-Control', 'no-cache')
            self.end_headers()
            
            file_path = os.path.join(DIRECTORY, 'index.html')
            with open(file_path, 'rb') as f:
                self.wfile.write(f.read())
            return
        
        # Handle service worker
        elif path == '/sw.js':
            self.send_response(200)
            self.send_header('Content-Type', 'application/javascript')
            self.send_header('Cache-Control', 'no-cache')
            self.end_headers()
            
            file_path = os.path.join(DIRECTORY, 'sw.js')
            with open(file_path, 'rb') as f:
                self.wfile.write(f.read())
            return
        
        # Handle manifest
        elif path == '/manifest.json':
            self.send_response(200)
            self.send_header('Content-Type', 'application/manifest+json')
            self.send_header('Cache-Control', 'public, max-age=3600')
            self.end_headers()
            
            file_path = os.path.join(DIRECTORY, 'manifest.json')
            with open(file_path, 'rb') as f:
                self.wfile.write(f.read())
            return
        
        # Default handling
        super().do_GET()
    
    def do_OPTIONS(self):
        """Handle OPTIONS requests"""
        self.send_response(200)
        self.end_headers()
    
    def log_message(self, format, *args):
        """Suppress default logging"""
        pass

def main():
    """Start HTTP server"""
    
    os.chdir(DIRECTORY)
    
    print(f"""
╔════════════════════════════════════════════════════════════╗
║  Mitsubishi L200 Service Manual - Offline Web Server      ║
╚════════════════════════════════════════════════════════════╝
    
📁 Directory: {DIRECTORY}
🌐 Server: http://localhost:{PORT}
📱 PWA Install: Compatible with Chrome, Edge, Firefox
🔒 CORS: Enabled
⚡ Caching: Enabled for PWA offline mode

Shortcuts:
  📖 Manual: http://localhost:{PORT}/index.html
  📱 PWA: Install via browser menu
  🛠️ DevTools: F12 to open browser console
  🔄 Hard Refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)

Features:
  ✓ Offline access with Service Worker
  ✓ Full PWA support
  ✓ CORS headers for development
  ✓ Optimal caching headers
  ✓ Dark mode toggle
  ✓ Full-text search
  ✓ Document navigation

Instructions:
  1. Open browser: http://localhost:{PORT}
  2. Click "📱" button to install as app
  3. Or use "Add to Home Screen" menu
  4. App works offline after installation

Troubleshooting:
  - Clear cache: Ctrl+Shift+Delete
  - Force refresh: Ctrl+Shift+R
  - Check console: F12 → Console tab
  - Check SW: F12 → Application → Service Workers

Press Ctrl+C to stop the server
════════════════════════════════════════════════════════════

    """)
    
    handler = CORSRequestHandler
    
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n✓ Server stopped")
            sys.exit(0)

if __name__ == '__main__':
    main()
