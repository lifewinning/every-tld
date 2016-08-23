from bs4 import BeautifulSoup
import urllib, csv

tlds = open('tlds_parsed.csv', 'rb')
tld = csv.DictReader(tlds)

countrycodes = open('country-codes.csv','rb')
cc = csv.DictReader(countrycodes)

all_the_things = []
cc_list = []

for c in cc:
	obj  = {}
	if c['ISO3166-1-Alpha-2'] is not None:
		obj['iso'] = c['ISO3166-1-Alpha-2']
		obj['name'] = c['name']
		cc_list.append(obj)

for t in tld:
	tld = {
	"name": t['name'],
	"type":t['type'],
	"spons":t['sponsoring_org'],
	"registered":t['registered'],
	"iana_url":t['iana_url']
	}
	if t['type'] == 'country-code':
		name = t['name'].replace('.','').upper()
		for cc in cc_list:
			if cc['iso'] == name:
				print "match! "+ name
				tld['country_name'] = cc['name']
	tld

# with open('tlds.json', 'w') as outfile:
#     json.dump(all_the_things, outfile)