"use strict";

var _vue = _interopRequireDefault(require("vue"));

var _App = _interopRequireDefault(require("./App.vue"));

var _router = _interopRequireDefault(require("./router"));

require("./plugins/element.js");

require("./assets/fonts/iconfont.css");

require("./assets/css/global.css");

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// 导入字体图标
// 导入全局样式表
// 挂载到Vue的原型对象上，每一个组件就可以通过this访问到$http，从而发送请求
_vue["default"].prototype.$http = _axios["default"]; // 配置请求的根路径

_axios["default"].defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
_vue["default"].config.productionTip = false;
new _vue["default"]({
  router: _router["default"],
  render: function render(h) {
    return h(_App["default"]);
  }
}).$mount('#app');