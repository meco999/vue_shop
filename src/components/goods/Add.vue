<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 消息警告区域 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 步骤条区域 -->
      <el-steps
        :active="activeSteps - 0"
        finish-status="success"
        align-center
        :space="200"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏区域 -->
      <!-- 大表单 -->
      <el-form
        :model="addGoodsForm"
        :rules="addGoodsRule"
        ref="addGoodsRefs"
        label-width="100px"
        label-position="top"
      >
        <!-- 大tab栏 -->
        <el-tabs
          tab-position="left"
          v-model="activeSteps"
          :before-leave="beforeLeave"
          @tab-click="tabClick"
        >
          <!-- 小tab -->
          <el-tab-pane label="基本信息" name="0">
            <!-- 小tab中的小表单 -->
            <el-form-item label="商品名称" prop="goods_name">
              <!-- 小表单中的输入框 -->
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                v-model="addGoodsForm.goods_price"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model="addGoodsForm.goods_weight"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                v-model="addGoodsForm.goods_number"
                type="number"
              ></el-input>
            </el-form-item>
            <!-- 小tab栏中的级联选择框
                v-model保存用户选中的value值
             -->
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addGoodsForm.goods_cat"
                :options="cateList"
                :props="props"
                @change="handleChange"
              >
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in paramManyList"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="item1"
                  v-for="(item1, i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <!-- 静态参数展示 -->
            <el-form-item
              v-for="item in paramOnlyList"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input :value="item.attr_vals"> </el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 上传图片 -->
          <!--  
                action：指定图片上传api接口
                :on-preview ： 当点击图片时会触发该事件进行预览操作,处理图片预览
                :on-remove : 当用户点击图片右上角的X号时触发执行
                :on-success：当用户点击上传图片并成功上传时触发
                list-type ：设置预览图片的方式
                :headers ：设置上传图片的请求头
           -->
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            <el-dialog :visible.sync="picDialogVisible" width="50%">
              <img :src="picUrl" class="previewImg" />
            </el-dialog>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑区 -->
            <quill-editor v-model="addGoodsForm.goods_introduce">
            </quill-editor>
            <el-button type="primary" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>
<script>
//官方推荐将lodash导入为_
import _ from 'lodash'
export default {
  data() {
    return {
      // 图片预览对话框的显示
      picDialogVisible: false,
      // 上传图片的请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      //   保存预览图片的地址
      picUrl: '',
      // 上传图片的后台url地址
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 保存商品的静态参数
      paramOnlyList: [],
      // 商品的动态参数列表
      paramManyList: [],
      // 级联选择框的props设置项
      props: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 保存商品列表数据
      cateList: [],
      // 控制激活的步骤条
      activeSteps: '0',
      //   添加商品表单对象
      addGoodsForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 保存用户选中的props中的value值
        goods_cat: [],
        // 图片的数据
        pics: [],
        // 商品的详情描述
        goods_introduce: '',
        attrs: []
      },
      //   添加商品表单验证对象
      addGoodsRule: {
        goods_name: [
          { required: true, trigger: 'blur', message: '请输入商品名称' }
        ],
        goods_price: [
          { required: true, trigger: 'blur', message: '请输入商品价格' }
        ],
        goods_weight: [
          { required: true, trigger: 'blur', message: '请输入商品重量' }
        ],
        goods_number: [
          { required: true, trigger: 'blur', message: '请输入商品数量' }
        ],
        goods_cat: [
          { trigger: 'change', required: true, message: '请选择商品类型' }
        ]
      }
    }
  },
  methods: {
    //   点击按钮添加商品
    async add() {
      // 验证表单
      this.$refs.addGoodsRefs.validate(valid => {
        if (!valid) return this.$message.error('请完整填写表单')
      })
      //   console.log(this.addGoodsForm)
      //  将goods_cat数组改造成以逗号分割的字符串,
      //   直接处理会报错，可以使用lodash提供的cloneDeep，将addGoodsForm进行深拷贝
      const form = _.cloneDeep(this.addGoodsForm)
      form.goods_cat = form.goods_cat.join(',')
      //   处理动态参数列表
      this.paramManyList.forEach(item => {
        const newInfo = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals.join(' ')
        }
        this.addGoodsForm.attrs.push(newInfo)
      })
      // 处理静态参数列表
      this.paramOnlyList.forEach(item => {
        const newInfo = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals
        }
        this.addGoodsForm.attrs.push(newInfo)
      })
      form.attrs = this.addGoodsForm.attrs
      const { data: res } = await this.$http.post('goods', form)
      if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
    //   console.log(form)
    this.$message.success('添加商品成功')
    this.$router.push('/goods')
    },
    //   监听用户图片上传成功后的事件
    handleSuccess(response) {
      //  1.拼接得到图片信息对象
      const picInfo = { pics: response.data.tmp_path }
      //  2.将图片信息对象push到图片数组中去
      this.addGoodsForm.pics.push(picInfo)
      console.log(this.addGoodsForm)
    },
    //   当点击图片时会触发该事件进行预览操作,处理图片预览
    handlePreview(file) {
      //   console.log(file)
      this.picUrl = file.response.data.url
      // console.log(file.response.data.url)
      this.picDialogVisible = true
    },
    //   当用户点击图片右上角的X号时触发执行
    handleRemove(file) {
      // file代表移除的用户信息
      //   console.log(file)
      const filePath = file.response.data.temp_path
      //  1.根据fiel提供的信息，查询到图片对应的索引
      // index接受一个回调函数，将符合条件值的索引返回
      const fileIndex = this.addGoodsForm.pics.findIndex(
        x => x.pics === filePath
      )
      //  2.根据索引删除图片信息
      this.addGoodsForm.pics.splice(fileIndex, 1)
      //   console.log(this.addGoodsForm.pics)
    },
    //   tab项 被选中时触发
    async tabClick() {
      //   console.log(this.activeSteps)
      if (this.activeSteps === '1') {
        const {
          data: res
        } = await this.$http.get(
          `categories/${this.addGoodsForm.goods_cat[2]}/attributes`,
          { params: { sel: 'many' } }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        // 将拿到的paramManyList数组进行循环，拿到每一个item项，并将item项里面的attr_vals字符串用空格做分割，就能拿到一个数组
        // 在分割之前判断是否为空数组
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.paramManyList = res.data
        // console.log(this.paramManyList)
      } else if (this.activeSteps === '2') {
        const {
          data: res
        } = await this.$http.get(
          `categories/${this.addGoodsForm.good_cat[2]}/attributes`,
          { params: { sel: 'only' } }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.paramOnlyList = res.data
        // console.log(this.paramOnlyList)
      }
    },
    // 监听tab栏的切换验证
    beforeLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addGoodsForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    //   级联选择器的change事件
    handleChange() {
      if (this.addGoodsForm.goods_cat.length !== 3) {
        this.addGoodsForm.goods_cat = []
      }
      //   console.log(this.addGoodsForm.good_cat)
    },
    //   获取表单数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200)
        return this.$message.error('获取商品列表失败')
      this.cateList = res.data
      // console.log(res.data)
    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    thirdNode() {
      if (this.addGoodsForm.goods_cat.length === 3) {
        return this.addGoodsForm.goods_cat[2]
      } else {
        return null
      }
    }
  }
}
</script>
<style lang="less" scoped>
.el-steps {
  margin-top: 15px;
}
.el-tabs {
  margin-top: 15px;
}
.el-checkbox {
  margin: 0 8px 0 0 !important;
}
.previewImg {
  width: 100%;
  // height: 100%;
}
.el-button {
  margin-top: 15px;
}
</style>
