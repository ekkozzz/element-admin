import Vue from 'vue'
import VueRouter from 'vue-router'

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: () => import('../views/Welcome.vue'),
      },
      {
        path: '/users',
        component: () => import('../views/user/Users.vue'),
      },
      {
        path: '/rights',
        component: () => import('../views/power/Rights.vue'),
      },
      {
        path: '/roles',
        component: () => import('../views/power/Roles.vue'),
      },
      {
        path: '/categories',
        name: '商品分类',
        component: () => import('../views/goods/Cate.vue'),
      },
      {
        path: '/params',
        name: '参数列表',
        component: () => import('../views/goods/Params.vue'),
      },
      {
        path: '/goods',
        name: '商品列表',
        component: () => import('../views/goods/List.vue'),
      },
      {
        path: '/goods/add',
        name: '添加商品',
        component: () => import('../views/goods/Add.vue'),
      },
      {
        path: '/goods/edit/:id',
        name: '修改商品',
        component: () => import('../views/goods/Add.vue'),
      },
      {
        path: '/orders',
        name: '订单列表',
        component: () => import('../views/order/Order.vue'),
      },
      {
        path: '/reports',
        name: '数据报表',
        component: () => import('../views/report/Report.vue'),
      },
    ],
  },
]

const router = new VueRouter({
  routes,
  // mode: history,
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokeStr = sessionStorage.getItem('token') || ''
  if (!tokeStr) return next('/login')
  else next()
})

export default router
