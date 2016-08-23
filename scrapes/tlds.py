from bs4 import BeautifulSoup
import urllib, csv

soup = BeautifulSoup(urllib.urlopen("http://www.iana.org/domains/root/db"))

tr = soup.find_all("tr")

csvfile = open('tlds_no_dates.csv','a')
c = csv.writer(csvfile)

c.writerow(['name','type','sponsoring_org','iana_url'])

for t in tr:
	td = t.find_all('td')
	if td:
		tld_type = td[1].getText()
		tlds = t.find("span", {"class":"domain tld"})
		if tlds:
			name = tlds.getText().encode('utf-8')
			href = tlds.find('a')
			# src = BeautifulSoup(urllib.urlopen("http://www.iana.org"+href['href']))
			spons = td[2].getText().encode('utf-8')
			# reg = src.find_all('i')[-1].getText()
			c.writerow([name,tld_type,spons,"https://www.iana.org"+href['href']])
			print 'added '+ name