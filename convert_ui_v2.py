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
    "study_buddy_lesson_view": "app/lesson",
    "study_buddy_ai_q&a": "app/ai-qa",
    "study_buddy_ai_summary": "app/ai-summary",
    "study_buddy_admin_interface": "app/admin",
}

STITCH_SOURCE = r"C:\Users\pp\Downloads\stitch_study_buddy_landing_page\stitch_study_buddy_landing_page"
PROJECT_ROOT = r"C:\Users\pp\saas-project"

def html_to_jsx(html_content):
    """Convert HTML attributes to JSX format"""
    # Replace class with className
    jsx = re.sub(r'\bclass=', 'className=', html_content)
    
    # Replace for with htmlFor
    jsx = re.sub(r'\bfor=', 'htmlFor=', jsx)
    
    # Fix self-closing tags that aren't properly closed
    jsx = re.sub(r'<(meta|link|img|input|br|hr)([^>]*?)(?<!/)>', r'<\1\2 />', jsx)
    
    return jsx

def extract_body_content(html_content):
    """Extract content from body tag"""
    match = re.search(r'<body[^>]*>(.*?)</body>', html_content, re.DOTALL)
    if match:
        return match.group(1).strip()
    return html_content

def extract_head_content(html_content):
    """Extract necessary head content (fonts, tailwind, etc.)"""
    head_parts = []
    
    # Extract Google Fonts
    for match in re.finditer(r'<link[^>]*fonts\.googleapis[^>]*>', html_content):
        head_parts.append(match.group(0))
    
    # Extract Tailwind script
    for match in re.finditer(r'<script[^>]*tailwindcss[^>]*></script>', html_content):
        head_parts.append(match.group(0))
    
    # Extract tailwind config
    for match in re.finditer(r'<script[^>]*tailwind-config[^>]*>.*?</script>', html_content, re.DOTALL):
        head_parts.append(match.group(0))
    
    return '\n'.join(head_parts)

def extract_styles(html_content):
    """Extract inline styles from head"""
    styles = []
    for match in re.finditer(r'<style[^>]*>(.*?)</style>', html_content, re.DOTALL):
        styles.append(match.group(1).strip())
    return '\n'.join(styles)

def create_nextjs_component_v2(html_file, output_dir, page_name):
    """Convert HTML file to Next.js component using dangerouslySetInnerHTML approach"""
    
    # Read HTML file
    with open(html_file, 'r', encoding='utf-8'):
        html_content = f.read()
    
    # Extract parts
    body_content = extract_body_content(html_content)
    head_content = extract_head_content(html_content)
    styles = extract_styles(html_content)
    
    # Convert to JSX
    jsx_body = html_to_jsx(body_content)
    
    # Create component with proper Next.js structure
    component = f'''import Script from 'next/script';

export default function {page_name}() {{
  return (
    <>
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      
      {/* Tailwind CSS */}
      <Script src="https://cdn.tailwindcss.com?plugins=forms,container-queries" strategy="beforeInteractive" />
      
      {/* Tailwind Config */}
      <Script id="tailwind-config" strategy="beforeInteractive">
        {{`
          tailwind.config = {{
            darkMode: "class",
            theme: {{
              extend: {{
                colors: {{
                  "primary": "#0d59f2",
                  "background-light": "#f5f6f8",
                  "background-dark": "#101622",
                  "surface-dark": "#1a2332",
                  "surface-light": "#ffffff",
                }},
                fontFamily: {{
                  "display": ["Space Grotesk", "sans-serif"],
                  "sans": ["Space Grotesk", "sans-serif"],
                }},
                borderRadius: {{"DEFAULT": "1rem", "lg": "2rem", "xl": "3rem", "full": "9999px"}},
              }},
            }},
          }}
        `}}
      </Script>
      
      {/* Custom Styles */}
      <style jsx global>{{`
        {styles}
      `}}</style>
      
      {/* Page Content */}
      <div dangerouslySetInnerHTML={{{{ __html: `{jsx_body.replace('`', '\\`')}` }}}} />
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
    print("Starting UI conversion (v2 - using dangerouslySetInnerHTML)...")
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
            create_nextjs_component_v2(html_file, output_dir, page_name)
            converted_count += 1
        except Exception as e:
            print(f"✗ Error converting {stitch_folder}: {e}")
    
    # Handle onboarding and billing with subfolders
    special_pages = [
        ("study_buddy_onboarding_/_setup", "app/onboarding", "StudyBuddyOnboarding"),
        ("study_buddy_billing_/_subscription", "app/billing", "StudyBuddyBilling"),
    ]
    
    for folder_path, app_route, component_name in special_pages:
        html_file = os.path.join(STITCH_SOURCE, folder_path, "code.html")
        output_dir = os.path.join(PROJECT_ROOT, app_route)
        
        if os.path.exists(html_file):
            try:
                create_nextjs_component_v2(html_file, output_dir, component_name)
                converted_count += 1
            except Exception as e:
                print(f"✗ Error converting {folder_path}: {e}")
    
    print("-" * 60)
    print(f"Conversion complete! {converted_count} pages converted.")

if __name__ == "__main__":
    main()
