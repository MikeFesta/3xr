#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
tmux new -s rabbit-monitor-100 \
 '/3xr/code/rabbitmq/consume/process/product_submission.js | tee -a /3xr/logs/submission_processing.log' \; \
  select-pane -T 'Product Submission' \; \
  split-window -v '/3xr/code/rabbitmq/consume/publish/asset_submission.js | tee -a /3xr/logs/submission_publishing.log' \; \
  select-pane -T 'Publish Asset Submission' \; \
  split-window -v '/3xr/code/rabbitmq/consume/export/submission_models.js | tee -a /3xr/logs/export_submission_models.log' \; \
  select-layout tiled \; \
  select-pane -T 'Export Submission Models' \; \
  set remain-on-exit on \; \
  set pane-border-fg colour26 \; \
  set pane-active-border-bg colour26 \; \
  set pane-active-border-fg colour15 \; \
  set status-bg colour7 \; \
  set status-fg colour234 \; \
  set message-bg colour202 \; \
  set pane-border-status top \; \
  select-layout tiled \; \
