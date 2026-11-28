#!/usr/bin/env python3
"""Generate every Tá Quanto icon and splash screen from branding/ta-quanto/app-icon.png.

    pip install pillow
    python3 scripts/ta-quanto-icons.py
"""
from pathlib import Path

from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "branding" / "ta-quanto" / "app-icon.png"
OUT = ROOT / "public" / "img" / "ta-quanto"

# Icons that keep the original rounded shape (transparent corners)
ROUNDED = {
    "android-chrome-192x192": 192,
    "android-chrome-512x512": 512,
    "favicon-16x16": 16,
    "favicon-32x32": 32,
    "favicon-64x64": 64,
}
# Icons that must be opaque squares (iOS paints transparency black; Windows tiles)
OPAQUE = {
    "apple-touch-icon-120x120": 120,
    "apple-touch-icon-152x152": 152,
    "apple-touch-icon-167x167": 167,
    "apple-touch-icon-180x180": 180,
    "msapplication-icon-144x144": 144,
    "mstile-150x150": 150,
}
# iOS launch screens: (css width, css height, pixel ratio)
SPLASH = [
    (414, 896, 3),
    (414, 896, 2),
    (375, 812, 3),
    (414, 736, 3),
    (375, 667, 2),
    (320, 568, 2),
]
SPLASH_TOP, SPLASH_BOTTOM = (125, 220, 62), (52, 209, 165)


def opaque(icon, scale=1.0):
    """Fill the corners with a blurred copy of the icon so the edges blend in."""
    size = icon.size[0]
    # Sample only the fully opaque middle (transparent corners are black underneath)
    edge = round(size * 0.12)
    middle = icon.convert("RGB").crop((edge, edge, size - edge, size - edge))
    small = middle.resize((size // 8, size // 8), Image.LANCZOS)
    ground = small.filter(ImageFilter.GaussianBlur(6)).resize((size, size), Image.LANCZOS)
    ground = ground.convert("RGBA")
    inner = icon if scale == 1.0 else icon.resize((round(size * scale),) * 2, Image.LANCZOS)
    offset = (size - inner.size[0]) // 2
    ground.alpha_composite(inner, (offset, offset))
    return ground.convert("RGB")


def gradient(width, height):
    column = Image.new("RGB", (1, height))
    for y in range(height):
        t = y / max(1, height - 1)
        column.putpixel(
            (0, y), tuple(round(a + (b - a) * t) for a, b in zip(SPLASH_TOP, SPLASH_BOTTOM))
        )
    return column.resize((width, height))


def main():
    icon = Image.open(SOURCE).convert("RGBA")
    (OUT / "icons").mkdir(parents=True, exist_ok=True)
    (OUT / "splash").mkdir(parents=True, exist_ok=True)

    for name, size in ROUNDED.items():
        icon.resize((size, size), Image.LANCZOS).save(OUT / "icons" / f"{name}.png", optimize=True)

    square = opaque(icon)
    for name, size in OPAQUE.items():
        square.resize((size, size), Image.LANCZOS).save(OUT / "icons" / f"{name}.png", optimize=True)

    # Android adaptive (maskable) icon: whole icon inside the 80% safe zone
    opaque(icon, scale=0.78).resize((512, 512), Image.LANCZOS).save(
        OUT / "icons" / "android-chrome-maskable-512x512.png", optimize=True
    )

    for w, h, ratio in SPLASH:
        width, height = w * ratio, h * ratio
        screen = gradient(width, height).convert("RGBA")
        side = round(width * 0.32)
        mark = icon.resize((side, side), Image.LANCZOS)
        screen.alpha_composite(mark, ((width - side) // 2, (height - side) // 2))
        screen.convert("RGB").save(
            OUT / "splash" / f"apple-launch-{w}x{h}@{ratio}x.jpg",
            quality=88,
            optimize=True,
            progressive=True,
        )
    print("Generated icons and splash screens in", OUT)


if __name__ == "__main__":
    main()
