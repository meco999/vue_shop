import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    //   先将home组件展示出来，然后重定向到子组件welcome，但是这个页面还是home所渲染出来的的页面
    //  在home组件中主体区域中添加路由占位符，展示子组件welcome组件的内容
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
    ]
  }
  
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
