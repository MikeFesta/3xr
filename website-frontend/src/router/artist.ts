// SPDX-License-Identifier: Apache-2.0
export default [
  {
    path: '/artist/account',
    name: 'artist-account',
    component: () => import('@/views/artist/ArtistAccount.vue'),
  },
  {
    path: '/artist/resources/blender-add-on',
    name: 'blender-add-on',
    component: () => import('@/views/artist/resources/BlenderAddOn.vue'),
  },
  {
    path: '/artist/resources',
    name: 'help-and-faq',
    component: () => import('@/views/common/HelpAndFaq.vue'),
    children: [
      {
        path: 'help/:chapter?/:section?',
        name: 'artist-help',
        props: true,
        component: () => import('@/views/artist/resources/Help.vue'),
      },
      {
        path: 'faq',
        name: 'artist-faq',
        component: () => import('@/views/artist/resources/FAQ.vue'),
      },
      {
        path: 'contact',
        name: 'artist-contact',
        component: () => import('@/views/artist/resources/Contact.vue'),
      },
    ],
  },
];
