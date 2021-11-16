#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
tmux new -s rabbit-process \
  '/3xr/code/rabbitmq/consume/delete/additional_file.js' \; \
  select-pane -T 'Delete Additional File' \; \
  split-window -v '/3xr/code/rabbitmq/consume/delete/reference_image.js' \; \
  select-pane -T 'Delete Reference Image' \; \
  split-window -v '/3xr/code/rabbitmq/consume/publish/asset.js' \; \
  select-layout tiled \; \
  select-pane -T 'Publish Asset' \; \
  split-window -v '/3xr/code/rabbitmq/consume/extract/project_resources.js' \; \
  select-pane -T 'Extract Project Resources' \; \
  set remain-on-exit on \; \
  set pane-border-fg colour26 \; \
  set pane-active-border-bg colour26 \; \
  set pane-active-border-fg colour15 \; \
  set status-bg colour7 \; \
  set status-fg colour234 \; \
  set message-bg colour202 \; \
  set pane-border-status top \; \
  select-layout tiled \; \

# Moved to 100 because of QR code generation - module named 'segno' is needed
#  split-window -v '/3xr/code/rabbitmq/consume/publish/asset_submission.js' \; \
#  select-pane -T 'Publish Asset Submission' \; \
