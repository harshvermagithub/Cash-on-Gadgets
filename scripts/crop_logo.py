import os
from PIL import Image

def crop_and_update():
    img_path = 'public/icon.png'
    if not os.path.exists(img_path):
        print(f"Error: {img_path} not found")
        return
        
    img = Image.open(img_path).convert('RGBA')
    width, height = img.size
    
    # Read background color directly from top-left pixel
    bg_r, bg_g, bg_b, bg_a = img.getpixel((0, 0))
    print(f"Detected background color: RGB=({bg_r}, {bg_g}, {bg_b}), Alpha={bg_a}")
    
    tolerance = 45 # allow some variance for antialiasing
    
    left = width
    top = height
    right = 0
    bottom = 0
    
    # Find bounding box of the white/non-green F logo
    for x in range(width):
        for y in range(height):
            r, g, b, a = img.getpixel((x, y))
            dist = ((r - bg_r) ** 2 + (g - bg_g) ** 2 + (b - bg_b) ** 2) ** 0.5
            if dist > tolerance and a > 50:
                if x < left: left = x
                if x > right: right = x
                if y < top: top = y
                if y > bottom: bottom = y
                
    print(f"Detected bounding box: left={left}, top={top}, right={right}, bottom={bottom}")
    
    # Add a small padding (0% for maximum size)
    padding_x = 0
    padding_y = 0
    
    left = max(0, left - padding_x)
    top = max(0, top - padding_y)
    right = min(width, right + padding_x)
    bottom = min(height, bottom + padding_y)
    
    # Crop the image to the F logo bounds
    cropped = img.crop((left, top, right, bottom))
    
    # Create a new square image with the exact same green background color
    w_new, h_new = cropped.size
    square_size = max(w_new, h_new)
    
    square_img = Image.new('RGBA', (square_size, square_size), (bg_r, bg_g, bg_b, 255))
    # Paste cropped image into center
    offset_x = (square_size - w_new) // 2
    offset_y = (square_size - h_new) // 2
    square_img.paste(cropped, (offset_x, offset_y), cropped)
    
    # Resize to a clean 128x128 for base64 optimization
    resized = square_img.resize((128, 128), Image.Resampling.LANCZOS)
    
    # Save the new cropped icon
    output_path = 'public/icon_cropped.png'
    resized.save(output_path, 'PNG')
    print(f"Saved cropped icon to {output_path}")
    
    # Generate Base64
    import base64
    with open(output_path, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
        
    base64_data_uri = f"data:image/png;base64,{encoded_string}"
    
    # Save to text files
    with open('public/icon_base64.txt', 'w') as f:
        f.write(base64_data_uri)
    print("Updated public/icon_base64.txt")
    
    # Write to LogoConstants.ts
    constants_path = 'components/icons/LogoConstants.ts'
    with open(constants_path, 'r') as f:
        content = f.read()
        
    # Replace ICON_BASE64 value
    import re
    new_content = re.sub(
        r'export const ICON_BASE64 = "[^"]+";',
        f'export const ICON_BASE64 = "{base64_data_uri}";',
        content
    )
    
    with open(constants_path, 'w') as f:
        f.write(new_content)
    print(f"Updated {constants_path}")

if __name__ == '__main__':
    crop_and_update()
