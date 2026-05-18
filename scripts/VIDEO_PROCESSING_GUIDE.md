# Video Processing Guide - MAKARA STORE

Automated tool to remove external website elements (browser URL bars, watermarks, side panels) from product tutorial videos.

## Prerequisites

- **Python 3.8+**
- **FFmpeg** installed and in PATH

```bash
# Install FFmpeg
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt install ffmpeg

# Windows - download from https://ffmpeg.org/download.html
```

## Quick Start

```bash
cd scripts/

# Remove browser URL bar (top 10%) from a video
python process_video.py input.mp4 -o output.mp4 --crop-top 10

# Use a preset for common browser recordings
python process_video.py input.mp4 -o output.mp4 --preset browser-recording
```

## Usage Examples

### Cropping

Remove percentages from any edge of the video:

```bash
# Crop top 12% (browser chrome)
python process_video.py video.mp4 -o clean.mp4 --crop-top 12

# Crop top + right sidebar
python process_video.py video.mp4 -o clean.mp4 --crop-top 10 --crop-right 15

# Crop all sides
python process_video.py video.mp4 -o clean.mp4 --crop-top 12 --crop-bottom 5 --crop-left 20
```

### Blurring Regions

Blur specific areas (coordinates as percentages: x1%,y1%,x2%,y2%):

```bash
# Blur a watermark in bottom-right corner
python process_video.py video.mp4 -o clean.mp4 --blur 75,85,100,100

# Blur multiple regions
python process_video.py video.mp4 -o clean.mp4 --blur 0,0,100,8 --blur 80,90,100,100
```

### Masking (Black Fill)

Cover areas with solid black:

```bash
# Black-fill a logo in top-left
python process_video.py video.mp4 -o clean.mp4 --mask 0,0,20,8

# Combine crop + mask
python process_video.py video.mp4 -o clean.mp4 --crop-top 10 --mask 80,90,100,100
```

### Batch Processing

Process all videos in a directory:

```bash
python process_video.py ./raw_tutorials/ -o ./processed/ --preset browser-recording
```

### Presets

List available presets:

```bash
python process_video.py --list-presets
```

| Preset | Description |
|--------|-------------|
| `browser-recording` | Remove browser chrome (URL bar ~8%, tab bar ~4%) |
| `browser-with-sidebar` | Remove browser chrome + left sidebar ~20% |
| `fullscreen-watermark` | Blur bottom-right watermark area |
| `browser-full-cleanup` | Remove browser chrome + bottom taskbar |

### Quality Control

```bash
# Higher quality (lower CRF = better quality, larger file)
python process_video.py video.mp4 -o clean.mp4 --crop-top 10 --quality 18

# Faster encoding (lower quality)
python process_video.py video.mp4 -o clean.mp4 --crop-top 10 --speed fast

# Preview what will happen (dry run)
python process_video.py video.mp4 -o clean.mp4 --crop-top 10 --dry-run
```

## Frontend Video Player (Alternative)

For real-time masking without pre-processing, use the `MaskedVideoPlayer` component:

```tsx
import MaskedVideoPlayer from '@/components/product/MaskedVideoPlayer'

// Crop top 10% during playback
<MaskedVideoPlayer
  src="/videos/tutorial.mp4"
  cropTop={10}
/>

// Crop + blur specific region
<MaskedVideoPlayer
  src="/videos/tutorial.mp4"
  cropTop={10}
  cropRight={15}
  maskRegions={[
    { x: 80, y: 90, width: 20, height: 10, type: 'blur' }
  ]}
/>

// Black-fill a watermark area
<MaskedVideoPlayer
  src="/videos/tutorial.mp4"
  maskRegions={[
    { x: 0, y: 0, width: 100, height: 8, type: 'black' },
    { x: 75, y: 90, width: 25, height: 10, type: 'gradient' }
  ]}
/>
```

### MaskedVideoPlayer Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | string | required | Video URL |
| `poster` | string | - | Poster image URL |
| `cropTop` | number | 0 | Crop top percentage |
| `cropBottom` | number | 0 | Crop bottom percentage |
| `cropLeft` | number | 0 | Crop left percentage |
| `cropRight` | number | 0 | Crop right percentage |
| `maskRegions` | array | [] | Regions to mask/blur |
| `autoPlay` | boolean | false | Auto-play on load |

### Mask Region Types

- `blur` - Gaussian blur over the region
- `black` - Solid black fill
- `gradient` - Gradient fade from black to transparent
