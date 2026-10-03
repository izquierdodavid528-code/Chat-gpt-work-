#!/usr/bin/env python3
import argparse
import json
import math
import pathlib
import re
import subprocess
import sys

def run(cmd):
    proc = subprocess.run(cmd, text=True, capture_output=True)
    return proc.returncode, proc.stdout, proc.stderr

def as_float(value):
    try:
        return float(value)
    except (TypeError, ValueError):
        return None

def parse_loudness(stderr):
    integrated = None
    true_peak = None
    lra = None
    integrated_matches = re.findall(r"\bI:\s*(-?(?:\d+(?:\.\d+)?|inf))\s*LUFS", stderr)
    peak_matches = re.findall(r"\bPeak:\s*(-?(?:\d+(?:\.\d+)?|inf))\s*dBFS", stderr)
    lra_matches = re.findall(r"\bLRA:\s*(-?(?:\d+(?:\.\d+)?|inf))\s*LU", stderr)
    if integrated_matches:
        integrated = as_float(integrated_matches[-1])
    if peak_matches:
        true_peak = as_float(peak_matches[-1])
    if lra_matches:
        lra = as_float(lra_matches[-1])
    return integrated, true_peak, lra

def parse_volume(stderr):
    matches = re.findall(r"max_volume:\s*(-?(?:\d+(?:\.\d+)?|inf))\s*dB", stderr)
    return as_float(matches[-1]) if matches else None

def parse_silence(stderr):
    starts = [float(x) for x in re.findall(r"silence_start:\s*([0-9.]+)", stderr)]
    ends = [(float(a), float(b)) for a, b in re.findall(
        r"silence_end:\s*([0-9.]+)\s*\|\s*silence_duration:\s*([0-9.]+)", stderr
    )]
    regions = []
    for idx, start in enumerate(starts):
        if idx < len(ends):
            end, duration = ends[idx]
            regions.append({"start": start, "end": end, "duration": duration})
    return regions

parser = argparse.ArgumentParser()
parser.add_argument("config")
parser.add_argument("media")
parser.add_argument("probe")
parser.add_argument("report")
parser.add_argument("--validation", action="store_true")
args = parser.parse_args()

config_path = pathlib.Path(args.config)
media_path = pathlib.Path(args.media)
probe_path = pathlib.Path(args.probe)
report_path = pathlib.Path(args.report)

cfg = json.loads(config_path.read_text(encoding="utf-8"))
probe = json.loads(probe_path.read_text(encoding="utf-8"))
render = cfg.get("render", {})
audio_cfg = render.get("audioQa", {})
enabled = bool(audio_cfg.get("enabled", False))
require_audio = bool(render.get("requireAudio", False) or audio_cfg.get("requireAudio", False))

streams = probe.get("streams", [])
audio_streams = [s for s in streams if s.get("codec_type") == "audio"]
video_streams = [s for s in streams if s.get("codec_type") == "video"]
fmt = probe.get("format", {})
errors = []
warnings = []
metrics = {}
checks = {}

report = {
    "schemaVersion": 1,
    "result": "PASS",
    "enabled": enabled,
    "validationMode": bool(args.validation),
    "audioPresent": bool(audio_streams),
    "errors": errors,
    "warnings": warnings,
    "checks": checks,
    "metrics": metrics,
    "requirements": audio_cfg,
}

if not enabled:
    report["result"] = "NOT_ENABLED"
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, indent=2))
    raise SystemExit(0)

if not audio_streams:
    checks["audioPresence"] = "FAIL" if require_audio else "SKIP"
    if require_audio:
        errors.append("Audio stream is required but missing.")
    else:
        warnings.append("No audio stream present; audio QA metrics skipped.")
