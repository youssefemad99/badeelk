# scripts/generate_icon.py
# Generates a valid 512x512 PNG icon for PWA & favicon

import zlib
import struct

def make_png(width, height, color_rgb):
    # Signature
    png = b'\x89PNG\r\n\x1a\n'
    # IHDR
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)
    ihdr_crc = struct.pack('>I', zlib.crc32(b'IHDR' + ihdr_data))
    png += struct.pack('>I', len(ihdr_data)) + b'IHDR' + ihdr_data + ihdr_crc

    # Raw image data: filter byte 0 followed by RGB
    raw = bytearray()
    r, g, b = color_rgb
    for _ in range(height):
        raw.append(0) # filter type 0 (None)
        for _ in range(width):
            raw.extend((r, g, b))

    compressed = zlib.compress(raw, 9)
    idat_crc = struct.pack('>I', zlib.crc32(b'IDAT' + compressed))
    png += struct.pack('>I', len(compressed)) + b'IDAT' + compressed + idat_crc

    # IEND
    iend_crc = struct.pack('>I', zlib.crc32(b'IEND'))
    png += struct.pack('>I', 0) + b'IEND' + iend_crc

    return bytes(png)

# Green brand color #0F5A46 -> (15, 90, 70)
png_bytes = make_png(512, 512, (15, 90, 70))
with open("../icon-512.png", "wb") as f:
    f.write(png_bytes)

print("Created ../icon-512.png successfully!")
