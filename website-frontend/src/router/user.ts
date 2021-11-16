// SPDX-License-Identifier: Apache-2.0
export default [
  {
    path: '/user/forgot-password',
    name: 'user-forgot-password',
    component: () => import('@/views/user/ForgotPassword.vue'),
  },
  {
    path: '/user/set-password/:token',
    name: 'user-set-password',
    props: true,
    component: () => import('@/views/user/SetPassword.vue'),
  },
  {
    path: '/qa/account',
    name: 'qa-account',
    component: () => import('@/views/artist/ArtistAccount.vue'),
  },
];