else:
    audio = audio_streams[0]
    checks["audioPresence"] = "PASS"

    codec = str(audio.get("codec_name") or "")
    sample_rate = int(audio.get("sample_rate") or 0)
    channels = int(audio.get("channels") or 0)
    channel_layout = str(audio.get("channel_layout") or "")
    audio_duration = as_float(audio.get("duration"))
    format_duration = as_float(fmt.get("duration"))

    metrics.update({
        "codec": codec,
        "sampleRateHz": sample_rate,
        "channels": channels,
        "channelLayout": channel_layout,
        "audioDurationSeconds": audio_duration,
        "containerDurationSeconds": format_duration,
    })

    expected_codec = str(audio_cfg.get("expectedCodec", "aac"))
    checks["codec"] = "PASS" if codec == expected_codec else "FAIL"
    if codec != expected_codec:
        errors.append(f"Audio codec mismatch: expected {expected_codec}, got {codec or 'none'}.")

    expected_sample_rate = int(audio_cfg.get("expectedSampleRateHz", 48000))
    checks["sampleRate"] = "PASS" if sample_rate == expected_sample_rate else "FAIL"
    if sample_rate != expected_sample_rate:
        errors.append(
            f"Audio sample rate mismatch: expected {expected_sample_rate} Hz, got {sample_rate} Hz."
        )

    min_channels = int(audio_cfg.get("minChannels", 1))
    max_channels = int(audio_cfg.get("maxChannels", 2))
    checks["channels"] = "PASS" if min_channels <= channels <= max_channels else "FAIL"
    if not min_channels <= channels <= max_channels:
        errors.append(
            f"Audio channel count outside contract: expected {min_channels}-{max_channels}, got {channels}."
        )

    max_sync_delta = float(audio_cfg.get("maxDurationDeltaSeconds", 0.12))
    video_duration = None
    if video_streams:
        video_duration = as_float(video_streams[0].get("duration"))
    if video_duration is None:
        video_duration = format_duration
    metrics["videoDurationSeconds"] = video_duration
    if audio_duration is not None and video_duration is not None:
        sync_delta = abs(audio_duration - video_duration)
        metrics["audioVideoDurationDeltaSeconds"] = sync_delta
        checks["durationSync"] = "PASS" if sync_delta <= max_sync_delta else "FAIL"
        if sync_delta > max_sync_delta:
            errors.append(
                f"Audio/video duration delta {sync_delta:.3f}s exceeds {max_sync_delta:.3f}s."
            )
    else:
        checks["durationSync"] = "WARN"
        warnings.append("Could not compare audio/video stream durations reliably.")

    if args.validation:
        checks["loudness"] = "SKIP_VALIDATION"
        checks["silence"] = "SKIP_VALIDATION"
        warnings.append("Full loudness and silence gates skipped for validation-frame renders.")

        validation_signal = audio_cfg.get("validationSignal", {})
        if bool(validation_signal.get("enabled", False)):
            min_peak_dbfs = float(validation_signal.get("minPeakDbfs", -45.0))
            code, _, volume_err = run([
                "ffmpeg", "-hide_banner", "-nostats", "-i", str(media_path),
                "-map", "0:a:0",
                "-af", "volumedetect",
                "-f", "null", "-"
            ])
            if code != 0:
                checks["validationSignal"] = "FAIL"
                errors.append("FFmpeg validation signal analysis failed.")
            else:
                validation_peak_dbfs = parse_volume(volume_err)
                metrics["validationPeakDbfs"] = validation_peak_dbfs
                signal_ok = (
                    validation_peak_dbfs is not None
                    and math.isfinite(validation_peak_dbfs)
                    and validation_peak_dbfs >= min_peak_dbfs
                )
                checks["validationSignal"] = "PASS" if signal_ok else "FAIL"
                if not signal_ok:
                    errors.append(
                        f"Validation audio is effectively silent: measured peak "
                        f"{validation_peak_dbfs} dBFS, required at least {min_peak_dbfs} dBFS."
                    )
        else:
            checks["validationSignal"] = "DISABLED"
    else:
        code, _, loudness_err = run([
            "ffmpeg", "-hide_banner", "-nostats", "-i", str(media_path),
            "-map", "0:a:0",
            "-filter_complex", "ebur128=peak=true",
            "-f", "null", "-"
        ])
        if code != 0:
            checks["loudness"] = "FAIL"
            errors.append("FFmpeg ebur128 analysis failed.")
        else:
            integrated_lufs, true_peak_dbfs, lra_lu = parse_loudness(loudness_err)
            metrics["integratedLufs"] = integrated_lufs
            metrics["truePeakDbfs"] = true_peak_dbfs
            metrics["loudnessRangeLu"] = lra_lu

            target_lufs = float(audio_cfg.get("targetIntegratedLufs", -14.0))
            tolerance_lu = float(audio_cfg.get("integratedLufsTolerance", 2.0))
            max_true_peak = float(audio_cfg.get("maxTruePeakDbfs", -1.0))
            max_lra = audio_cfg.get("maxLoudnessRangeLu")

            loudness_ok = integrated_lufs is not None and abs(integrated_lufs - target_lufs) <= tolerance_lu
            peak_ok = true_peak_dbfs is not None and true_peak_dbfs <= max_true_peak
            lra_ok = True if max_lra is None else (lra_lu is not None and lra_lu <= float(max_lra))

            checks["integratedLoudness"] = "PASS" if loudness_ok else "FAIL"
            checks["truePeak"] = "PASS" if peak_ok else "FAIL"
            checks["loudnessRange"] = "PASS" if lra_ok else "FAIL"

            if not loudness_ok:
                errors.append(
                    f"Integrated loudness outside target: measured {integrated_lufs} LUFS, "
                    f"target {target_lufs} +/- {tolerance_lu} LU."
                )
            if not peak_ok:
                errors.append(
                    f"True peak exceeds limit: measured {true_peak_dbfs} dBFS, limit {max_true_peak} dBFS."
                )
            if not lra_ok:
                errors.append(
                    f"Loudness range exceeds limit: measured {lra_lu} LU, limit {max_lra} LU."
                )

        silence_cfg = audio_cfg.get("silence", {})
        silence_enabled = bool(silence_cfg.get("enabled", True))
        if silence_enabled:
            noise_db = float(silence_cfg.get("noiseDb", -50.0))
            min_silence = float(silence_cfg.get("minDurationSeconds", 0.5))
            code, _, silence_err = run([
                "ffmpeg", "-hide_banner", "-nostats", "-i", str(media_path),
                "-map", "0:a:0",
                "-af", f"silencedetect=noise={noise_db}dB:d={min_silence}",
                "-f", "null", "-"
            ])
            if code != 0:
                checks["silenceAnalysis"] = "WARN"
                warnings.append("FFmpeg silencedetect analysis failed.")
            else:
                regions = parse_silence(silence_err)
                metrics["silenceRegions"] = regions
                max_continuous = max((r["duration"] for r in regions), default=0.0)
                metrics["maxContinuousSilenceSeconds"] = max_continuous

                leading = 0.0
                trailing = 0.0
                if regions and regions[0]["start"] <= 0.05:
                    leading = regions[0]["duration"]
                end_duration = audio_duration if audio_duration is not None else format_duration
                if regions and end_duration is not None and abs(regions[-1]["end"] - end_duration) <= 0.15:
                    trailing = regions[-1]["duration"]
                metrics["leadingSilenceSeconds"] = leading
                metrics["trailingSilenceSeconds"] = trailing

                enforce = bool(silence_cfg.get("enforce", False))
                silence_failures = []
                limits = [
                    ("leading", leading, silence_cfg.get("maxLeadingSeconds")),
                    ("trailing", trailing, silence_cfg.get("maxTrailingSeconds")),
                    ("continuous", max_continuous, silence_cfg.get("maxContinuousSeconds")),
                ]
                for label, measured, limit in limits:
                    if limit is not None and measured > float(limit):
                        silence_failures.append(
                            f"{label} silence {measured:.3f}s exceeds {float(limit):.3f}s"
                        )
                if silence_failures and enforce:
                    checks["silence"] = "FAIL"
                    errors.extend(silence_failures)
                elif silence_failures:
                    checks["silence"] = "WARN"
                    warnings.extend(silence_failures)
                else:
                    checks["silence"] = "PASS"
        else:
            checks["silence"] = "DISABLED"

report["result"] = "FAIL" if errors else "PASS"
report_path.parent.mkdir(parents=True, exist_ok=True)
report_path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
print(json.dumps(report, indent=2))
if errors:
    raise SystemExit(1)
