#!/usr/bin/env python3
"""
MJ STUDIO DESIGN - IMAGE OPTIMIZATION SCRIPT
=============================================
Converts BMP images to WebP and JPEG formats
Optimizes file sizes for web performance
"""

import os
import sys
from pathlib import Path
from PIL import Image
import shutil

# Configuration
CONFIG = {
    'source_folder': 'Mona.J _Studio Design',
    'output_folder': 'images/portfolio',
    'webp_quality': 85,  # 0-100 (85 is great quality, much smaller size)
    'jpeg_quality': 90,  # 0-100 (90 is high quality)
    'max_width': 1920,   # Maximum width for images
    'thumbnail_size': (600, 450),  # For thumbnails
}

# Stats
stats = {
    'converted': 0,
    'errors': 0,
    'original_size': 0,
    'optimized_size': 0,
}

def get_file_size(filepath):
    """Get file size in bytes"""
    return os.path.getsize(filepath)

def format_size(bytes):
    """Format bytes to human-readable size"""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if bytes < 1024.0:
            return f"{bytes:.2f} {unit}"
        bytes /= 1024.0
    return f"{bytes:.2f} TB"

def optimize_image(input_path, output_base, filename):
    """
    Convert and optimize a single image
    Creates both WebP and JPEG versions
    """
    try:
        # Open image
        with Image.open(input_path) as img:
            # Convert RGBA to RGB if necessary
            if img.mode in ('RGBA', 'LA', 'P'):
                background = Image.new('RGB', img.size, (255, 255, 255))
                background.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
                img = background
            elif img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Get original size
            original_size = get_file_size(input_path)
            stats['original_size'] += original_size
            
            # Resize if too large
            if img.width > CONFIG['max_width']:
                ratio = CONFIG['max_width'] / img.width
                new_height = int(img.height * ratio)
                img = img.resize((CONFIG['max_width'], new_height), Image.Resampling.LANCZOS)
            
            # Create base filename (without extension)
            base_name = Path(filename).stem
            
            # Save as WebP (smaller, modern format)
            webp_path = output_base / f"{base_name}.webp"
            img.save(webp_path, 'WEBP', quality=CONFIG['webp_quality'], method=6)
            webp_size = get_file_size(webp_path)
            stats['optimized_size'] += webp_size
            
            # Save as JPEG (fallback for older browsers)
            jpeg_path = output_base / f"{base_name}.jpg"
            img.save(jpeg_path, 'JPEG', quality=CONFIG['jpeg_quality'], optimize=True)
            jpeg_size = get_file_size(jpeg_path)
            stats['optimized_size'] += jpeg_size
            
            # Create thumbnail
            thumb_img = img.copy()
            thumb_img.thumbnail(CONFIG['thumbnail_size'], Image.Resampling.LANCZOS)
            
            thumb_webp = output_base / f"{base_name}_thumb.webp"
            thumb_img.save(thumb_webp, 'WEBP', quality=CONFIG['webp_quality'])
            
            thumb_jpeg = output_base / f"{base_name}_thumb.jpg"
            thumb_img.save(thumb_jpeg, 'JPEG', quality=CONFIG['jpeg_quality'], optimize=True)
            
            # Calculate savings
            savings = ((original_size - webp_size) / original_size) * 100
            
            print(f"  ✓ {filename}")
            print(f"    Original: {format_size(original_size)}")
            print(f"    WebP: {format_size(webp_size)} ({savings:.1f}% smaller)")
            print(f"    JPEG: {format_size(jpeg_size)}")
            
            stats['converted'] += 1
            return True
            
    except Exception as e:
        print(f"  ✗ ERROR converting {filename}: {str(e)}")
        stats['errors'] += 1
        return False

