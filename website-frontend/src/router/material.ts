// SPDX-License-Identifier: Apache-2.0
export default [
  {
    path: '/library/materials',
    name: 'material-dashboard',
    component: () => import('@/views/library/material/MaterialDashboard.vue'),
    meta: {},
  },
  {
    path: '/library/materials/new',
    name: 'new-material',
    component: () => import('@/views/library/material/NewMaterial.vue'),
    meta: {},
  },
  {
    path: '/library/materials/view/:uid',
    name: 'material-details',
    component: () => import('@/views/library/material/MaterialDetails.vue'),
    meta: {},
    props: true,
  },
];
