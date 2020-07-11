<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 提示注意项 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cap_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            :options="this.cateList"
            :props="cateListCascaderProps"
            v-model="selectedCateKeys"
            @change="handleChange"
          >
          </el-cascader>
        </el-col>
      </el-row>
      <!-- tab页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态参数" name="many"
          ><el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addParamsDialog"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" style="width: 100%" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClosed(i, scope.row)"
                  >{{ item }}</el-tag
                >
              </template></el-table-column
            >
            <!-- 索引列 -->
            <el-table-column type="index"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称" width="180">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editParamsDialog(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-deletd"
                  size="mini"
                  @click="removeParams(scope.row)"
                  >删除</el-button
                >
              </template></el-table-column
            >
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性面板 -->
        <el-tab-pane label="静态属性" name="only"
          ><el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addParamsDialog"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" style="width: 100%" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClosed(i, scope.row)"
                  >{{ item }}</el-tag
                >
              </template></el-table-column
            >
            <!-- 索引列 -->
            <el-table-column type="index"> </el-table-column>
            <el-table-column prop="attr_name" label="属性名称" width="180">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editParamsDialog(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-deletd"
                  size="mini"
                  @click="removeParams(scope.row)"
                  >删除</el-button
                >
              </template></el-table-column
            >
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addParamsDialogVisible"
      width="50%"
      @close="paramsDialogClosed"
    >
      <!-- 添加参数的表单 -->
      <el-form
        :model="addParamsForm"
        :rules="addParamsFormRules"
        ref="addParamsFormRefs"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="commitAddParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑参数的对话框 -->
    <el-dialog
      :title="'编辑' + titleText"
      :visible.sync="editParamsDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 编辑参数的表单 -->
      <el-form
        :model="editParamsForm"
        :rules="editParamsFormRules"
        ref="editParamsFormRefs"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="commitEditParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 商品分类级联选择框的prop设置项 editDialogClosed
      cateListCascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        chiedren: 'children',
        expandTrigger: 'hover'
      },
      // 商品分类数据
      cateList: [],
      //   保存在级联框中双向绑定到的数组
      selectedCateKeys: [],
      //   被默认选中激活的页签名称
      activeName: 'many',
      //   动态面板参数
      manyTableData: [],
      //   静态面板参数
      onlyTableData: [],
      //   控制添加对话框的显示与隐藏
      addParamsDialogVisible: false,
      //   保存添加参数请求所需要的表单
      addParamsForm: {
        attr_name: ''
      },
      //  添加参数表单的验证规则对象
      addParamsFormRules: {
        attr_name: {
          required: true,
          message: '请输入参数',
          trigger: 'blur'
        }
      },
      //   编辑参数表单的验证规则对象
      editParamsFormRules: {
        attr_name: {
          required: true,
          message: '请输入参数',
          trigger: 'blur'
        }
      },
      //   编辑对话框的显示与隐藏
      editParamsDialogVisible: false,
      // 编辑对话框的表单实例
      editParamsForm: {},
      //   保存当前的用户信息
      userInfo: {}
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    //   监听tag标签的close事件
    async handleClosed(i, row) {
      row.attr_vals.splice(i, 1)
      const { data: res } = await this.$http.put(
        `categories/${this.thirdNode}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success('更新成功')
    },
    //   点击删除 删除对应的属性
    async removeParams(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该属性, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult === 'cancel') return this.$message.info('取消删除成功')
      const { data: res } = await this.$http.delete(
        `categories/${this.thirdNode}/attributes/` + id.attr_id
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success('删除成功')
      this.getParamsData()
    },
    //   点击确定，编辑参数
    async commitEditParams() {
      const { data: res } = await this.$http.put(
        `categories/${this.thirdNode}/attributes/${this.userInfo.attr_id}`,
        {
          attr_name: this.editParamsForm.attr_name,
          attr_sel: this.activeName
        }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success('编辑成功')
      this.getParamsData()
      this.editParamsDialogVisible = false
    },
    //   编辑对话框的隐藏与显示
    async editParamsDialog(id) {
      this.userInfo = id
      // 根据传递过来的id查询参数信息
      const {
        data: res
      } = await this.$http.get(
        `categories/${this.thirdNode}/attributes/` + id.attr_id,
        { attr_sel: this.activeName }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editParamsForm = res.data
      this.editParamsDialogVisible = true
    },
    //   编辑对话框的关闭事件
    editDialogClosed() {
      this.$refs.editParamsFormRefs.resetFields()
    },
    //  点击确定发送添加参数的请求 attr_sel: [this.activeName]
    commitAddParams() {
      this.$refs.addParamsFormRefs.validate(async valid => {
        if (!valid) return this.$message.error('请正确输入参数名称')
        const { data: res } = await this.$http.post(
          `categories/${this.thirdNode}/attributes`,
          {
            attr_name: this.addParamsForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success('添加属性成功')
        this.addParamsDialogVisible = false
        this.getParamsData()
      })
    },
    //   添加参数对话框关闭事件
    paramsDialogClosed() {
      this.$refs.addParamsFormRefs.resetFields()
    },
    // 点击按钮展示添加属性的对话框
    addParamsDialog() {
      this.addParamsDialogVisible = true
    },
    //   获取所有商品分类的数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200)
        return this.$message.error('获取商品分类失败')
      this.cateList = res.data
      //   console.log(this.cateList)
    },
    // 级联选择框的change事件，控制用户仅能选择三级节点
    handleChange() {
      this.getParamsData()
    },
    // 处理页签的点击事件处理函数
    handleTabClick() {
      //   console.log(this.activeName)
      this.getParamsData()
    },
    // 当级联选择器或者页签面板发生变化，都要触发这个函数
    // 获取参数的列表数据
    async getParamsData() {
      // 如果用户选择的不是三级节点
      if (this.selectedCateKeys.length !== 3) {
        // 清空选项
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
      }
      //   console.log(this.selectedCateKeys)
      // 发起请求，获取对应面板和id的数据
      const { data: res } = await this.$http.get(
        `categories/${this.thirdNode}/attributes`,
        {
          params: { sel: this.activeName }
        }
      )
      if (res.meta.status !== 200)
        return this.$message.error('请先选择商品分类')
      // console.log(res.data)
      // 根据activeName将获取的数据分别保存
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
      //   将attr_vals中的每一个参数都按照空格分割，变成可以循环的数组
      //   res.data[0].attr_vals = res.data[0].attr_vals.split(' ')
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
      })
    }
  },
  computed: {
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true
      } else {
        return false
      }
    },
    thirdNode() {
      if (this.selectedCateKeys.length == 3) {
        return this.selectedCateKeys[2]
      } else {
        return null
      }
    },
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>
<style lang="less" scoped>
.cap_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 10px;
}
.el-input {
  width: 120px;
}
</style>
