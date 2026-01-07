import os
import shutil

# Paths
STITCH_SOURCE = r"C:\Users\pp\Downloads\stitch_study_buddy_landing_page\stitch_study_buddy_landing_page"
PUBLIC_DIR = r"C:\Users\pp\saas-project\public"
APP_DIR = r"C:\Users\pp\saas-project\app"

# Create public/pages directory
pages_dir = os.path.join(PUBLIC_DIR, "pages")
os.makedirs(pages_dir, exist_ok=True)

# Mapping of folders to page names
PAGE_MAPPING = {
    "study_buddy_landing_page": "landing",
    "study_buddy_dashboard": "dashboard",
    "study_buddy_login": "login",
    "study_buddy_sign_up": "signup",
    "study_buddy_settings": "settings",
    "study_buddy_notes": "notes",
    "study_buddy_quiz_view": "quiz",
    "study_buddy_progress_page": "progress",
    "study_buddy_lesson_view": "lesson",
    "study_buddy_ai_q&a": "ai-qa",
    "study_buddy_ai_summary": "ai-summary",
    "study_buddy_admin_interface": "admin",
}

# Copy HTML files to public/pages
print("Copying HTML files to public/pages...")
for folder, page_name in PAGE_MAPPING.items():
    html_file = os.path.join(STITCH_SOURCE, folder, "code.html")
    if os.path.exists(html_file):
        dest_file = os.path.join(pages_dir, f"{page_name}.html")
        shutil.copy2(html_file, dest_file)
        print(f"✓ Copied: {page_name}.html")

# Handle special folders with subfolders
special_pages = [
    ("study_buddy_onboarding_/_setup", "onboarding"),
    ("study_buddy_billing_/_subscription", "billing"),
]

for folder_path, page_name in special_pages:
    html_file = os.path.join(STITCH_SOURCE, folder_path, "code.html")
    if os.path.exists(html_file):
        dest_file = os.path.join(pages_dir, f"{page_name}.html")
        shutil.copy2(html_file, dest_file)
        print(f"✓ Copied: {page_name}.html")

# Create redirect components for each page
print("\nCreating redirect components...")

REDIRECT_TEMPLATE = '''"use client";

import {{ useEffect }} from 'react';

export default function {component_name}() {{
  useEffect(() => {{
    window.location.href = '/pages/{page_name}.html';
  }}, []);
  
  return (
    <div style={{{{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: '#101622',
      color: 'white'
    }}}}>
      <p>Loading...</p>
    </div>
  );
}}
'''

for folder, page_name in PAGE_MAPPING.items():
    component_name = ''.join(word.capitalize() for word in page_name.split('-'))
    component_code = REDIRECT_TEMPLATE.format(
        component_name=component_name,
        page_name=page_name
    )
    
    # Determine the app route
    if page_name == "landing":
        route_dir = os.path.join(APP_DIR, "stitch")
    else:
        route_dir = os.path.join(APP_DIR, page_name)
    
    os.makedirs(route_dir, exist_ok=True)
    page_file = os.path.join(route_dir, "page.tsx")
    
    with open(page_file, 'w') as f:
        f.write(component_code)
    print(f"✓ Created redirect: {page_name}")

# Handle special pages
for _, page_name in special_pages:
    component_name = ''.join(word.capitalize() for word in page_name.split('-'))
    component_code = REDIRECT_TEMPLATE.format(
        component_name=component_name,
        page_name=page_name
    )
    
    route_dir = os.path.join(APP_DIR, page_name)
    os.makedirs(route_dir, exist_ok=True)
    page_file = os.path.join(route_dir, "page.tsx")
    
    with open(page_file, 'w') as f:
        f.write(component_code)
    print(f"✓ Created redirect: {page_name}")

print("\n✅ All pages fixed! The app should now work.")
print("Run 'npm run dev' to test.")
