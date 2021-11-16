// SPDX-License-Identifier: Apache-2.0
export default [
  {
    path: '/asset/details/:uid',
    name: 'asset-details',
    props: true,
    component: () => import('@/views/asset/AssetDetails.vue'),
  },
  {
    path: '/library/assets',
    name: 'asset-dashboard',
    component: () => import('@/views/library/asset/AssetDashboard.vue'),
    meta: {},
  },
];
