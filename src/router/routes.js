import Store from 'src/store/index.js'

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [

      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'sistemas', component: () => import('components/SistemasComponente.vue') },
      { path: 'areas', component: () => import('components/AreaComponente.vue') },
      { path: 'paises', component: () => import('components/PaisComponente.vue') },
      { path: 'reportes', component: () => import('components/ReportesComponente.vue') },
      { path: 'users', component: () => import('pages/UsersPage.vue') },
      { path: 'roles', component: () => import('pages/RolesPage.vue') },
      { path: '/Agrupadores', component: () => import('pages/indicadores/Agrupadores.vue') },
      {
        path: "/indicador/:id",
        name: '/indicador',
        component: () => import("pages/indicadores/Indicadores.vue"),
        meta: { requiresAuth: true },
      },
    ]
  },
  {
    path: '/Login',
    name: "login",
    component: () => import('pages/Login.vue'),
    meta: { requiresAuth: false },
    beforeEnter: (to, from, next) => {
      console.log(Store.state.app.logged)
      if (Store.state.app.logged) {
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
