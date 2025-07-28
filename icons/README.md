# Hotstar Extended Icons

This folder contains the icons for the Hotstar Extended Chrome extension.

## Icon Design

The icons feature:
- **Double triangles**: Representing "skip forward" functionality
- **Vertical bars**: Representing "next/end" controls
- **Lightning bolt**: Representing automation and speed
- **Blue gradient**: Matching Hotstar's brand colors
- **Dark background**: For better visibility

## Files

### Required PNG Files (for Chrome Extension)
- `icon16.png` - 16x16 pixels (toolbar icon)
- `icon48.png` - 48x48 pixels (extension management page)
- `icon128.png` - 128x128 pixels (Chrome Web Store)

### Source SVG Files
- `icon16.svg` - Source for 16px icon
- `icon48.svg` - Source for 48px icon  
- `icon128.svg` - Source for 128px icon

## Converting SVG to PNG

### Method 1: Using Python Script
1. Install Python from https://python.org
2. Run `convert-icons.bat` (Windows) or `python convert-icons.py`
3. The script will install cairosvg and convert all SVG files to PNG

### Method 2: Using Online Converter
1. Go to https://convertio.co/svg-png/
2. Upload each SVG file
3. Set the output size to match the filename (16px, 48px, 128px)
4. Download and save as the corresponding PNG filename

### Method 3: Using generate-icons.html
1. Open `generate-icons.html` in your browser
2. Click "Generate Icons"
3. Right-click each generated icon and "Save image as..."
4. Save with the correct filenames in this folder

## Icon Specifications

- **Format**: PNG with transparency
- **Color depth**: 32-bit (RGBA)
- **Background**: Transparent or solid color
- **Style**: Modern, flat design with subtle gradients
- **Visibility**: High contrast for both light and dark themes