#!/usr/bin/env python3
import hashlib
import json
import sys
import urllib.parse
import urllib.request
from pathlib import Path, PurePosixPath

def safe_rel(value: str, label: str) -> str:
    p = PurePosixPath(value)
    if p.is_absolute() or ".." in p.parts or value.strip() in {"", "."}:
        raise SystemExit(f"Invalid {label}: {value!r}")
    return p.as_posix()

def main() -> int:
    if len(sys.argv) != 3:
        raise SystemExit("usage: pull-remote-assets.py <project.config.json> <public_dir>")

    config_path = Path(sys.argv[1])
    public_dir = Path(sys.argv[2]).resolve()
    config = json.loads(config_path.read_text(encoding="utf-8"))
    imports = config.get("remoteAssetImports", [])

    if not imports:
        print("No configured remote asset imports.")
        return 0
    if not isinstance(imports, list):
        raise SystemExit("remoteAssetImports must be an array")

    public_dir.mkdir(parents=True, exist_ok=True)

    for index, item in enumerate(imports):
        if not isinstance(item, dict):
            raise SystemExit(f"remoteAssetImports[{index}] must be an object")

        url = str(item.get("url", "")).strip()
        local = safe_rel(str(item.get("local", "")), "local path")
        expected_sha256 = str(item.get("sha256", "")).strip().lower()
        required = bool(item.get("required", True))

        parsed = urllib.parse.urlparse(url)
        if parsed.scheme != "https" or not parsed.netloc:
            raise SystemExit(f"Remote asset must use an absolute HTTPS URL: {url!r}")

        destination = (public_dir / local).resolve()
        try:
            destination.relative_to(public_dir)
        except ValueError as exc:
            raise SystemExit(f"Remote asset escapes public directory: {local}") from exc
        destination.parent.mkdir(parents=True, exist_ok=True)

        print(f"Remote asset: {url} -> public/{local}")
        request = urllib.request.Request(
            url,
            headers={"User-Agent": "ChatGPT-Work-Remotion/1.0"}
        )
        try:
            with urllib.request.urlopen(request, timeout=60) as response:
                data = response.read()
        except Exception as exc:
            if required:
                raise SystemExit(f"Required remote asset failed: {url}: {exc}") from exc
            print(f"Optional remote asset unavailable: {url}: {exc}")
            continue

        if not data:
            raise SystemExit(f"Remote asset was empty: {url}")

        actual_sha256 = hashlib.sha256(data).hexdigest()
        if expected_sha256 and actual_sha256 != expected_sha256:
            raise SystemExit(
                f"Remote asset checksum mismatch for {url}: "
                f"expected={expected_sha256} actual={actual_sha256}"
            )

        destination.write_bytes(data)
        print(f"Downloaded {len(data)} bytes sha256={actual_sha256}")

    return 0

if __name__ == "__main__":
    raise SystemExit(main())
