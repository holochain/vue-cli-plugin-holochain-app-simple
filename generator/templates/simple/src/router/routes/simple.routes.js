const routes = [
  {
    path: '/',
    component: () => import('@/layouts/basic/Index.vue'),
    children: [
      {
        path: '',
        component: () => import('@/views/things/Index.vue')
      }
    ]
  }
]

export default routes
