"use strict";

var _vue = _interopRequireDefault(require("vue"));

var _elementUi = require("element-ui");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_vue["default"].use(_elementUi.Button);

_vue["default"].use(_elementUi.FormItem);

_vue["default"].use(_elementUi.Form);

_vue["default"].use(_elementUi.Input); // 将这个组件通过$message挂载到所有的Vue实例中去
// 每个组件就可以直接通过this.$message来进行弹窗提示了


_vue["default"].prototype.$message = _elementUi.Message;