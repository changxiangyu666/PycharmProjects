import requests
from bs4 import BeautifulSoup

content = requests.get('http://www.ityouknow.com').content
soup = BeautifulSoup(content,'html.parser')

for div in soup.find_all('div', {'class':'container'}):
    print div.text.strip()