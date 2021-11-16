#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
# Creates model directories for all folders in /3xr/incoming_products
# The model name is the same as the directory name
source $(dirname $0)/globals.sh

printf "Importing incoming products from $INCOMING_PRODUCTS_DIR\n"
prod_dir="${INCOMING_PRODUCTS_DIR}/*/"

product_count=`ls -l ${INCOMING_PRODUCTS_DIR} | grep "^d" | wc -l`

if [ $product_count -eq 0 ];
then
    printf "No new products to import\n"
else
    printf "${product_count} products to be imported\n"
    for d in $prod_dir
    do
        name=$(basename $d)
        echo $name
        if [ -d "$MODEL_DIR/$name" ];
        then
            printf "ERROR: Directory already exists: ${MODEL_DIR}/${name}\n"
        else
            printf "run ./init_model.sh -n ${name}\n"
            init=$BASH_3XR_DIR/init_model.sh
            $init -n ${name}
            if [ -d "$MODEL_DIR/$name" ];
            then
                mv $d/* ${MODEL_DIR}/${name}/photos
                rmdir $d
            else
                printf "unable to move photos\n"
            fi
        fi
    done
fi
