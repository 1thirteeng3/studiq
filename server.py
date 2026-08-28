#!/usr/bin/env python3
"""Eixo — servidor local (somente biblioteca padrão).

Serve a interface em app/ e persiste o estado em data/eixo.json.
Nenhuma dependência externa. Nenhum serviço em nuvem.
"""

from __future__ import annotations

import argparse
import json
import shutil
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parent
APP = ROOT / "app"
DATA_DIR = ROOT / "data"
SEED = DATA_DIR / "seed.json"
DATA = DATA_DIR / "eixo.json"
BAK = DATA_DIR / "eixo.json.bak"

MIME = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".png": "image/png",
    ".woff2": "font/woff2",
    ".md": "text/markdown; charset=utf-8",
}


def ensure_data() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not DATA.exists():
        if not SEED.exists():
            raise SystemExit("data/seed.json ausente — não é possível iniciar.")
        shutil.copy2(SEED, DATA)


def read_state() -> bytes:
    ensure_data()
    return DATA.read_bytes()


def write_state(raw: bytes) -> None:
    ensure_data()
    try:
        parsed = json.loads(raw.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError) as exc:
        raise ValueError("JSON inválido") from exc
    if not isinstance(parsed, dict) or "macroperiods" not in parsed or "nodes" not in parsed:
        raise ValueError("estrutura inválida")
    pretty = json.dumps(parsed, ensure_ascii=False, indent=2)
    pretty += "\n"
    tmp = DATA.with_suffix(".json.tmp")
    tmp.write_text(pretty, encoding="utf-8")
    if DATA.exists():
        shutil.copy2(DATA, BAK)
    tmp.replace(DATA)


def safe_app_path(url_path: str) -> Path | None:
    rel = unquote(url_path).lstrip("/")
    if rel == "" or rel == "index.html":
        return APP / "index.html"
    candidate = (APP / rel).resolve()
    try:
        candidate.relative_to(APP.resolve())
    except ValueError:
        return None
    if candidate.is_file():
        return candidate
    return None


class Handler(BaseHTTPRequestHandler):
    server_version = "Eixo/1.0"

    def log_message(self, fmt: str, *args) -> None:
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))

    def _send(self, code: int, body: bytes, mime: str, extra: dict | None = None) -> None:
        self.send_response(code)
        self.send_header("Content-Type", mime)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        if extra:
            for k, v in extra.items():
                self.send_header(k, v)
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        path = parsed.path
        if path == "/api/state":
            try:
                body = read_state()
            except Exception as exc:
                msg = json.dumps({"erro": str(exc)}, ensure_ascii=False).encode("utf-8")
                self._send(500, msg, "application/json; charset=utf-8")
                return
            self._send(200, body, "application/json; charset=utf-8")
            return
        if path == "/api/health":
            self._send(200, b'{"ok":true}', "application/json; charset=utf-8")
            return
        file_path = safe_app_path(path)
        if file_path is None:
            self._send(404, b"nao encontrado", "text/plain; charset=utf-8")
            return
        mime = MIME.get(file_path.suffix.lower(), "application/octet-stream")
        self._send(200, file_path.read_bytes(), mime)

    def do_PUT(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path != "/api/state":
            self._send(404, b"nao encontrado", "text/plain; charset=utf-8")
            return
        length = int(self.headers.get("Content-Length", "0") or 0)
        if length > 40_000_000:
            self._send(413, b"payload grande demais", "text/plain; charset=utf-8")
            return
        raw = self.rfile.read(length)
        try:
            write_state(raw)
        except ValueError as exc:
            msg = json.dumps({"erro": str(exc)}, ensure_ascii=False).encode("utf-8")
            self._send(400, msg, "application/json; charset=utf-8")
            return
        self._send(204, b"", "text/plain; charset=utf-8")

    def do_OPTIONS(self) -> None:
        self._send(204, b"", "text/plain; charset=utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Eixo — servidor local do sistema de nós causais.")
    parser.add_argument("--host", default="0.0.0.0", help="endereço de vínculo (padrão 0.0.0.0)")
    parser.add_argument("--port", type=int, default=8765, help="porta (padrão 8765)")
    args = parser.parse_args()
    ensure_data()
    httpd = ThreadingHTTPServer((args.host, args.port), Handler)
    print(f"Eixo em http://{args.host}:{args.port}", flush=True)
    print(f"dados: {DATA}", flush=True)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nencerrado", flush=True)


if __name__ == "__main__":
    main()
