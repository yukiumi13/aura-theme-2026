#!/usr/bin/env python3
"""Sample stored RGB colors from the supplied UI screenshot (requires Pillow)."""
import argparse
import colorsys
import hashlib
import json
from collections import Counter
from pathlib import Path

from PIL import Image

# Fractions of image width/height; rectangles use Pillow's exclusive right/bottom.
REGIONS = {
    'task_button': (0.51, 0.309, 0.94, 0.34),
    'purchase_button': (0.70, 0.244, 0.97, 0.275),
    'progress_bar': (0.24, 0.268, 0.50, 0.279),
    'paper': (0.30, 0.225, 0.55, 0.238),
}


def count_pixels(image):
    pixels = image.load()
    return Counter(pixels[x, y] for y in range(image.height) for x in range(image.width))


def common_colors(counts):
    return [{'rgb': '#%02X%02X%02X' % color, 'pixels': count}
            for color, count in counts.most_common(10)]


def sample(path):
    image = Image.open(path)
    # No resizing, quantization, display-profile conversion, or inferred colors.
    rgb = image.convert('RGB')
    regions = {}
    for name, rect in REGIONS.items():
        box = tuple(int(v * (rgb.width if i % 2 == 0 else rgb.height)) for i, v in enumerate(rect))
        regions[name] = {'box_xyxy': box, 'most_common': common_colors(count_pixels(rgb.crop(box)))}
    cyan = Counter()
    for color, count in count_pixels(rgb).items():
        hue, saturation, value = colorsys.rgb_to_hsv(*(c / 255 for c in color))
        if 0.46 < hue < 0.53 and saturation > 0.65 and value > 0.65:
            cyan[color] = count
    return {
        'source_sha256': hashlib.sha256(path.read_bytes()).hexdigest(),
        'size': image.size, 'mode': image.mode,
        'srgb_rendering_intent': image.info.get('srgb'),
        'gamma': image.info.get('gamma'),
        'embedded_icc_profile': bool(image.info.get('icc_profile')),
        'method': 'Count stored RGB pixels at native resolution; no image transformations.',
        'regions': regions,
        'cyan_filter': {'hue_fraction': [0.46, 0.53], 'min_saturation': 0.65, 'min_value': 0.65},
        'cyan_most_common': common_colors(cyan),
        'interpretation': 'Pixel evidence, not a recovery of the original application design tokens.',
    }


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('image', type=Path)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    args.output.write_text(json.dumps(sample(args.image), indent=2) + '\n')
