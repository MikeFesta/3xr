# SPDX-License-Identifier: Apache-2.0
# Queue a new rabbit message
import json
import requests
import sys

queue = sys.argv[1]
print('Sending rabbit message to queue ' + queue)
dataPayloadString = sys.argv[2]
url = 'https://www.3xr.com/a/rabbit/queue_message_internal'
data = {
  'queue': queue,
  'data': dataPayloadString,
}
print(data)

response = requests.post(url, json=data)
if (response.ok == False):
  print('Error Queuing Rabbit Message')
else:
  print('Rabbit Message (id: ' + str(response.content) + ') Sent to ' + queue)
