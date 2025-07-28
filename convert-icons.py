#!/usr/bin/env python3
"""
Convert SVG icons to PNG format for Chrome extension
Requires: pip install cairosvg
"""

import os
try:
    import cairosvg
except ImportError:
    print("Error: cairosvg not installed. Run: pip install cairosvg")
    exit(1)

def convert_svg_to_png(svg_path, png_path, size):
    """Convert SVG to PNG with specified size"""
    try:
        cairosvg.svg2png(
            url=svg_path,
            write_to=png_path,
            output_width=size,
            output_height=size
        )
        print(f"✓ Created {png_path} ({size}x{size})")
    except Exception as e:
        print(f"✗ Error creating {png_path}: {e}")

def main():
    """Convert all icon SVGs to PNGs"""
    icons_dir = "icons"
    
    # Icon sizes and their corresponding files
    icons = [
        ("icon16.svg", "icon16.png", 16),
        ("icon48.svg", "icon48.png", 48),
        ("icon128.svg", "icon128.png", 128)
    ]
    
    print("Converting SVG icons to PNG...")
    
    for svg_file, png_file, size in icons:
        svg_path = os.path.join(icons_dir, svg_file)
        png_path = os.path.join(icons_dir, png_file)
        
        if os.path.exists(svg_path):
            convert_svg_to_png(svg_path, png_path, size)
        else:
            print(f"✗ SVG file not found: {svg_path}")
    
    print("\nIcon conversion complete!")
    print("You can now use the PNG files in your Chrome extension.")

if __name__ == "__main__":
    main()