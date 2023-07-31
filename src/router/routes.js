import Store from 'src/store/index.js' 

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'Productos', component: () => import('pages/ahorroProgramado/ObtenerProductos.vue') }
    ]
  },
  {
    path: '/Login',
    name:"login",
    component: () => import('pages/Login.vue'),
    meta: { requiresAuth: false },
    beforeEnter: (to, from, next) => {
      console.log(Store.state.example.logged)
      if(Store.state.example.logged) {
        next({ path: "/" });
      } else {
        next();
      }
    }
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
