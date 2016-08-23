import csv,json

csvfile = open('tlds_add_dates.csv','rb')
tlds = csv.DictReader(csvfile)

newfile = open('tlds_parsed.csv','w')

f = csv.writer(newfile)

f.writerow(['name','type','sponsoring_org','last_updated','registered','iana_url'])

for t in tlds:
	dates = t['dates'].split('.')
	print dates
	if len(dates) > 1:
		# continue
		update = dates[0].replace('Record last updated ','').strip()
		registered = dates[1].replace('Registration date ','').replace('."','').strip()
		f.writerow([t['name'],t['type'],t['sponsoring_org'],update,registered,t['iana_url']])
	else:
		dates = dates[0].strip()
		if dates.startswith('Record'):
			dates = dates.replace('Record last updated ','')
			f.writerow([t['name'],t['type'],t['sponsoring_org'],dates,'',t['iana_url']])
		if dates.startswith('Registered'):
			dates = dates.replace('Registration date ','')
			f.writerow([t['name'],t['type'],t['sponsoring_org'],'',dates,t['iana_url']])