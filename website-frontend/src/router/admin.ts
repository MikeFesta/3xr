// SPDX-License-Identifier: Apache-2.0
export default [
  {
    path: '/admin/client-management',
    name: 'admin-client-management',
    component: () => import('@/views/admin/ClientManagement.vue'),
  },
  {
    path: '/admin/client-management/new-client',
    name: 'admin-client-management-new-client',
    component: () => import('@/views/admin/NewClient.vue'),
  },
  {
    path: '/admin/client-management/view/:uid',
    name: 'admin-client-management-view-client',
    props: true,
    component: () => import('@/views/admin/ViewClient.vue'),
  },
  {
    path: '/admin/latest-submission',
    name: 'admin-latest-submission',
    component: () => import('@/views/admin/LatestSubmission.vue'),
  },
  {
    path: '/admin/studio-management',
    name: 'admin-studio-management',
    component: () => import('@/views/admin/StudioManagement.vue'),
  },
  {
    path: '/admin/studio-management/new-studio',
    name: 'admin-studio-management-new-studio',
    component: () => import('@/views/admin/NewStudio.vue'),
  },
  {
    path: '/admin/user-management',
    name: 'admin-user-management',
    component: () => import('@/views/admin/UserManagement.vue'),
  },
  {
    path: '/admin/user-management/new-user',
    name: 'admin-user-management-new-user',
    component: () => import('@/views/admin/NewUser.vue'),
  },
  {
    path: '/admin/user-management/view/:username',
    name: 'admin-user-management-view-user',
    props: true,
    component: () => import('@/views/admin/ViewUser.vue'),
  },
];
