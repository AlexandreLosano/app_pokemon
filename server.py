#!/usr/bin/env python3
import http.server
import socketserver
import os

PORT = 1989
DIR = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIR, **kwargs)

    def log_message(self, format, *args):
        print(f"  {self.address_string()} → {args[0]}")

print(f"Pokemon Explorer → http://localhost:{PORT}")
print("Pressione Ctrl+C para encerrar.\n")

try:
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        httpd.serve_forever()
except KeyboardInterrupt:
    print("\nServidor encerrado.")
