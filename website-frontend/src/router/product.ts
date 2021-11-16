// SPDX-License-Identifier: Apache-2.0
export default [
  {
    path: '/library/products',
    name: 'product-dashboard',
    component: () => import('@/views/library/product/ProductDashboard.vue'),
    meta: {},
  },
  // Under Review, same as product-details for now
  {
    path: '/product/review/:uid',
    name: 'product-review',
    props: true,
    component: () => import('../views/product/ProductReview.vue'),
  },
  // 'Review Details' and details icon under Product Name
  {
    path: '/product/details/:uid',
    name: 'product-details',
    props: true,
    component: () => import('../views/product/ProductDetails.vue'),
  },
];
