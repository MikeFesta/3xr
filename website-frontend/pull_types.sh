#!/usr/bin/env bash
# SPDX-License-Identifier: Apache-2.0
REPOSRC=git@bitbucket.org:3xr_inc/3xr_types.git
LOCALREPO=3xr_types
git clone "$REPOSRC" "$LOCALREPO" 2> /dev/null || git -C "$LOCALREPO" pull