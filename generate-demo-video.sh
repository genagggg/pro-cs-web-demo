#!/usr/bin/env bash
# generate-demo-video.sh — record a demo walkthrough of pro-cs-web-demo
# Usage: bash generate-demo-video.sh [output.mp4]
#
# Prerequisites:
#   - ffmpeg installed (https://ffmpeg.org/)
#   - All dev servers running: npm run dev
#   - A display / X server (works on Linux/macOS; use QuickTime on Windows)

set -euo pipefail

OUTPUT="${1:-demo-walkthrough.mp4}"
RESOLUTION="${RESOLUTION:-1920x1080}"
FPS="${FPS:-30}"
DISPLAY="${DISPLAY:-:0}"
AUDIO_SOURCE="${AUDIO_SOURCE:-}"

echo "=== pro-cs-web-demo screen recorder ==="
echo "Output : $OUTPUT"
echo "Res    : $RESOLUTION"
echo "FPS    : $FPS"
echo ""
echo "Make sure 'npm run dev' is running before you start."
echo "Press Ctrl+C to stop recording."
echo ""

FFMPEG_OPTS=(
  -f x11grab
  -s "$RESOLUTION"
  -r "$FPS"
  -i "$DISPLAY"
  -c:v libx264
  -preset ultrafast
  -crf 28
  -pix_fmt yuv420p
)

if [ -n "$AUDIO_SOURCE" ]; then
  FFMPEG_OPTS+=(
    -f pulse
    -i "$AUDIO_SOURCE"
    -c:a aac
    -b:a 128k
  )
fi

ffmpeg "${FFMPEG_OPTS[@]}" "$OUTPUT"

echo ""
echo "Recording saved to: $OUTPUT"
