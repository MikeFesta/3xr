// SPDX-License-Identifier: Apache-2.0
import { USER_ROLE_NAME } from '@/store/interfaces/types/UserRoleType';

export interface SideLink {
  roles: USER_ROLE_NAME[];
  icon: string;
  title: string;
  url: string;
}

const sidebarLinks: SideLink[] = [
  {
    roles: [USER_ROLE_NAME.ADMIN, USER_ROLE_NAME.ARTIST, USER_ROLE_NAME.QA, USER_ROLE_NAME.STUDIO_ADMIN, USER_ROLE_NAME.CLIENT],
    icon: 'mdi-view-dashboard',
    title: 'Dashboard',
    url: '/dashboard',
  },
  {
    roles: [USER_ROLE_NAME.ADMIN],
    icon: 'mdi-shield-star',
    title: 'Admin',
    url: '/admin/latest-submission',
  },
  {
    roles: [USER_ROLE_NAME.ADMIN, USER_ROLE_NAME.ARTIST, USER_ROLE_NAME.QA, USER_ROLE_NAME.STUDIO_ADMIN],
    icon: 'mdi-blender-software',
    title: 'Add-on',
    url: '/artist/resources/blender-add-on',
  },
  {
    roles: [USER_ROLE_NAME.ADMIN, USER_ROLE_NAME.ARTIST, USER_ROLE_NAME.QA, USER_ROLE_NAME.STUDIO_ADMIN, USER_ROLE_NAME.CLIENT],
    icon: 'mdi-notebook-check',
    title: 'Release Notes',
    url: '/release-notes',
  },
  {
    roles: [USER_ROLE_NAME.ADMIN],
    icon: 'mdi-account-settings',
    title: 'Client Account',
    url: '/client/account',
  },
  {
    roles: [USER_ROLE_NAME.ADMIN],
    icon: 'mdi-bookshelf',
    title: 'Library',
    url: '/library/materials',
  },
  {
    roles: [USER_ROLE_NAME.ADMIN, USER_ROLE_NAME.ARTIST, USER_ROLE_NAME.QA, USER_ROLE_NAME.STUDIO_ADMIN, USER_ROLE_NAME.CLIENT],
    icon: 'mdi-heart',
    title: 'Favorites',
    url: '/search/favorites',
  },
  {
    roles: [USER_ROLE_NAME.ARTIST, USER_ROLE_NAME.CLIENT, USER_ROLE_NAME.QA, USER_ROLE_NAME.STUDIO_ADMIN],
    icon: 'mdi-help-box',
    title: 'Help & FAQ',
    url: '/artist/resources/help',
  },
  {
    roles: [USER_ROLE_NAME.ARTIST, USER_ROLE_NAME.QA, USER_ROLE_NAME.STUDIO_ADMIN],
    icon: 'mdi-account-settings',
    title: 'My Account',
    url: '/artist/account',
  },
  {
    roles: [USER_ROLE_NAME.CLIENT],
    icon: 'mdi-account-settings',
    title: 'My Account',
    url: '/client/account',
  },
  {
    roles: [USER_ROLE_NAME.ADMIN, USER_ROLE_NAME.STUDIO_ADMIN],
    icon: 'mdi-cash-multiple',
    title: 'Billing',
    url: '/billing',
  },
];

export default sidebarLinks;
