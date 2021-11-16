# SPDX-License-Identifier: Apache-2.0
# Set the status for an asset submission
import requests
import sys

addonVersion = sys.argv[1]
blenderVersion = sys.argv[2]

url = 'https://www.3xr.com/a/addon/insert_version'
data = {
  'addonVersion': addonVersion,
  'blenderVersion': blenderVersion,
}
response = requests.post(url, data=data)
if (response.ok == False):
  print('Error Inserting Add-on Version')
else:
  print('Add-on version set to ' + addonVersion)
