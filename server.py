#!/usr/bin/env python3
"""
简单的HTTP服务器，支持禁用缓存
用于小程序开发预览
"""

import http.server
import socketserver
import os
import sys
from urllib.parse import urlparse

class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # 添加禁用缓存的响应头
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        # 添加CORS支持
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()
    
    def do_GET(self):
        # 忽略 @vite/client 请求，避免404错误
        if '/@vite/client' in self.path:
            self.send_response(204)  # No Content
            self.end_headers()
            return
        
        # 处理正常请求
        super().do_GET()
    
    def log_message(self, format, *args):
        # 过滤掉 @vite/client 的404日志
        if args and isinstance(args[0], str) and '/@vite/client' not in args[0]:
            super().log_message(format, *args)

def run_server(port=8081):
    """启动开发服务器"""
    try:
        with socketserver.TCPServer(("", port), NoCacheHTTPRequestHandler) as httpd:
            print(f"🚀 开发服务器已启动: http://localhost:{port}")
            print("📱 支持移动端预览，禁用缓存")
            print("🔄 文件更改后会立即生效")
            print("按 Ctrl+C 停止服务器")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n✅ 服务器已停止")
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ 端口 {port} 已被占用，请先停止其他服务或使用其他端口")
        else:
            print(f"❌ 启动服务器失败: {e}")

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8081
    run_server(port)