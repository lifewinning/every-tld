import csv,json,urllib
from bs4 import BeautifulSoup

csvfile = open('tlds_parsed_dates.csv','rb')
tlds = csv.DictReader(csvfile)

all_the_things = []
for t in tlds:
	nameservers = []
	ips = []
	soup = BeautifulSoup(urllib.urlopen(t['iana_url']))
	table = soup.find('table',{"class":"iana-table"})
	if table:
		tr = table.find_all('tr')
		if tr:
			for row in tr:
				td = row.find_all('td')
				if len(td) == 2:
					nameservers.append(td[0].getText().encode('utf-8'))
					ips.append(td[1].getText().encode('utf-8').split('<br>'))
			newobj = {
				"name": t['name'],
				"type":t['type'],
				"spons":t['sponsoring_org'],
				"registered":t['registered'],
				"iana_url":t['iana_url'],
				"nameservers": nameservers,
				"ip_addresses": ips
			}

		all_the_things.append(newobj)
		print t['name']
with open('nameservers.json', 'w') as outfile:
    json.dump(all_the_things, outfile)