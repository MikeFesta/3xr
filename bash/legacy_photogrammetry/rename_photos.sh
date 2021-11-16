#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
# Rename the images files for the given model, which should be a coin scan # The model name is passed as an argument -n name -f folder (front, back, etc)
source $(dirname $0)/globals.sh
name=""
working_dir=""
# Get the arguments (-n is required)
while getopts "n:" opt;
do
    case "$opt" in
    n)
        name=$OPTARG
        ;;
    esac
done

if [ "$name" = "" ]
then
    printf "ERROR: Model Name Required, run ./"$(basename "$0")" -n Model_Name\n"
else
    rows=( "BottomRow" "MiddleRow" "TopRow" )
    row_number=1
    for row_name in "${rows[@]}"
    do
        working_dir="${INCOMING_PRODUCTS_DIR}/$name/Raw/${row_name}"
        if [ ! -d $working_dir ];
        then
            printf "ERROR: Directory does not exist: ${working_dir}\n"
        else
            cr2="${working_dir}/*.CR2"
            # Simple check that there are exactly 24 files
            file_count=`ls -1q ${cr2} | wc -l`
            if [ $file_count -ne 24 ];
            then
                printf "Error: ${file_count} files in ${working_dir}\n"
            else
                printf "Renaming ${file_count} photos in Directory $working_dir\n"
                i=1
                for filename in `ls ${cr2} | sort -V`
                do
                    # Error handeling for no results
                    [ -e "$filename" ] || continue
                    row="$( printf '%02d' "$row_number" )"
                    camera_name="$( printf '%02d' "$i" )"
                    temp_name="${working_dir}/${name}_R${row}_C${camera_name}_temp.CR2"
                    mv "${filename}" ${temp_name}
                    i=$((i+1))
                done
                i=1
                for filename in `ls ${cr2} | sort -V`
                do
                    # Error handeling for no results
                    [ -e "$filename" ] || continue
                    row="$( printf '%02d' "$row_number" )"
                    camera_name="$( printf '%02d' "$i" )"
                    temp_name="${working_dir}/${name}_R${row}_C${camera_name}_temp.CR2"
                    #printf "${filename##*/} >> ${name}_S01_R${row}_C${camera_name}.CR2\n"
                    mv ${temp_name} "${working_dir}/${name}_S01_R${row}_C${camera_name}.CR2"
                    i=$((i+1))
                done
            fi
        fi
        row_number=$((row_number+1))
    done
fi
