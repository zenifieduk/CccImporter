import json
import re
import os
from tqdm import tqdm

# Get the directory where the script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
# Assumes script is in a directory like 'src' and the workspace root is one level up
WORKSPACE_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, '..'))

def load_geocoded_data(file_path):
    """Load the geocoded JSON data."""
    with open(file_path, 'r', encoding='utf-8') as file:
        return json.load(file)

def update_clubs_orig_js(orig_js_path, geocoded_data):
    """
    Update the clubs-orig.js file with geocoded coordinates.
    This preserves all existing structure and formatting.
    """
    # Read the original file
    with open(orig_js_path, 'r', encoding='utf-8') as file:
        orig_content = file.read()
    
    # Create a copy for backup
    backup_path = orig_js_path + '.backup'
    with open(backup_path, 'w', encoding='utf-8') as file:
        file.write(orig_content)
    print(f"Created backup at {backup_path}")
    
    # Build a lookup dictionary of coordinates by title (and/or slug)
    # We'll use both title and slug to maximize matching chances
    coords_by_title = {}
    coords_by_slug = {}
    coords_by_titleslug = {}  # Combined key: title + slug
    
    for club in geocoded_data:
        if 'lat' in club and 'lng' in club:
            if 'title' in club:
                coords_by_title[club['title']] = (club['lat'], club['lng'])
            if 'slug' in club:
                coords_by_slug[club['slug']] = (club['lat'], club['lng'])
            if 'title' in club and 'slug' in club:
                key = f"{club['title']}|{club['slug']}"
                coords_by_titleslug[key] = (club['lat'], club['lng'])
    
    # Process the original file line by line
    updated_lines = []
    current_club = {}
    in_club_block = False
    insertion_point = None
    
    # Get line breaks used in the file (Windows or Unix)
    line_break = '\r\n' if '\r\n' in orig_content else '\n'
    
    lines = orig_content.split(line_break)
    
    for i, line in enumerate(lines):
        # Check if we're starting a new club object
        if re.search(r'^\s*{', line) and (i == 0 or '},' in lines[i-1] or '},\s*$' in lines[i-1]):
            in_club_block = True
            current_club = {}
            insertion_point = None
        
        # If we're in a club block, extract relevant info
        if in_club_block:
            # Extract title
            title_match = re.search(r'title:\s*"([^"]+)"', line)
            if title_match:
                current_club['title'] = title_match.group(1)
            
            # Extract slug
            slug_match = re.search(r'slug:\s*"([^"]+)"', line)
            if slug_match:
                current_club['slug'] = slug_match.group(1)
            
            # Check if line contains closing bracket for the club object
            if '},' in line or '},\s*$' in line:
                in_club_block = False
                
                # Now try to match with coordinates
                coords = None
                
                # Try matching by title+slug
                if 'title' in current_club and 'slug' in current_club:
                    key = f"{current_club['title']}|{current_club['slug']}"
                    if key in coords_by_titleslug:
                        coords = coords_by_titleslug[key]
                
                # Try matching by title
                if coords is None and 'title' in current_club and current_club['title'] in coords_by_title:
                    coords = coords_by_title[current_club['title']]
                
                # Try matching by slug
                if coords is None and 'slug' in current_club and current_club['slug'] in coords_by_slug:
                    coords = coords_by_slug[current_club['slug']]
                
                # If we have coordinates and an insertion point, insert them
                if coords is not None and insertion_point is not None:
                    lat, lng = coords
                    
                    # Check if the club already has coordinates
                    has_lat = any('lat:' in l for l in lines[insertion_point:i])
                    has_lng = any('lng:' in l for l in lines[insertion_point:i])
                    
                    if not has_lat and not has_lng:
                        # Get the indentation level from the closing line
                        indentation = re.match(r'(\s*)', lines[i]).group(1)
                        
                        # Insert coordinates before the closing bracket
                        lat_line = f"{indentation}lat: {lat},"
                        lng_line = f"{indentation}lng: {lng},"
                        
                        updated_lines.append(lat_line)
                        updated_lines.append(lng_line)
                    
            
            # Find a good insertion point (usually after the last attribute before closing)
            if re.search(r'\w+:\s*("|true|false|\d)', line) and not 'lat:' in line and not 'lng:' in line:
                insertion_point = i
        
        # Add the original line
        updated_lines.append(line)
    
    # Write the updated content
    updated_content = line_break.join(updated_lines)
    
    with open(orig_js_path, 'w', encoding='utf-8') as file:
        file.write(updated_content)
    
    print(f"Updated {orig_js_path} with coordinates")

def main():
    # Paths are now relative to the WORKSPACE_ROOT
    geocoded_path = os.path.join(WORKSPACE_ROOT, "_site", "clubs_with_coordinates.json")
    orig_js_path = os.path.join(WORKSPACE_ROOT, "src", "_data", "clubs-orig.js")
    
    # Check if both files exist
    if not os.path.exists(geocoded_path):
        print(f"Error: {geocoded_path} not found. Please ensure the geocoded file is at _site/clubs_with_coordinates.json relative to your workspace root.")
        return
    
    if not os.path.exists(orig_js_path):
        print(f"Error: {orig_js_path} not found. Please ensure the original clubs data file is at src/_data/clubs-orig.js relative to your workspace root.")
        return
    
    # Load geocoded data
    geocoded_data = load_geocoded_data(geocoded_path)
    print(f"Loaded {len(geocoded_data)} clubs with coordinates from {geocoded_path}")
    
    # Update clubs-orig.js
    update_clubs_orig_js(orig_js_path, geocoded_data)
    
    print(f"Done! The source file {orig_js_path} should be updated.")
    print("You should now be able to rebuild your site with the updated coordinates.")

if __name__ == "__main__":
    main()