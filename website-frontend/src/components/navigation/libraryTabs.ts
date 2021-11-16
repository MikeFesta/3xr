// SPDX-License-Identifier: Apache-2.0
import { Tabs } from '@/store/interfaces/Dashboard';

const libraryTabs: Tabs = {
  admin: [
    {
      title: 'Materials',
      icon: 'mdi-crystal-ball',
      link: '/library/materials',
    },
    {
      title: 'Parts',
      icon: 'mdi-cogs',
      link: '/library/parts',
    },
    {
      title: 'Products',
      icon: 'mdi-shape',
      link: '/library/products',
    },
    {
      title: 'Final Assets',
      icon: 'mdi-cube-scan',
      link: '/library/assets',
    },
  ],
  client: [],
  artist: [],
  qa: [],
};

export default libraryTabs;