def process_folder(source_folder, category_name):
    """Process all images in a folder"""
    source_path = Path(source_folder)
    
    if not source_path.exists():
        print(f"⚠️  Folder not found: {source_folder}")
        return
    
    # Create output directory
    output_base = Path(CONFIG['output_folder']) / category_name.lower().replace(' ', '-')
    output_base.mkdir(parents=True, exist_ok=True)
    
    print(f"\n📁 Processing: {source_folder}")
    print(f"   Category: {category_name}")
    print(f"   Output: {output_base}")
    print(f"   {'─' * 50}")
    
    # Find all image files
    image_extensions = ['.bmp', '.jpg', '.jpeg', '.png']
    image_files = []
    
    for ext in image_extensions:
        image_files.extend(source_path.glob(f'*{ext}'))
        image_files.extend(source_path.glob(f'*{ext.upper()}'))
    
    if not image_files:
        print(f"   No images found")
        return
    
    print(f"   Found {len(image_files)} images\n")
    
    # Process each image
    for img_file in image_files:
        optimize_image(img_file, output_base, img_file.name)

def main():
    """Main execution"""
    print("=" * 60)
    print("  MJ STUDIO DESIGN - IMAGE OPTIMIZATION")
    print("  Converting BMP → WebP + JPEG")
    print("=" * 60)
    
    # Check if PIL/Pillow is installed
    try:
        from PIL import Image
    except ImportError:
        print("\n❌ ERROR: Pillow library not installed!")
        print("\nTo install: pip install Pillow")
        print("Then run this script again.")
        sys.exit(1)
    
    # Check if source folder exists
    source_base = Path(CONFIG['source_folder'])
    if not source_base.exists():
        print(f"\n❌ ERROR: Source folder not found!")
        print(f"   Looking for: {source_base.absolute()}")
        print("\n   Make sure 'Mona.J _Studio Design' folder is in the same directory as this script.")
        sys.exit(1)
    
    print(f"\n✓ Source folder found: {source_base.absolute()}")
    
    # Create output directory
    output_dir = Path(CONFIG['output_folder'])
    output_dir.mkdir(parents=True, exist_ok=True)
    print(f"✓ Output folder: {output_dir.absolute()}")
    
    print(f"\n📋 Configuration:")
    print(f"   WebP Quality: {CONFIG['webp_quality']}%")
    print(f"   JPEG Quality: {CONFIG['jpeg_quality']}%")
    print(f"   Max Width: {CONFIG['max_width']}px")
    print(f"   Thumbnail Size: {CONFIG['thumbnail_size']}")
    
    # Define project categories
    categories = {
        'Salon 1': 'Living Room - Salon',
        'Séjour': 'Living Room - Séjour',
        'Salon 1/Salon ,salle a manger et entrée': 'Dining & Entrance',
        'Chambre parents': 'Bedroom - Master Suite',
        'Chambre parents 2': 'Bedroom - Parents Suite 2',
        'Salle d \'eau': 'Bathroom',
    }
    
    print("\n" + "=" * 60)
    print("  STARTING CONVERSION")
    print("=" * 60)
    
    # Process each category
    for folder, category in categories.items():
        folder_path = source_base / folder
        if folder_path.exists():
            process_folder(folder_path, category)
        else:
            print(f"\n⚠️  Skipping: {folder} (not found)")
    
    # Print summary
    print("\n" + "=" * 60)
    print("  CONVERSION COMPLETE")
    print("=" * 60)
    print(f"\n✓ Images converted: {stats['converted']}")
    print(f"✗ Errors: {stats['errors']}")
    
    if stats['original_size'] > 0:
        total_savings = ((stats['original_size'] - stats['optimized_size']) / stats['original_size']) * 100
        print(f"\n📊 Size Reduction:")
        print(f"   Original: {format_size(stats['original_size'])}")
        print(f"   Optimized: {format_size(stats['optimized_size'])}")
        print(f"   Savings: {total_savings:.1f}% smaller!")
    
    print(f"\n📁 Output folder: {Path(CONFIG['output_folder']).absolute()}")
    print("\n✨ Your images are now web-ready!")
    print("\nNext steps:")
    print("1. Check the images/portfolio folder")
    print("2. Update work.html to use the new images")
    print("3. Refresh your website to see the optimized images")
    print("\n" + "=" * 60)

if __name__ == "__main__":
    main()

