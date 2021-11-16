// SPDX-License-Identifier: Apache-2.0
import Vue from 'vue';
import VueRouter from 'vue-router';
import admin from '@/router/admin';
import artist from '@/router/artist';
import asset from '@/router/asset';
import client from '@/router/client';
import material from '@/router/material';
import part from '@/router/part';
import product from '@/router/product';
import purchaseOrders from '@/router/purchase-orders';
import user from '@/router/user';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    ...admin,
    ...artist,
    ...asset,
    ...client,
    ...material,
    ...part,
    ...purchaseOrders,
    ...product,
    ...user,
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue'),
    },
    {
      path: '/big-commerce-user-guide',
      name: 'big-commerce-user-guide',
      component: () => import('../views/UserGuideBC.vue'),
    },
    {
      path: '/big-commerce-uninstall-guide',
      name: 'big-commerce-uninstall-guide',
      component: () => import('../views/UninstallGuideBC.vue'),
    },
    {
      path: '/billing',
      name: 'billing',
      component: () => import('../views/Billing.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/Dashboard.vue'),
    },
    {
      path: '/jobs',
      name: 'jobs',
      component: () => import('@/views/Jobs.vue'),
    },
    {
      path: '/jobs-complete',
      name: 'jobs-complete',
      props: true,
      component: () => import('@/views/Complete.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/user/Login.vue'),
    },
    {
      path: '/platform',
      name: 'platform',
      component: () => import('../views/Platform.vue'),
    },
    {
      path: '/policy',
      name: 'policy',
      component: () => import('../views/Policy.vue'),
    },
    {
      path: '/qa-review',
      name: 'qa-review',
      props: true,
      component: () => import('@/views/QaReview.vue'),
    },
    {
      path: '/release-notes',
      name: 'release-notes',
      component: () => import('../views/ReleaseNotes.vue'),
    },
    {
      path: '/search',
      name: 'search-all',
      component: () => import('@/views/search/Search.vue'),
    },
    {
      path: '/search/favorites',
      name: 'search-favorites',
      component: () => import('@/views/search/Favorites.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/user/Signup.vue'),
    },
    {
      path: '/terms',
      name: 'terms',
      component: () => import('../views/Terms.vue'),
    },
  ],
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

export const publicRoutes = [
  'home',
  'login',
  'signup',
  'platform',
  'big-commerce-user-guide',
  'user-forgot-password',
  'user-set-password',
  'policy',
  'terms',
];

export default router;
