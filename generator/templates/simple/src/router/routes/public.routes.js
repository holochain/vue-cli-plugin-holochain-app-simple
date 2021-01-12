const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/layouts/basic/Index.vue'),
    children: [
      {
        path: '',
        component: () => import('@/views/home/Index.vue')
      }
    ]
  }
]

export default routes
