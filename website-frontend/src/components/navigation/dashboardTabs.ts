// SPDX-License-Identifier: Apache-2.0
import { Tabs } from '@/store/interfaces/Dashboard';
import { TimeFormat } from '@/helpers';

const dashboardTabs: Tabs = {
  admin: [
    {
      title: 'Dashboard',
      icon: 'mdi-view-dashboard',
      link: '/dashboard',
    },
    {
      title: 'Purchase Orders',
      icon: 'mdi-clipboard-outline',
      link: '/purchase-orders',
    },
    {
      title: 'Jobs',
      icon: 'mdi-briefcase',
      link: '/jobs?dateDueAfter=' + TimeFormat.dateDaysFromNowYYYYMMDD(-14),
    },
    {
      title: 'QA Review',
      icon: 'mdi-alert-circle-check',
      link: '/qa-review',
    },
    {
      title: 'Complete',
      icon: 'mdi-cube-send',
      link: '/jobs-complete?dateDueAfter=' + TimeFormat.dateDaysFromNowYYYYMMDD(-14),
    },
  ],
  client: [
    {
      title: 'Dashboard',
      icon: 'mdi-view-dashboard',
      link: '/dashboard',
    },
    {
      title: 'Purchase Orders',
      icon: 'mdi-clipboard-outline',
      link: '/purchase-orders',
    },
    {
      title: 'Products',
      icon: 'mdi-briefcase',
      link: '/jobs',
    },
    {
      title: 'QA Review',
      icon: 'mdi-alert-circle-check',
      link: '/qa-review',
    },
    {
      title: 'Complete',
      icon: 'mdi-cube-send',
      link: '/jobs-complete',
    },
  ],
  artist: [
    {
      title: 'Dashboard',
      icon: 'mdi-view-dashboard',
      link: '/dashboard',
    },
    {
      title: 'Products',
      icon: 'mdi-briefcase',
      link: '/jobs',
    },
    {
      title: 'Complete',
      icon: 'mdi-cube-send',
      link: '/jobs-complete',
    },
  ],
  qa: [
    {
      title: 'Dashboard',
      icon: 'mdi-view-dashboard',
      link: '/dashboard',
    },
    {
      title: 'Jobs',
      icon: 'mdi-briefcase',
      link: '/jobs',
    },
    {
      title: 'QA Review',
      icon: 'mdi-alert-circle-check',
      link: '/qa-review',
    },
    {
      title: 'Complete',
      icon: 'mdi-cube-send',
      link: '/jobs-complete',
    },
  ],
  studio: [
    {
      title: 'Dashboard',
      icon: 'mdi-view-dashboard',
      link: '/dashboard',
    },
    {
      title: 'Purchase Orders',
      icon: 'mdi-clipboard-outline',
      link: '/purchase-orders',
    },
    {
      title: 'Jobs',
      icon: 'mdi-briefcase',
      link: '/jobs',
    },
    {
      title: 'QA Review',
      icon: 'mdi-alert-circle-check',
      link: '/qa-review',
    },
    {
      title: 'Complete',
      icon: 'mdi-cube-send',
      link: '/jobs-complete',
    },
  ],
};

export default dashboardTabs;
