from bs4 import BeautifulSoup
import urllib, csv

tlds = open('tlds_no_dates.csv', 'rb')
tld = csv.DictReader(tlds)

csvfile = open('tlds_add_dates.csv','a')
csvfile_read = open('tlds_add_dates.csv','rb')
c_read = csv.DictReader(csvfile_read)
c = csv.writer(csvfile)

done = []

for cr in c_read:
	done.append(cr['name'])
	# c.writerow([cr['name'],cr['type'],cr['sponsoring_org'],cr['reg_date_and_update'],cr['iana_url']])
for t in tld:
	if t['name'] in done:
		continue
	else:
		done.append(t)
		soup = BeautifulSoup(urllib.urlopen(t['iana_url']))
		reg = soup.find_all('i')[-1].getText()
		c.writerow([t['name'],t['type'],t['sponsoring_org'],reg,t['iana_url']])
		print "added "+ t['name']