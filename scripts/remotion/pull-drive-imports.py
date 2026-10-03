#!/usr/bin/env python3
import json
import subprocess
import sys
from pathlib import Path, PurePosixPath

def safe_rel(value: str, label: str) -> str:
    p = PurePosixPath(value)
    if p.is_absolute() or ".." in p.parts or value.strip() in {"", "."}:
        raise SystemExit(f"Invalid {label}: {value!r}")
    return p.as_posix()

def main() -> int:
    if len(sys.argv) != 5:
        raise SystemExit(
            "usage: pull-drive-imports.py <project.config.json> <public_dir> <drive_project_root> <rclone_config>"
        )

    config_path = Path(sys.argv[1])
    public_dir = Path(sys.argv[2]).resolve()
    drive_root = sys.argv[3].rstrip("/")
    rclone_config = sys.argv[4]

    config = json.loads(config_path.read_text(encoding="utf-8"))
    imports = config.get("driveAssetImports", [])
    if not imports:
        print("No configured Drive imports.")
        return 0
    if not isinstance(imports, list):
        raise SystemExit("driveAssetImports must be an array")

    public_dir.mkdir(parents=True, exist_ok=True)

    for index, item in enumerate(imports):
        if not isinstance(item, dict):
            raise SystemExit(f"driveAssetImports[{index}] must be an object")
        remote = safe_rel(str(item.get("remote", "")), "remote path")
        local = safe_rel(str(item.get("local", "")), "local path")
        required = bool(item.get("required", True))

        destination = (public_dir / local).resolve()
        try:
            destination.relative_to(public_dir)
        except ValueError as exc:
            raise SystemExit(f"Local import escapes public directory: {local}") from exc
        destination.parent.mkdir(parents=True, exist_ok=True)

        source = f"{drive_root}/{remote}"
        cmd = ["rclone", "--config", rclone_config, "copyto", source, str(destination)]
        print(f"Drive import: {remote} -> public/{local}")
        result = subprocess.run(cmd, check=False)
        if result.returncode != 0:
            if required:
                raise SystemExit(f"Required Drive import failed: {remote}")
            print(f"Optional Drive import unavailable: {remote}")

    return 0

if __name__ == "__main__":
    raise SystemExit(main())
