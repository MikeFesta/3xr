# SPDX-License-Identifier: Apache-2.0
import sys
import requests

uid = sys.argv[1]
filename = sys.argv[2]
print('Uploading ' + filename + ' for ' + uid)

url = 'https://x.3xr.com/upload/product_additional_files'
files = {'files': open(filename, 'rb')}
data = {
  'uid': uid
}

response = requests.post(url, data=data, files=files)
if (response.ok == False):
  print('Error uploading file')
  print(response)
else:
  print('File uploaded')
