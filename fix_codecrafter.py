
import sys

def fix_file():
    path = r'c:\Users\rajde\Desktop\TECH-VERSE\frontend\src\pages\CodeCrafter.tsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix the Chinese typo
    content = content.replace('flex-1相对', 'flex-1 relative')
    
    # Fix the mismatched tags by replacing the whole problematic section
    # The user added redundant closing tags at Step 230/231.
    
    # Let's try to find the specific block and normalize it.
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed potential typos.")

if __name__ == '__main__':
    fix_file()
