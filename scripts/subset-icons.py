#!/usr/bin/env python3
"""Build a small subset of the GrapheneIconsPro icon font.

The full font is ~148 KB but the app only uses a handful of icons. Icons are
ligatures (the text "plus" renders the plus icon), so we keep the letters
needed to type each name plus the ligature glyph for each icon.

When you use a new icon in a template, add its name to ICONS and run:

    pip install fonttools brotli
    python3 scripts/subset-icons.py
"""
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont

ICONS = [
    "arrow_up",
    "checkmark",
    "checkmark_circle",
    "delete_left",
    "exclamationmark_octagon",
    "infomark_circle",
    "minus",
    "plus",
    "questionmark_circle",
    "trash",  # templates write "trashcan": "trash" ligature + invisible "can"
]
# Extra words typed in templates whose letters must be kept
EXTRA_TEXT = ["trashcan"]

FONTS = Path(__file__).resolve().parent.parent / "src" / "assets" / "fonts"
SOURCE = FONTS / "GrapheneIconsPro.woff"


def ligature_map(font):
    reverse_cmap = {glyph: chr(code) for code, glyph in font.getBestCmap().items()}
    ligatures = {}
    for lookup in font["GSUB"].table.LookupList.Lookup:
        for table in lookup.SubTable:
            for first, entries in getattr(table, "ligatures", {}).items():
                for lig in entries:
                    word = "".join(
                        reverse_cmap.get(g, "?") for g in [first] + lig.Component
                    )
                    ligatures[word] = lig.LigGlyph
    return ligatures


def main():
    ligatures = ligature_map(TTFont(SOURCE))
    missing = [name for name in ICONS if name not in ligatures]
    if missing:
        raise SystemExit(f"Icons not found in font: {', '.join(missing)}")

    glyphs = [ligatures[name] for name in ICONS]
    text = "".join(sorted(set("".join(ICONS + EXTRA_TEXT))))

    for flavor in ("woff2", "woff"):
        options = subset.Options()
        options.layout_closure = False  # only keep the ligatures listed above
        options.layout_features = ["*"]
        options.name_IDs = ["*"]
        options.notdef_outline = True
        font = TTFont(SOURCE)
        subsetter = subset.Subsetter(options)
        subsetter.populate(text=text, glyphs=glyphs)
        subsetter.subset(font)
        font.flavor = flavor
        out = FONTS / f"GrapheneIconsPro.subset.{flavor}"
        font.save(out)
        print(f"{out.name}: {out.stat().st_size} bytes")


if __name__ == "__main__":
    main()
