import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/Home.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home }
]

const router = new VueRouter({
  routes
})
// 挂载路由守卫
router.beforeEach((to, from, next) => {
  // to代表将要去的路径
  // form代表来的路径
  // next()是一个放行函数，直接next()表示是放行，next('/login)表示强制跳转的路径
  if (to.path === '/login') return next()
  //   根据是否有token来判断是否登录
  const tokenStr = window.sessionStorage.getItem('token')
  //   如果没有
  if (tokenStr) {
    return next()
  } else {
    return next('/login')
  }
})

export default router
