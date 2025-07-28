#!/usr/bin/env python3
"""
Simple SVG to PNG converter using wand (ImageMagick)
Alternative: pip install Wand
"""

import os
import base64
from PIL import Image, ImageDraw
import io

def create_icon_png(size, filename):
    """Create a PNG icon programmatically"""
    # Create image with transparent background
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Calculate scaling factor
    scale = size / 128.0
    
    # Background circle
    center = size // 2
    radius = int(58 * scale)
    
    # Draw background circle with gradient effect (simplified)
    for i in range(radius):
        alpha = int(255 * (1 - i / radius) * 0.8)
        color = (26, 26, 46, alpha)
        draw.ellipse([center - radius + i, center - radius + i, 
                     center + radius - i, center + radius - i], 
                    fill=color)
    
    # Draw border
    border_width = max(1, int(3 * scale))
    draw.ellipse([center - radius, center - radius, 
                 center + radius, center + radius], 
                outline=(0, 212, 255, 255), width=border_width)
    
    # Draw skip forward triangles
    triangle_scale = scale * 0.8
    
    # First triangle
    triangle1 = [
        (center - int(25 * triangle_scale), center - int(20 * triangle_scale)),
        (center - int(8 * triangle_scale), center),
        (center - int(25 * triangle_scale), center + int(20 * triangle_scale))
    ]
    draw.polygon(triangle1, fill=(0, 212, 255, 255), outline=(255, 255, 255, 255))
    
    # Second triangle
    triangle2 = [
        (center - int(8 * triangle_scale), center - int(20 * triangle_scale)),
        (center + int(9 * triangle_scale), center),
        (center - int(8 * triangle_scale), center + int(20 * triangle_scale))
    ]
    draw.polygon(triangle2, fill=(0, 212, 255, 255), outline=(255, 255, 255, 255))
    
    # Draw vertical bars
    bar_width = max(1, int(5 * triangle_scale))
    bar_height = int(40 * triangle_scale)
    
    # First bar
    draw.rectangle([center + int(12 * triangle_scale), center - int(20 * triangle_scale),
                   center + int(12 * triangle_scale) + bar_width, center + int(20 * triangle_scale)],
                  fill=(0, 212, 255, 255), outline=(255, 255, 255, 255))
    
    # Second bar
    draw.rectangle([center + int(20 * triangle_scale), center - int(20 * triangle_scale),
                   center + int(20 * triangle_scale) + bar_width, center + int(20 * triangle_scale)],
                  fill=(0, 212, 255, 255), outline=(255, 255, 255, 255))
    
    # Draw lightning bolt (simplified)
    if size >= 48:  # Only draw lightning bolt for larger sizes
        bolt_scale = scale * 0.6
        bolt_x = center + int(26 * scale)
        bolt_y = center - int(26 * scale)
        
        bolt_points = [
            (bolt_x, bolt_y),
            (bolt_x + int(6 * bolt_scale), bolt_y),
            (bolt_x + int(2 * bolt_scale), bolt_y + int(6 * bolt_scale)),
            (bolt_x + int(4 * bolt_scale), bolt_y + int(6 * bolt_scale)),
            (bolt_x, bolt_y + int(12 * bolt_scale)),
            (bolt_x + int(3 * bolt_scale), bolt_y + int(5 * bolt_scale)),
            (bolt_x + int(1 * bolt_scale), bolt_y + int(5 * bolt_scale))
        ]
        draw.polygon(bolt_points, fill=(255, 235, 59, 255), outline=(255, 193, 7, 255))
    
    # Save the image
    img.save(filename, 'PNG')
    print(f"✓ Created {filename} ({size}x{size})")

def main():
    """Create all icon sizes"""
    icons_dir = "icons"
    
    print("Creating PNG icons programmatically...")
    
    # Create icons
    create_icon_png(16, os.path.join(icons_dir, "icon16.png"))
    create_icon_png(48, os.path.join(icons_dir, "icon48.png"))
    create_icon_png(128, os.path.join(icons_dir, "icon128.png"))
    
    print("\nIcon creation complete!")
    print("PNG files have been created in the icons folder.")

if __name__ == "__main__":
    main()