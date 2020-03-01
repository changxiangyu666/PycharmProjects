#-*- encoding=UTF-8 -*-
import requests
from bs4 import BeautifulSoup

content = requests.get('http://www.yicommunity.com/').content
soup=BeautifulSoup(content, 'html.parser')

for div in soup.find_all('div', {'class':'content'}):
    print div.text.strip()
