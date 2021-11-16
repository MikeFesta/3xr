#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
tmux new -s rabbit-blender \
  '/3xr/code/rabbitmq/consume/init/material.js' \; \
  select-pane -T 'Init Material' \; \
  split-window -v '/3xr/code/rabbitmq/consume/init/product.js' \; \
  select-pane -T 'Init Product' \; \
  split-window -v '/3xr/code/rabbitmq/consume/export/crate_and_barrel_zip.js' \; \
  select-layout tiled \; \
  select-pane -T 'Export Crate and Barrel Zip' \; \
  split-window -v '/3xr/code/rabbitmq/consume/init/part.js' \; \
  select-pane -T 'Init Part' \; \
  split-window -v '/3xr/code/rabbitmq/consume/generate/product_part_material.js' \; \
  select-layout tiled \; \
  select-pane -T 'Product Part Material' \; \
  set remain-on-exit on \; \
  set pane-border-fg colour26 \; \
  set pane-active-border-bg colour26 \; \
  set pane-active-border-fg colour15 \; \
  set status-bg colour7 \; \
  set status-fg colour234 \; \
  set message-bg colour202 \; \
  set pane-border-status top \; \
  select-layout tiled \; \

# Moved to 100 because of USD library only installed there
# split-window -v '/3xr/code/rabbitmq/consume/export/submission_models.js' \; \
# select-layout tiled \; \
# select-pane -T 'Export Submission Models' \; \
