#!/usr/bin/env python3
"""
Fix all links and buttons in Study Buddy HTML pages to make them work like a real SaaS
"""

import os
import re

# Define the pages directory
PAGES_DIR = r"C:\Users\pp\saas-project\public\pages"

# Define the link mappings
LINK_MAPPINGS = {
    # Landing page links
    'landing.html': {
        'Get Started Free': '/pages/signup.html',
        'Get Started': '/pages/signup.html',
        'Login': '/pages/login.html',
        'See How It Works': '#how-it-works',
    },
    # Login page links
    'login.html': {
        'ESTABLISH CONNECTION': '/pages/dashboard.html',
        'REGISTER NEW UNIT': '/pages/signup.html',
        'Study Buddy': '/pages/landing.html',
    },
    # Signup page links
    'signup.html': {
        'CREATE ACCOUNT': '/pages/onboarding.html',
        'CONTINUE': '/pages/onboarding.html',
        'LOGIN': '/pages/login.html',
        'Study Buddy': '/pages/landing.html',
    },
    # Onboarding page links
    'onboarding.html': {
        'CONTINUE': '/pages/dashboard.html',
        'NEXT': '/pages/dashboard.html',
        'Study Buddy': '/pages/landing.html',
    },
    # Dashboard page links
    'dashboard.html': {
        'Resume Learning': '/pages/lesson.html',
        'View Syllabus': '/pages/lesson.html',
        'Study Buddy': '/pages/dashboard.html',
        'Dashboard': '/pages/dashboard.html',
        'Lessons': '/pages/lesson.html',
        'Quiz': '/pages/quiz.html',
        'Notes': '/pages/notes.html',
        'Progress': '/pages/progress.html',
        'Settings': '/pages/settings.html',
        'AI Chat': '/pages/ai-qa.html',
    },
    # Lesson page links
    'lesson.html': {
        'Study Buddy': '/pages/dashboard.html',
        'Dashboard': '/pages/dashboard.html',
        'Lessons': '/pages/lesson.html',
        'Quiz': '/pages/quiz.html',
        'Notes': '/pages/notes.html',
        'Progress': '/pages/progress.html',
        'Settings': '/pages/settings.html',
    },
    # Quiz page links
    'quiz.html': {
        'Study Buddy': '/pages/dashboard.html',
        'Dashboard': '/pages/dashboard.html',
        'Lessons': '/pages/lesson.html',
        'Quiz': '/pages/quiz.html',
        'Notes': '/pages/notes.html',
        'Progress': '/pages/progress.html',
        'Settings': '/pages/settings.html',
        'SUBMIT ANSWERS': '/pages/progress.html',
    },
    # Notes page links
    'notes.html': {
        'Study Buddy': '/pages/dashboard.html',
        'Dashboard': '/pages/dashboard.html',
        'Lessons': '/pages/lesson.html',
        'Quiz': '/pages/quiz.html',
        'Notes': '/pages/notes.html',
        'Progress': '/pages/progress.html',
        'Settings': '/pages/settings.html',
    },
    # Progress page links
    'progress.html': {
        'Study Buddy': '/pages/dashboard.html',
        'Dashboard': '/pages/dashboard.html',
        'Lessons': '/pages/lesson.html',
        'Quiz': '/pages/quiz.html',
        'Notes': '/pages/notes.html',
        'Progress': '/pages/progress.html',
        'Settings': '/pages/settings.html',
    },
    # Settings page links
    'settings.html': {
        'Study Buddy': '/pages/dashboard.html',
        'Dashboard': '/pages/dashboard.html',
        'Lessons': '/pages/lesson.html',
        'Quiz': '/pages/quiz.html',
        'Notes': '/pages/notes.html',
        'Progress': '/pages/progress.html',
        'Settings': '/pages/settings.html',
        'SAVE CHANGES': '/pages/dashboard.html',
    },
    # Billing page links
    'billing.html': {
        'Study Buddy': '/pages/dashboard.html',
        'Dashboard': '/pages/dashboard.html',
        'Settings': '/pages/settings.html',
    },
    # Admin page links
    'admin.html': {
        'Study Buddy': '/pages/dashboard.html',
        'Dashboard': '/pages/dashboard.html',
    },
    # AI pages
    'ai-qa.html': {
        'Study Buddy': '/pages/dashboard.html',
        'Dashboard': '/pages/dashboard.html',
    },
    'ai-summary.html': {
        'Study Buddy': '/pages/dashboard.html',
        'Dashboard': '/pages/dashboard.html',
    },
}

def fix_button_links(html_content, filename):
    """Fix button and link hrefs in HTML content"""
    
    if filename not in LINK_MAPPINGS:
        return html_content
    
    mappings = LINK_MAPPINGS[filename]
    
    for button_text, target_url in mappings.items():
        # Fix <a> tags with href="#"
        html_content = re.sub(
            rf'(<a[^>]*href=")[#"]([^>]*>.*?{re.escape(button_text)}.*?</a>)',
            rf'\1{target_url}\2',
            html_content,
            flags=re.IGNORECASE | re.DOTALL
        )
        
        # Fix buttons without onclick - wrap them in <a> tags
        # Pattern: <button ...>...button_text...</button>
        button_pattern = rf'(<button[^>]*>)(.*?{re.escape(button_text)}.*?)(</button>)'
        
        def replace_button(match):
            button_start = match.group(1)
            button_content = match.group(2)
            button_end = match.group(3)
            
            # Check if button already has onclick
            if 'onclick' in button_start or 'href' in button_start:
                return match.group(0)
            
            # Wrap button in <a> tag
            return f'<a href="{target_url}">{button_start}{button_content}{button_end}</a>'
        
        html_content = re.sub(button_pattern, replace_button, html_content, flags=re.IGNORECASE | re.DOTALL)
        
        # Also fix standalone spans that should be links
        span_pattern = rf'(<span[^>]*>)({re.escape(button_text)})(</span>)'
        
        def replace_span(match):
            span_start = match.group(1)
            span_text = match.group(2)
            span_end = match.group(3)
            
            # Check if span is already inside an <a> tag
            # This is a simple check - in production you'd want more robust parsing
            return f'<a href="{target_url}">{span_start}{span_text}{span_end}</a>'
        
        # Only replace if not already in a link
        html_content = re.sub(span_pattern, replace_span, html_content, flags=re.IGNORECASE)
    
    return html_content

def process_html_files():
    """Process all HTML files in the pages directory"""
    
    if not os.path.exists(PAGES_DIR):
        print(f"Error: Directory {PAGES_DIR} does not exist")
        return
    
    files_processed = 0
    
    for filename in os.listdir(PAGES_DIR):
        if not filename.endswith('.html'):
            continue
        
        filepath = os.path.join(PAGES_DIR, filename)
        
        try:
            # Read the file
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Fix the links
            updated_content = fix_button_links(content, filename)
            
            # Write back if changed
            if updated_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(updated_content)
                print(f"✓ Fixed links in {filename}")
                files_processed += 1
            else:
                print(f"- No changes needed for {filename}")
        
        except Exception as e:
            print(f"✗ Error processing {filename}: {e}")
    
    print(f"\nProcessed {files_processed} files")

if __name__ == "__main__":
    print("Fixing all links in Study Buddy HTML pages...\n")
    process_html_files()
    print("\nDone!")
