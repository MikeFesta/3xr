#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
tmux new -s rabbit-render \
  '/3xr/code/rabbitmq/consume/render/360_spin.js | tee -a /3xr/logs/render/360_spin.log' \; \
  select-pane -T '360 Spin' \; \
  split-window -v '/3xr/code/rabbitmq/consume/render/material.js | tee -a /3xr/logs/render/material.log' \; \
  select-pane -T 'Render Material' \; \
  split-window -v '/3xr/code/rabbitmq/consume/render/image_from_angle.js | tee -a /3xr/logs/render/image_from_angle.log' \; \
  select-layout tiled \; \
  select-pane -T 'Image From Angle' \; \
  split-window -v '/3xr/code/rabbitmq/consume/render/master_images.js | tee -a /3xr/logs/render/6_views_image_set.log' \; \
  select-pane -T '6 Views Image Set' \; \
  split-window -v '/3xr/code/rabbitmq/consume/render/qa_wireframes.js | tee -a /3xr/logs/render/qa_wireframes.log' \; \
  select-layout tiled \; \
  select-pane -T 'QA Wireframes' \; \
  set remain-on-exit on \; \
  set pane-border-fg colour26 \; \
  set pane-active-border-bg colour26 \; \
  set pane-active-border-fg colour15 \; \
  set status-bg colour7 \; \
  set status-fg colour234 \; \
  set message-bg colour202 \; \
  set pane-border-status top \; \
  select-layout tiled \; \
