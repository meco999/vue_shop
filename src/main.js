import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'

import axios from 'axios'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 拦截器要在挂载原型之前放置
// axios.interceptors.request就是拦截器，后面是挂载了一个预处理函数
// config就是请求对象,请求对象中有请求头的信息
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 挂载到Vue的原型对象上，每一个组件就可以通过this访问到$http，从而发送请求
Vue.prototype.$http = axios
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

Vue.config.productionTip = false
// 将富文本编辑器注册为全局组件
Vue.use(VueQuillEditor)
// 注册为全局组件
Vue.component('tree-table', TreeTable)
// 时间过滤器
Vue.filter('dateFormat', function(originDate) {
  const od = new Date(originDate)
  const y = od.getFullYear()
  const m = (od.getMonth() + 1 + '').padStart(2, '0')
  const d = (od.getDay() + '').padStart(2, '0')
  const hh = (od.getHours() + '').padStart(2, '0')
  const mm = (od.getMinutes() + '').padStart(2, '0')
  const ss = (od.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
