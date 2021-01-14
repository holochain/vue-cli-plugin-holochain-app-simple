const routes = [
  {
    path: '/things',
    component: () => import('@/layouts/basic/Index.vue'),
    children: [
      {
        path: '',
        name: 'Things',
        component: () => import('@/views/things/Index.vue')
      }
    ]
  }
]

export default routes
