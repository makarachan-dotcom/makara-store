#!/usr/bin/env python3
"""
Video Processing Script for MAKARA STORE
=========================================
Automated video cropping, masking, and blurring tool using FFmpeg.

Removes external website elements (browser URL bars, watermarks, side panels)
from product tutorial videos to produce clean, unbranded output.

Requirements:
    - Python 3.8+
    - FFmpeg installed and available in PATH

Usage:
    # Crop the top 10% (URL bar) from a video
    python process_video.py input.mp4 -o output.mp4 --crop-top 10

    # Crop top 10% and right 15% (URL bar + sidebar)
    python process_video.py input.mp4 -o output.mp4 --crop-top 10 --crop-right 15

    # Blur a specific region (watermark at bottom-right)
    python process_video.py input.mp4 -o output.mp4 --blur 75,85,100,100

    # Black-fill a region (logo area)
    python process_video.py input.mp4 -o output.mp4 --mask 0,0,20,8

    # Combine: crop top + blur watermark
    python process_video.py input.mp4 -o output.mp4 --crop-top 10 --blur 80,90,100,100

    # Batch process all .mp4 files in a directory
    python process_video.py ./videos/ -o ./output/ --crop-top 10 --crop-right 15

    # Use a preset for common browser recording cleanup
    python process_video.py input.mp4 -o output.mp4 --preset browser-recording
"""

import argparse
import json
import os
import subprocess
import sys
from pathlib import Path
from typing import Optional


PRESETS = {
    "browser-recording": {
        "description": "Remove browser chrome (URL bar ~8%, tab bar ~4%)",
        "crop_top": 12,
        "crop_bottom": 0,
        "crop_left": 0,
        "crop_right": 0,
    },
    "browser-with-sidebar": {
        "description": "Remove browser chrome + left sidebar (~20%)",
        "crop_top": 12,
        "crop_bottom": 0,
        "crop_left": 20,
        "crop_right": 0,
    },
    "fullscreen-watermark": {
        "description": "Blur bottom-right watermark area",
        "crop_top": 0,
        "crop_bottom": 0,
        "crop_left": 0,
        "crop_right": 0,
        "blur_regions": [[75, 90, 100, 100]],
    },
    "browser-full-cleanup": {
        "description": "Remove browser chrome + bottom taskbar",
        "crop_top": 12,
        "crop_bottom": 5,
        "crop_left": 0,
        "crop_right": 0,
    },
}


def check_ffmpeg() -> bool:
    try:
        result = subprocess.run(
            ["ffmpeg", "-version"],
            capture_output=True,
            text=True,
        )
        return result.returncode == 0
    except FileNotFoundError:
        return False


