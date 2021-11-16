# SPDX-License-Identifier: Apache-2.0
import sys
import requests

uid = sys.argv[1]
image = sys.argv[2]
print('Uploading ' + image + ' for ' + uid)

url = 'https://x.3xr.com/upload/product_reference_images'
files = {'images': open(image, 'rb')}
data = {
  'uid': uid
}

response = requests.post(url, data=data, files=files)
if (response.ok == False):
  print('Error uploading image')
  print(response)
else:
  print('Image uploaded')
