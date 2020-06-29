import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui'

// 注册为全局可用组件
Vue.use(Button)
Vue.use(FormItem)
Vue.use(Form)
Vue.use(Input)
// 将这个组件通过$message挂载到所有的Vue实例中去，$nmessage是自定义的
// 每个组件就可以直接通过this.$message来进行弹窗提示了
Vue.prototype.$message = Message
