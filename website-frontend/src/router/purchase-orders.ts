// SPDX-License-Identifier: Apache-2.0
export default [
  {
    path: '/purchase-orders/add-product/:projectUid/:jobUid?',
    name: 'purchase-order-add-product',
    props: true,
    component: () => import('@/views/purchase-orders/AddProduct.vue'),
  },
  {
    path: '/purchase-orders/assets/:projectUid',
    name: 'purchase-order-assets',
    props: true,
    component: () => import('@/views/purchase-orders/PurchaseOrderAssets.vue'),
  },
  {
    path: '/purchase-orders/bulk-upload-csv/:projectUid',
    name: 'purchase-order-bulk-upload-csv',
    props: true,
    component: () => import('@/views/purchase-orders/BulkUploadCsv.vue'),
  },
  {
    path: '/purchase-orders/bulk-upload-zip/:projectUid',
    name: 'purchase-order-bulk-upload-zip',
    props: true,
    component: () => import('@/views/purchase-orders/BulkUploadZip.vue'),
  },
  {
    path: '/purchase-orders/details/:projectUid',
    name: 'purchase-order-details',
    props: true,
    component: () => import('@/views/purchase-orders/PurchaseOrderDetails.vue'),
  },
  {
    path: '/purchase-orders/products/:projectUid',
    name: 'purchase-order-products',
    props: true,
    component: () => import('@/views/purchase-orders/PurchaseOrderProducts.vue'),
  },
  {
    path: '/purchase-orders/review-models/:projectUid',
    name: 'purchase-order-review-models',
    props: true,
    component: () => import('@/views/purchase-orders/ReviewPurchaseOrderModels.vue'),
  },
  {
    path: '/purchase-orders',
    name: 'purchase-orders',
    component: () => import('@/views/PurchaseOrders.vue'),
  },
  {
    path: '/purchase-orders/new',
    name: 'purchase-orders-new',
    component: () => import('@/views/purchase-orders/NewPurchaseOrder.vue'),
  },
];
