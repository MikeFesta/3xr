# SPDX-License-Identifier: Apache-2.0
# Create a QR code for the given asset uid
# https://view.3xr.com/{uid}
import segno
import sys

uid = sys.argv[1]
path = sys.argv[2]
name = sys.argv[3]

url = 'https://qr.3xr.com/' + uid
black_filename = path + 'qr_' + name
blue_filename = path + 'qr-' + name

# Use the maximum error correction (H)
# This may come in handy if we overlay a logo
qr = segno.make(url, error='H')
print('QR code designation ' + qr.designator)
#qr.save(filename, scale=10, dark='darkblue')
qr.save(black_filename + '.png', scale=9, dark='#000000')
qr.save(black_filename + '.svg', scale=9, dark='#000000')
qr.save(blue_filename + '.png', scale=9, dark='#1C5C87')
qr.save(blue_filename + '.svg', scale=9, dark='#1C5C87')
