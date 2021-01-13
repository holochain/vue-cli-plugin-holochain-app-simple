const routes = [
  {
    path: '/',
    component: () => import('@/layouts/basic/Index.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/home/Index.vue')
      }
    ]
  }
]

export default routes
