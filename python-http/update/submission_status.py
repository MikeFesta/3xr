# SPDX-License-Identifier: Apache-2.0
# Set the status for an asset submission
import requests
import sys

id = sys.argv[1]
statusId = sys.argv[2]

url = 'https://www.3xr.com/a/asset/set_submission_status'
data = {
  'id': id,
  'statusId': statusId,
}
response = requests.post(url, data=data)
if (response.ok == False):
  print('Error Setting Asset Status ID')
else:
  print('Submission ' + id + ' Status Set to ' + statusId)
