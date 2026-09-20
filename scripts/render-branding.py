"""Compose Aura branding from Smooch, Jost, and real VS Code captures.

Requires Pillow. Run from any directory: python scripts/render-branding.py
Writes the design assets, README teasers, and both VS Code extension icons.
The editor pixels come from the checked-in screenshots.
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
DESIGN = ROOT / "design" / "branding"
ASSETS = ROOT / "docs" / "assets"
BACKGROUND = "#09080D"
COLORS = ["#61FFCA", "#A277FF", "#D49DFF", "#12DADD"]
RESAMPLE = Image.Resampling.LANCZOS


def font(size, weight=400):
    result = ImageFont.truetype(str(DESIGN / "fonts" / "Jost.ttf"), size)
    result.set_variation_by_axes([weight])
    return result


def tracked(text, size, spacing, color, weight=400):
    face = font(size, weight)
    layer = Image.new("RGBA", (2000, size * 3))
    draw = ImageDraw.Draw(layer)
    x = 0
    for char in text:
        draw.text((x, 0), char, fill=color, font=face)
        x += face.getlength(char) + spacing
    return layer.crop(layer.getbbox())


def fit_width(image, width):
    return image.resize((width, round(image.height * width / image.width)), RESAMPLE)


def paste_center(image, layer, center, y):
    image.paste(layer, (round(center - layer.width / 2), y), layer)


def wordmark():
    face = ImageFont.truetype(str(DESIGN / "fonts" / "Smooch-Regular.ttf"), 900)
    image = Image.new("RGBA", (3500, 1900))
    draw = ImageDraw.Draw(image)
    for i, (char, color) in enumerate(zip("Aura", COLORS)):
        # Preserve the font's baseline, proportions, and pair kerning. A small
        # amount of tracking keeps adjacent colors distinct at icon sizes.
        x = 400 + face.getlength("Aura"[:i + 1]) - face.getlength(char)
        x += i * 6
        draw.text((x, 300), char, font=face, fill=color)
    image = image.crop(image.getchannel("A").getbbox())
    image.save(DESIGN / "aura-wordmark.png")
    return image


def screenshot(family):
    return Image.open(ASSETS / f"aura-2026-{family}-vscode.jpg").convert("RGB")


def icon(word):
    image = Image.new("RGB", (1024, 1024), BACKGROUND)
    mark = fit_width(word, 940)
    subtitle = tracked("MODERN", 62, 15, "#ADACAE", 500)
    top = (1024 - mark.height - subtitle.height - 62) // 2
    paste_center(image, mark, 512, top)
    paste_center(image, subtitle, 562, top + mark.height + 62)
    image.save(DESIGN / "aura-modern-master.png")
    small = image.resize((512, 512), RESAMPLE)
    for path in [
        DESIGN / "aura-modern-icon.png",
        ROOT / "src/ports/vscode/extra/logo.png",
        ROOT / "packages/vscode/logo.png",
    ]:
        small.save(path, optimize=True)


def brand_teaser(word):
    image = Image.new("RGB", (1600, 900), BACKGROUND)
    draw = ImageDraw.Draw(image)
    mark = fit_width(word, 940)
    image.paste(mark, (55, 65), mark)
    subtitle = tracked("MODERN", 44, 14, "#ADACAE", 500)
    paste_center(image, subtitle, 590, 442)
    draw.text((1160, 155), "Aura. Aqua. Lime. Azure.", font=font(25), fill="#EDECEE")
    draw.text((1160, 204), "Dark & light", font=font(25), fill="#ADACAE")
    draw.text((1160, 243), "for Visual Studio Code", font=font(25), fill="#ADACAE")
    for x, family, title, color in [
        (56, "dark", "AURA DARK", "#A277FF"),
        (561, "light", "AURA LIGHT", "#D49DFF"),
        (1066, "aqua-light", "AQUA LIGHT", "#12DADD"),
    ]:
        label = tracked(title, 19, 3, color, 500)
        image.paste(label, (x, 540), label)
        # Keep the real active tab and editor together; exclude the OS title bar.
        crop = screenshot(family).crop((348, 30, 1168, 545))
        crop = fit_width(crop, 478)
        image.paste(crop, (x, 581))
    image.save(ASSETS / "aura-teaser-gallery.png", optimize=True)


def zoom_teaser(word):
    # Real enlarged Aqua Dark pixels, with an explicit compositing fade on the
    # left for lettering. The gallery retains the unaltered screenshot colors.
    crop = screenshot("aqua-dark").crop((348, 30, 1370, 651))
    crop = fit_width(crop, 1450)
    image = Image.new("RGB", (1600, 840), BACKGROUND)
    image.paste(crop, (320, -18))
    fade = Image.new("RGBA", image.size, BACKGROUND)
    ramp = Image.new("L", (1600, 1))
    ramp.putdata([
        255 if x < 460 else round(255 * max(0, 1 - (x - 460) / 740))
        for x in range(1600)
    ])
    fade.putalpha(ramp.resize(image.size))
    image = Image.alpha_composite(image.convert("RGBA"), fade)
    mark = fit_width(word, 930)
    image.alpha_composite(mark, (45, 174))
    subtitle = tracked("MODERN", 45, 14, "#ADACAE", 500)
    paste_center(image, subtitle, 560, 577)
    draw = ImageDraw.Draw(image)
    label = tracked("AURA / AQUA / LIME / AZURE", 22, 3, "#C6C3CE")
    image.paste(label, (72, 727), label)
    draw.text((72, 766), "Eight color themes for Visual Studio Code", font=font(24), fill="#ADACAE")
    image.convert("RGB").save(ASSETS / "aura-teaser-zoom.png", optimize=True)


if __name__ == "__main__":
    word = wordmark()
    icon(word)
    brand_teaser(word)
    zoom_teaser(word)
    print("Rendered Aura icon, gallery teaser and screenshot teaser.")
