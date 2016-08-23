import csv,json
from sortedcontainers import SortedDict

csvfile = open('tlds_parsed.csv','rb')
tlds = csv.DictReader(csvfile)

countrycodes = open('country-codes.csv','rb')
cc = csv.DictReader(countrycodes)

cc_list = []

for c in cc:
	obj  = {}
	if c['ISO3166-1-Alpha-2'] is not None:
		obj['iso'] = c['ISO3166-1-Alpha-2']
		obj['name'] = c['name']
		cc_list.append(obj)

years = []
obj = {}

for t in tlds:
	reg = t['registered'].split('-')	
	if reg[0] not in years:
		years.append(reg[0])
		obj[reg[0]] = []
	else:
		pass
	domain_obj = {
		"name": t['name'],
		"type":t['type'],
		"spons":t['sponsoring_org'],
		"registered":t['registered'],
		"updated": t['last_updated'],
		"iana_url":t['iana_url']
	}
	if t['type'] == 'country-code':
		name = t['name'].replace('.','').upper()
		for cc in cc_list:
			if cc['iso'] == name:
				print "match! "+ name
				domain_obj['country_name'] = cc['name']
	else:
		print "nope"
	for y in years:
		if y == reg[0]:
			obj[reg[0]].append(domain_obj)

obj = SortedDict(obj)


with open('tlds-by-year-with-cc.json', 'w') as outfile:
    json.dump(obj, outfile)