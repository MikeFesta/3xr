#!/bin/bash
# SPDX-License-Identifier: Apache-2.0

printf 'Creating addon xrs\n'
# Find all of the dependencies and write them to addon.files
# __init__ and studio are always required
echo 'xrs/__init__.py' > addon.files
echo 'xrs/studio.py' >> addon.files

# __init__ is not included anyway, so no need to track it
filesAdded=( "studio" )

# Loops through addon.files as it grows
while IFS= read -r filename
do
  # Read each included file to look for nested dependencies
  while IFS= read -r line
  do
    if [[ $line == 'import xrs.'* ]]
    then
      # Remove the start of the import line to get the filename
      filename=$(echo "$line" | cut -c12-)
      if [[ ! " ${filesAdded[@]} " =~ " ${filename} " ]]
      then
        # Use an array to keep track of which files have been added
        filesAdded+=( "$filename" )
        echo "xrs/${filename}.py" >> addon.files
      fi
    fi
  done < $filename
done < 'addon.files'

# Save the zip file with a version number, which is in __init__.py
versionDot='0.'
while IFS= read -r line
do
  if [[ $line == '  "version": '* ]]
  then
    # Remove up to the first '  "version": (' and after the last '),\n'
    versionRaw=$(echo $line | cut -c13- | rev | cut -c3- | rev)
    # Parse the comma separated string into an array
    IFS=', ' read -r -a versionArray <<< "$versionRaw"
    # Join the arary with .'s
    versionDot=$(printf "%s." "${versionArray[@]}")
  fi
done < 'xrs/__init__.py'

zipName="xrs.${versionDot}zip"
echo "Saving to ${zipName}"
rm "${zipName}"
cat addon.files | zip -r@ "${zipName}"
printf 'Done\n'
