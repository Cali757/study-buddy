import os
import re
from pathlib import Path

# Define the mapping of Stitch UI pages to app routes
UI_MAPPING = {
    "study_buddy_landing_page": "app/stitch",
    "study_buddy_dashboard": "app/dashboard",
    "study_buddy_login": "app/login",
    "study_buddy_sign_up": "app/signup",
    "study_buddy_settings": "app/settings",
    "study_buddy_notes": "app/notes",
    "study_buddy_quiz_view": "app/quiz",
    "study_buddy_progress_page": "app/progress",
    "study_buddy_onboarding_": "app/onboarding",
    "study_buddy_lesson_view": "app/lesson",
    "study_buddy_ai_q&a": "app/ai-qa",
    "study_buddy_ai_summary": "app/ai-summary",
    "study_buddy_billing_": "app/billing",
    "study_buddy_admin_interface": "app/admin",
}

STITCH_SOURCE = r"C:\Users\pp\Downloads\stitch_study_buddy_landing_page\stitch_study_buddy_landing_page"
PROJECT_ROOT = r"C:\Users\pp\saas-project"

def html_to_jsx(html_content):
    """Convert HTML to JSX format"""
    # Replace class with className
    jsx = re.sub(r'\bclass=', 'className=', html_content)
    
    # Replace for with htmlFor
    jsx = re.sub(r'\bfor=', 'htmlFor=', jsx)
    
    # Fix self-closing tags
    jsx = re.sub(r'<(meta|link|img|input|br|hr)([^>]*?)>', r'<\1\2 />', jsx)
    
    # Remove comments
    jsx = re.sub(r'<!--.*?-->', '', jsx, flags=re.DOTALL)
    
    return jsx

def extract_body_content(html_content):
    """Extract content from body tag"""
    match = re.search(r'<body[^>]*>(.*?)</body>', html_content, re.DOTALL)
    if match:
        return match.group(1).strip()
    return html_content

def extract_styles(html_content):
    """Extract inline styles from head"""
    styles = []
    for match in re.finditer(r'<style[^>]*>(.*?)</style>', html_content, re.DOTALL):
        styles.append(match.group(1).strip())
    return '\n'.join(styles)

def extract_scripts(html_content):
    """Extract script content"""
    scripts = []
    for match in re.finditer(r'<script[^>]*>(.*?)</script>', html_content, re.DOTALL):
        content = match.group(1).strip()
        if content and 'tailwind.config' not in content:
            scripts.append(content)
    return '\n'.join(scripts)

def create_nextjs_component(html_file, output_dir, page_name):
    """Convert HTML file to Next.js component"""
    
    # Read HTML file
    with open(html_file, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    # Extract parts
    body_content = extract_body_content(html_content)
    styles = extract_styles(html_content)
    scripts = extract_scripts(html_content)
    
    # Convert to JSX
    jsx_content = html_to_jsx(body_content)
    
    # Create component
    component = f'''export default function {page_name}() {{
  return (
    <>
      <style jsx global>{{\`
        {styles}
      \`}}</style>
      {jsx_content}
    </>
  );
}}
'''
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Write component file
    output_file = os.path.join(output_dir, 'page.tsx')
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(component)
    
    print(f"✓ Created: {output_file}")
    return output_file

def main():
    """Main conversion function"""
    print("Starting UI conversion...")
    print(f"Source: {STITCH_SOURCE}")
    print(f"Target: {PROJECT_ROOT}")
    print("-" * 60)
    
    converted_count = 0
    
    for stitch_folder, app_route in UI_MAPPING.items():
        html_file = os.path.join(STITCH_SOURCE, stitch_folder, "code.html")
        output_dir = os.path.join(PROJECT_ROOT, app_route)
        
        if not os.path.exists(html_file):
            print(f"✗ Not found: {html_file}")
            continue
        
        # Generate component name from folder
        page_name = ''.join(word.capitalize() for word in stitch_folder.replace('_', ' ').split())
        page_name = page_name.replace('&', 'And').replace(' ', '')
        
        try:
            create_nextjs_component(html_file, output_dir, page_name)
            converted_count += 1
        except Exception as e:
            print(f"✗ Error converting {stitch_folder}: {e}")
    
    print("-" * 60)
    print(f"Conversion complete! {converted_count}/{len(UI_MAPPING)} pages converted.")

if __name__ == "__main__":
    main()
