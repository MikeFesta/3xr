#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
# Scrape the web for sites using 3D (usdz/glb)

printf "Using python to scrape the web\n"

source /3xr/code/python/venv/3.6.8/bin/activate
python --version
#scrapy runspider /3xr/code/python/brick-set.py
scrapy runspider /3xr/code/python/web-crawler.py
deactivate

printf "Done\n"
