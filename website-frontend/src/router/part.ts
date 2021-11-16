// SPDX-License-Identifier: Apache-2.0
export default [
  {
    path: '/library/parts',
    name: 'part-dashboard',
    component: () => import('@/views/library/part/PartDashboard.vue'),
    meta: {},
  },
  {
    path: '/library/parts/create-from-submission/:submissionId',
    name: 'new-part-from-submission',
    component: () => import('@/views/library/part/NewPart.vue'),
    meta: {},
    props: (route: any) => { return { submissionId: Number(route.params.submissionId) } },
  },
  {
    path: '/library/parts/new',
    name: 'new-part',
    component: () => import('@/views/library/part/NewPart.vue'),
    meta: {},
  },
  {
    path: '/library/parts/view/:uid',
    name: 'part-details',
    component: () => import('@/views/library/part/PartDetails.vue'),
    meta: {},
    props: true,
  },
];
