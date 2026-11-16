"""Create an embedded 129 x 129 Mt. Mitchell Terrarium DEM sample.

Inputs are the four locally retained Terrarium PNG tiles around the documented
Mt. Mitchell / Black Mountains point. Output is a base64 little-endian ushort
grid in metres, suitable for inclusion in the standalone HTML renderer.
"""
from pathlib import Path
from PIL import Image
import base64
import struct

root = Path(__file__).parent
mosaic = Image.new("RGB", (512, 512))
for tx in (277, 278):
    for ty in (402, 403):
        mosaic.paste(Image.open(root / f"terrain-10-{tx}-{ty}.png").convert("RGB"), ((tx-277)*256, (ty-402)*256))

# The provided lon/lat maps here. A 194 px square is approximately 24 km wide.
cx, cy, source_span, n = 256.3823, 239.6801, 194.0, 129
heights = []
for j in range(n):
    y = cy - source_span / 2 + j * source_span / (n - 1)
    for i in range(n):
        x = cx - source_span / 2 + i * source_span / (n - 1)
        r, g, b = mosaic.getpixel((round(x), round(y)))
        heights.append(round(r * 256 + g + b / 256 - 32768))
data = struct.pack("<" + "H" * len(heights), *heights)
(root / "mt-mitchell-dem-129.b64.txt").write_text(base64.b64encode(data).decode())
print(min(heights), max(heights), len(heights))
