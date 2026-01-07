import re

# Fix signup.html to navigate to onboarding instead of form submission
with open('public/pages/signup.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the form tag to remove POST action
content = re.sub(
    r'<form action="#" class="space-y-5" method="POST">',
    '<form class="space-y-5" onsubmit="return false;">',
    content
)

# Wrap the submit button in an anchor tag to navigate to onboarding
content = re.sub(
    r'<button class="group relative flex w-full justify-center overflow-hidden rounded-lg bg-primary px-4 py-3\.5 text-sm font-bold text-white shadow-lg shadow-primary/30 transition-all hover:bg-blue-600 hover:shadow-primary/50 hover:scale-\[1\.01\] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark" type="submit">',
    '<a href="/pages/onboarding.html"><button class="group relative flex w-full justify-center overflow-hidden rounded-lg bg-primary px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/30 transition-all hover:bg-blue-600 hover:shadow-primary/50 hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark" type="button">',
    content
)

# Close the anchor tag after the button
content = re.sub(
    r'</span>\s*</button>',
    '</span></button></a>',
    content,
    count=1  # Only replace the first occurrence (the submit button)
)

# Fix the "Already have an account? Login" link
content = re.sub(
    r'<a class="font-bold text-primary hover:text-blue-400 hover:underline transition-colors ml-1" href="#">Login</a>',
    '<a class="font-bold text-primary hover:text-blue-400 hover:underline transition-colors ml-1" href="/pages/login.html">Login</a>',
    content
)

with open('public/pages/signup.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('✅ Fixed signup.html - button now navigates to onboarding.html')
print('✅ Fixed "Login" link to navigate to login.html')
