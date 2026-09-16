#!/usr/bin/env python3
"""Local preview server that matches GitHub Pages URL handling.

GitHub Pages serves `services.html` at both `/services` and `/services.html`.
The site's internal links use the extensionless form, so `python3 -m http.server`
404s on every nav link and is not a faithful preview. This resolves a request
the same way Pages does: exact file, then `.html`, then `index.html`.

    python3 serve.py [port]        # default 8000
"""
import http.server, os, sys, functools

class PagesHandler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        full = super().translate_path(path)
        if os.path.isdir(full):
            if os.path.isfile(os.path.join(full, "index.html")):
                return os.path.join(full, "index.html")
        elif not os.path.isfile(full) and os.path.isfile(full + ".html"):
            return full + ".html"
        return full

    def end_headers(self):
        # Preview only: never cache, so edits show up on reload.
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, fmt, *a):
        sys.stderr.write("  %s\n" % (fmt % a))

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    root = os.path.dirname(os.path.abspath(__file__))
    handler = functools.partial(PagesHandler, directory=root)
    print(f"Serving {root}\n  http://localhost:{port}/   (Ctrl-C to stop)")
    http.server.ThreadingHTTPServer(("127.0.0.1", port), handler).serve_forever()
