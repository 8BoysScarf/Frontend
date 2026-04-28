
import sys

def check_balance(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    tags = []
    i = 0
    while i < len(content):
        if content[i] == '<':
            if content[i:i+4] == '<!--':
                i = content.find('-->', i) + 3
                continue
            
            end = content.find('>', i)
            if end == -1: break
            
            tag_content = content[i+1:end].strip()
            if not tag_content: 
                i = end + 1
                continue
            
            # Self closing
            if tag_content.endswith('/') or tag_content.split()[0].lower() in ['img', 'br', 'hr', 'input', 'meta', 'link']:
                i = end + 1
                continue
            
            # Closing tag
            if tag_content.startswith('/'):
                name = tag_content[1:].strip().lower()
                if not tags:
                    print(f"Extra closing tag: </{name}> at index {i}")
                else:
                    last = tags.pop()
                    if last != name:
                        print(f"Mismatched tag: <{last}> closed by </{name}> at index {i}")
            else:
                name = tag_content.split()[0].lower()
                tags.append(name)
            
            i = end + 1
        else:
            i += 1
            
    if tags:
        print(f"Unclosed tags: {tags}")
    else:
        print("All tags balanced!")

if __name__ == "__main__":
    check_balance(sys.argv[1])
