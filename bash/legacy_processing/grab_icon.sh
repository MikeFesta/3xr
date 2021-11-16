#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
# Pass a id for an icon on nounproject.com, extract, convert, save, upload svg
# ex) https://thenounproject.com/search/?q=envelope&i=1706906
# name: mail
# id: 1706906

# Get Parameter
while getopts "n:i:" opt;
do
  case "$opt" in
  n)
    name=$OPTARG
    ;;
  i)
    id=$OPTARG
    ;;
  esac
done

if [ "${name}" = "" ]
then
  printf "ERROR: name required. run ./"$(basename "$0")" -n name -i id\n"
  exit 1
fi

if [ "${id}" = "" ]
then
  printf "ERROR: id required. run ./"$(basename "$0")" -n ${name} -i id\n"
  exit 1
fi

re='^[a-z_A-Z]+$'
if ! [[ $name =~ $re ]];
then
  printf "ERROR: Name is not valid\n"
  exit 1
fi

re='^[0-9]+$'
if ! [[ $id =~ $re ]];
then
  printf "ERROR: ID is not valid\n"
  exit 1
fi

# Build the URL
url="https://thenounproject.com/search/?q=${name}&i=${id}"

# Get svg url from graphql
printf "Saving Icon named ${name} id: ${id} from ${url}\n"
curl_url="'https://api.production.thenounproject.com/graphql' -H 'accept: */*' -H 'Referer: ${url}' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36' -H 'Sec-Fetch-Mode: cors' -H 'content-type: application/json' --data-binary '{\"operationName\":\"IconDetailQuery\",\"variables\":{\"iconId\":\"${id}\"},\"query\":\"query IconDetailQuery(\$iconId: ID) {\n  iconDetail(id: \$iconId) {\n    id\n    isActive\n    name\n    term\n    permalink\n    tags {\n      id\n      slug\n      __typename\n    }\n    collections {\n      id\n      name\n      slug\n      permalink\n      __typename\n    }\n    icon_url: iconUrl\n    license_description: licenseDescription\n    uploader {\n      id\n      name: fullName\n      username\n      permalink\n      location\n      __typename\n    }\n    userHasPurchased\n    attributionPreviewUrl\n    preview_url: thumbnail\n    __typename\n  }\n}\n\"}'"

curl_cmd="curl ${curl_url} --compressed -o /tmp/icon_url.json"
eval ${curl_cmd}

# Extract base 64 data
svg_url=`grep 'https:\/\/static.thenounproject.com\/noun-svg\/[_~0-9\.a-z?=A-Z&\-]*' /tmp/icon_url.json -o`
if [ "${svg_url}" = "" ]
then
  printf "ERROR: Unable to parse svg url. Check \tmp\icon_url.json\n"
  exit 1
fi

# Download the .svg file
curl -XGET ${svg_url} -o /tmp/${name}.svg

# Upload file to Google Storage
printf "gsutil -D cp /tmp/${name}.svg gs://cdn.3xr.com/images/icon/\n"
gsutil -D cp /tmp/${name}.svg gs://cdn.3xr.com/images/icon/

# Delete the downloaded files
rm /tmp/icon_url.json
rm /tmp/${name}.svg
