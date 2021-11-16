# SPDX-License-Identifier: Apache-2.0
osascript -e "try" -e "mount volume \"smb://ntwkusr@dev.3xr.ai/3xr\"" -e "end try"
ln -s /Volumes/3xr/ /3xr/network_drive