def get_video_info(input_path: str) -> dict:
    cmd = [
        "ffprobe",
        "-v", "quiet",
        "-print_format", "json",
        "-show_streams",
        "-show_format",
        input_path,
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(f"ffprobe failed: {result.stderr}")
    info = json.loads(result.stdout)
    video_stream = next(
        (s for s in info.get("streams", []) if s["codec_type"] == "video"),
        None,
    )
    if not video_stream:
        raise RuntimeError(f"No video stream found in {input_path}")
    return {
        "width": int(video_stream["width"]),
        "height": int(video_stream["height"]),
        "duration": float(info.get("format", {}).get("duration", 0)),
        "codec": video_stream.get("codec_name", "unknown"),
        "fps": video_stream.get("r_frame_rate", "30/1"),
    }


def build_filter_chain(
    width: int,
    height: int,
    crop_top: float = 0,
    crop_bottom: float = 0,
    crop_left: float = 0,
    crop_right: float = 0,
    blur_regions: Optional[list] = None,
    mask_regions: Optional[list] = None,
) -> str:
    filters = []

    # Crop filter
    ct = int(height * crop_top / 100)
    cb = int(height * crop_bottom / 100)
    cl = int(width * crop_left / 100)
    cr = int(width * crop_right / 100)

    new_w = width - cl - cr
    new_h = height - ct - cb

    if ct > 0 or cb > 0 or cl > 0 or cr > 0:
        filters.append(f"crop={new_w}:{new_h}:{cl}:{ct}")
    else:
        new_w = width
        new_h = height

    # Blur regions (coordinates are percentages of the post-crop dimensions)
    if blur_regions:
        for i, region in enumerate(blur_regions):
            x1_pct, y1_pct, x2_pct, y2_pct = region
            bx = int(new_w * x1_pct / 100)
            by = int(new_h * y1_pct / 100)
            bw = int(new_w * (x2_pct - x1_pct) / 100)
            bh = int(new_h * (y2_pct - y1_pct) / 100)
            # Split, blur the region, overlay back
            blur_filter = (
                f"split[main{i}][blur{i}];"
                f"[blur{i}]crop={bw}:{bh}:{bx}:{by},"
                f"avgblur=sizeX=25:sizeY=25[blurred{i}];"
                f"[main{i}][blurred{i}]overlay={bx}:{by}"
            )
            filters.append(blur_filter)

    # Mask regions (black fill, coordinates are percentages)
    if mask_regions:
        for region in mask_regions:
            x1_pct, y1_pct, x2_pct, y2_pct = region
            mx = int(new_w * x1_pct / 100)
            my = int(new_h * y1_pct / 100)
            mw = int(new_w * (x2_pct - x1_pct) / 100)
            mh = int(new_h * (y2_pct - y1_pct) / 100)
            filters.append(
                f"drawbox=x={mx}:y={my}:w={mw}:h={mh}:color=black:t=fill"
            )

    if not filters:
        return ""

    # Join filters - blur uses split/overlay so needs semicolons
    result_parts = []
    for f in filters:
        if "split[" in f:
            result_parts.append(f)
        else:
            result_parts.append(f)

    return ";".join(result_parts) if any("split[" in f for f in filters) else ",".join(filters)


def process_video(
    input_path: str,
    output_path: str,
    crop_top: float = 0,
    crop_bottom: float = 0,
    crop_left: float = 0,
    crop_right: float = 0,
    blur_regions: Optional[list] = None,
    mask_regions: Optional[list] = None,
    quality: int = 23,
    preset_speed: str = "medium",
) -> bool:
    info = get_video_info(input_path)
    width = info["width"]
    height = info["height"]

    print(f"  Input: {width}x{height}, {info['codec']}, {info['duration']:.1f}s")

    filter_chain = build_filter_chain(
        width, height,
        crop_top, crop_bottom, crop_left, crop_right,
        blur_regions, mask_regions,
    )

    cmd = ["ffmpeg", "-y", "-i", input_path]

    if filter_chain:
        cmd.extend(["-vf", filter_chain])

    cmd.extend([
        "-c:v", "libx264",
        "-crf", str(quality),
        "-preset", preset_speed,
        "-c:a", "aac",
        "-b:a", "128k",
        "-movflags", "+faststart",
        output_path,
    ])

    print(f"  Processing...")
    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode != 0:
        print(f"  ERROR: {result.stderr[-500:]}")
        return False

    out_info = get_video_info(output_path)
    out_size = os.path.getsize(output_path) / (1024 * 1024)
    in_size = os.path.getsize(input_path) / (1024 * 1024)
    print(f"  Output: {out_info['width']}x{out_info['height']}, {out_size:.1f}MB (was {in_size:.1f}MB)")
    return True


def parse_region(region_str: str) -> list:
    parts = [float(x.strip()) for x in region_str.split(",")]
    if len(parts) != 4:
        raise ValueError(f"Region must have 4 values (x1%,y1%,x2%,y2%), got: {region_str}")
    for p in parts:
        if p < 0 or p > 100:
            raise ValueError(f"Region values must be 0-100 (percentages), got: {p}")
    return parts


def main():
    parser = argparse.ArgumentParser(
        description="MAKARA STORE Video Processor - Remove external branding from tutorial videos",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s input.mp4 -o output.mp4 --crop-top 10
  %(prog)s input.mp4 -o output.mp4 --crop-top 10 --crop-right 15
  %(prog)s input.mp4 -o output.mp4 --blur 75,85,100,100
  %(prog)s input.mp4 -o output.mp4 --preset browser-recording
  %(prog)s ./videos/ -o ./output/ --crop-top 12

Presets:
  browser-recording      Remove browser chrome (URL bar, tabs) ~12%% top
  browser-with-sidebar   Remove browser chrome + left sidebar ~20%%
  fullscreen-watermark   Blur bottom-right watermark area
  browser-full-cleanup   Remove browser chrome + bottom taskbar
        """,
    )

    parser.add_argument("input", help="Input video file or directory of videos")
    parser.add_argument("-o", "--output", required=True, help="Output file or directory")
    parser.add_argument("--crop-top", type=float, default=0, help="Crop top %% (e.g., 10 for URL bar)")
    parser.add_argument("--crop-bottom", type=float, default=0, help="Crop bottom %%")
    parser.add_argument("--crop-left", type=float, default=0, help="Crop left %%")
    parser.add_argument("--crop-right", type=float, default=0, help="Crop right %%")
    parser.add_argument("--blur", action="append", help="Blur region as x1%%,y1%%,x2%%,y2%% (can repeat)")
    parser.add_argument("--mask", action="append", help="Black-fill region as x1%%,y1%%,x2%%,y2%% (can repeat)")
    parser.add_argument("--quality", type=int, default=23, help="CRF quality (0-51, lower=better, default=23)")
    parser.add_argument("--speed", default="medium", choices=["ultrafast", "superfast", "veryfast", "faster", "fast", "medium", "slow", "slower", "veryslow"], help="Encoding speed preset")
    parser.add_argument("--preset", choices=list(PRESETS.keys()), help="Use a predefined preset")
    parser.add_argument("--list-presets", action="store_true", help="List available presets")
    parser.add_argument("--dry-run", action="store_true", help="Show what would be done without processing")

    args = parser.parse_args()

    if args.list_presets:
        print("\nAvailable presets:\n")
        for name, config in PRESETS.items():
            print(f"  {name}")
            print(f"    {config['description']}")
            print(f"    Crop: top={config.get('crop_top', 0)}% bottom={config.get('crop_bottom', 0)}% "
                  f"left={config.get('crop_left', 0)}% right={config.get('crop_right', 0)}%")
            if config.get("blur_regions"):
                for br in config["blur_regions"]:
                    print(f"    Blur: {br[0]}%,{br[1]}% -> {br[2]}%,{br[3]}%")
            print()
        return

    if not check_ffmpeg():
        print("ERROR: FFmpeg is not installed or not in PATH.")
        print("Install it with:")
        print("  macOS:   brew install ffmpeg")
        print("  Ubuntu:  sudo apt install ffmpeg")
        print("  Windows: https://ffmpeg.org/download.html")
        sys.exit(1)

    # Apply preset
    crop_top = args.crop_top
    crop_bottom = args.crop_bottom
    crop_left = args.crop_left
    crop_right = args.crop_right
    blur_regions = []
    mask_regions = []

    if args.preset:
        preset = PRESETS[args.preset]
        crop_top = preset.get("crop_top", crop_top)
        crop_bottom = preset.get("crop_bottom", crop_bottom)
        crop_left = preset.get("crop_left", crop_left)
        crop_right = preset.get("crop_right", crop_right)
        blur_regions = preset.get("blur_regions", [])
        print(f"Using preset: {args.preset} - {preset['description']}")

    # Parse blur/mask regions from CLI
    if args.blur:
        for b in args.blur:
            blur_regions.append(parse_region(b))
    if args.mask:
        for m in args.mask:
            mask_regions.append(parse_region(m))

    input_path = Path(args.input)
    output_path = Path(args.output)

    # Collect video files
    video_extensions = {".mp4", ".mkv", ".avi", ".mov", ".webm", ".flv", ".wmv"}
    files_to_process = []

    if input_path.is_dir():
        for f in sorted(input_path.iterdir()):
            if f.suffix.lower() in video_extensions:
                out_file = output_path / f.name
                files_to_process.append((str(f), str(out_file)))
        if not files_to_process:
            print(f"No video files found in {input_path}")
            sys.exit(1)
        output_path.mkdir(parents=True, exist_ok=True)
    elif input_path.is_file():
        if output_path.is_dir() or str(output_path).endswith("/"):
            output_path.mkdir(parents=True, exist_ok=True)
            out_file = output_path / input_path.name
            files_to_process.append((str(input_path), str(out_file)))
        else:
            output_path.parent.mkdir(parents=True, exist_ok=True)
            files_to_process.append((str(input_path), str(output_path)))
    else:
        print(f"ERROR: Input not found: {input_path}")
        sys.exit(1)

    print(f"\nVideo Processing Pipeline")
    print(f"{'=' * 50}")
    print(f"Files to process: {len(files_to_process)}")
    print(f"Crop: top={crop_top}% bottom={crop_bottom}% left={crop_left}% right={crop_right}%")
    if blur_regions:
        print(f"Blur regions: {blur_regions}")
    if mask_regions:
        print(f"Mask regions: {mask_regions}")
    print(f"Quality: CRF {args.quality} ({args.speed})")
    print()

    if args.dry_run:
        for inp, out in files_to_process:
            print(f"  [DRY RUN] {inp} -> {out}")
        return

    success = 0
    failed = 0
    for i, (inp, out) in enumerate(files_to_process, 1):
        print(f"[{i}/{len(files_to_process)}] {Path(inp).name}")
        try:
            ok = process_video(
                inp, out,
                crop_top, crop_bottom, crop_left, crop_right,
                blur_regions if blur_regions else None,
                mask_regions if mask_regions else None,
                args.quality, args.speed,
            )
            if ok:
                success += 1
            else:
                failed += 1
        except Exception as e:
            print(f"  ERROR: {e}")
            failed += 1

    print(f"\n{'=' * 50}")
    print(f"Complete: {success} succeeded, {failed} failed")


if __name__ == "__main__":
    main()
