import csv,json
from sortedcontainers import SortedDict

csvfile = open('tlds_parsed_dates.csv','rb')
tlds = csv.DictReader(csvfile)

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
		"iana_url":t['iana_url']
	}
	for y in years:
		if y == reg[0]:
			obj[reg[0]].append(domain_obj)

obj = SortedDict(obj)

with open('tlds-by-year.json', 'w') as outfile:
    json.dump(obj, outfile)