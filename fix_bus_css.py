from pathlib import Path
path = Path('index.html')
text = path.read_text(encoding='utf-8')
start = text.find(".bus-icon {")
if start == -1:
    raise SystemExit('bus-icon block not found')
end = text.find("}@keyframes drive", start)
if end == -1:
    raise SystemExit('end of bus-icon block not found')
# preserve the closing brace before @keyframes
end = text.rfind('}', start, end) + 1
replacement = '''.bus-icon {
      position: absolute;
      top: 20.59%;
      left: 44.4%;
      width: 10.0%;
      height: 2.6%;
      z-index: 10;
      background-image: url('background.png');
      background-repeat: no-repeat;
      background-size: 975.24% 2293.44%;
      background-position: 63.99% 4.34%;
      animation: drive 1.2s ease-in-out infinite;
    }
'''
new_text = text[:start] + replacement + text[end:]
path.write_text(new_text, encoding='utf-8')
print('updated')
