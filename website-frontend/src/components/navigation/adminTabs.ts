// SPDX-License-Identifier: Apache-2.0
import { Tabs } from '@/store/interfaces/Dashboard';

const adminTabs: Tabs = {
  admin: [
    {
      title: 'Latest Submission',
      icon: 'mdi-cube-send',
      link: '/admin/latest-submission',
    },
    {
      title: 'Clients',
      icon: 'mdi-office-building',
      link: '/admin/client-management',
    },
    {
      title: 'Studios',
      icon: 'mdi-palette',
      link: '/admin/studio-management',
    },
    {
      title: 'Users',
      icon: 'mdi-account',
      link: '/admin/user-management',
    },
  ],
  artist: [],
  client: [],
  qa: [],
};

export default adminTabs;
