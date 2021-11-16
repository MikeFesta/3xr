# SPDX-License-Identifier: Apache-2.0
# Set the status for an asset submission
import requests
import sys

uid = sys.argv[1]

url = 'https://www.3xr.com/a/asset/set_published'
data = {
  'uid': uid,
}
response = requests.post(url, data=data)
if (response.ok == False):
  print('Error Setting Asset to Published')
  print(data)
  print(response)
else:
  print('Asset ' + uid + ' published')
