<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加分类区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCate">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
        class="treeTable"
        :data="cateList"
        :columns="columns"
        :expand-type="false"
        :selection-type="false"
        align="center"
        :show-index="true"
        index-text="#"
        border
      >
        <template slot="isok" slot-scope="scope">
          <i
            v-if="scope.row.cat_deleted === false"
            class="el-icon-success"
            style="color:#67C23A"
          ></i>
          <i v-else class="el-icon-error" style="color:#E6A23C"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            plain
            v-if="scope.row.cat_level === 0"
            >一级</el-button
          >
          <el-button
            size="mini"
            type="success"
            plain
            v-else-if="scope.row.cat_level === 1"
            >二级</el-button
          >
          <el-button size="mini" type="warning" plain v-else>三级</el-button>
        </template>
        <template slot="handle" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editCateDialog(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-deletd"
            size="mini"
            @click="deleteCateBox(scope.row)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页 -->
      <div>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="this.queryInfo.pagenum"
          :page-size="this.queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[3, 5, 10, 15]"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateFormDialogClosed"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- option指定数据源 -->
          <!-- props指定配置项 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
          ></el-cascader
        ></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="commitAddCateForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类的对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
      @close="editCateFormDialogClosed"
    >
      <el-form
        :model="editCateForm"
        :rules="addCateRules"
        ref="editCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="commitEditCateForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 当前的用户信息
      userInfo: {},
      // 编辑表单是否可见
      editCateDialogVisible: false,
      // 保存编辑分类的表单
      editCateForm: {
        cat_name: ''
      },
      // 保存在添加分类框，用户选择的分类id
      selectedKeys: [],
      // 级联选择器的配置对象
      cascaderProps: {
        //   表示选中之后的值，这里用id来表示用户选中的项
        value: 'cat_id',
        // 表示用户在界面上看到的选项
        label: 'cat_name',
        // 通过哪个节点进行嵌套
        children: 'children',
        expandTrigger: 'hover'
      },
      // 所有的一二级分类
      parentCateList: [],
      // 添加分类框的验证规则
      addCateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 用户添加分类框 对象
      addCateForm: {
        //   分类名称
        cat_name: '',
        //   要添加分类的父级id，默认为1级分类（如果是2级分类，则为1，以此类推）
        cat_pid: 0,
        //   要添加的分类等级默认为1级分类
        cat_level: 0
      },
      // 添加分类框的可视性
      addCateDialogVisible: false,
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 保存商品分类列表
      cateList: [],
      //   保存商品列表的总条数
      total: 0,
      //   展示商品分类表格的表头设置
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          //   将是否有效列定义为模板列
          type: 'template',
          //   模板名称
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'handle'
        }
      ]
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    //   删除分类
    async deleteCateBox(info) {
      const confirmRsult = await this.$confirm(
        '此操作将永久删除该分类, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmRsult !== 'confirm') return this.$message.error('取消删除成功')
      const { data: res } = await this.$http.delete(`categories/` + info.cat_id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success('删除分类成功')
      this.getCateList()
    },
    //   点击确定，发送编辑分类的请求
    async commitEditCateForm() {
      // 在显示对话框之前，根据id查询点击用户的信息
      const { data: res } = await this.$http.put(
        `categories/` + this.userInfo.cat_id,
        this.editCateForm
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success('更新分类成功')
      this.getCateList()
      this.editCateDialogVisible = false
    },
    //   监听对话框的关闭事件
    editCateFormDialogClosed() {
      this.$refs.editCateFormRef.resetFields()
    },
    //   点击编辑按钮 显示编辑对话框
    async editCateDialog(userInfo) {
      this.userInfo = userInfo
      // 在显示对话框之前，根据id查询点击用户的信息
      const { data: res } = await this.$http.get(
        `categories/` + userInfo.cat_id
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editCateForm = res.data

      this.editCateDialogVisible = true
    },
    //   添加分类对话框的关闭事件
    addCateFormDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    //   点击确定，发送添加分类请求
    async commitAddCateForm() {
      console.log(this.addCateForm)
      // 表单预验证
      this.$refs.addCateFormRef.validate(valid => {
        if (!valid) return
      })
      const { data: res } = await this.$http.post(
        'categories',
        this.addCateForm
      )
      if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
      this.$message.success('添加分类成功')
      this.addCateDialogVisible = false
      this.getCateList()
    },
    //  添加分类级联框的change事件
    parentCateChange() {
      // 当用户选择了一个或者两个分类时，selectedKeys中的length大于0
      if (this.selectedKeys.length > 0) {
        // 无论用户选择的是一个还是两个分类，新添加的父级分类的id都是selectedKeys数组的最后一项
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        // 无论用户选择的是一个还是两个分类,他的分类等级是和selectedKeys中的length一样的
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        // 用户没有选中任何一个分类，将pid和level重置
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
      //   console.log(this.selectedKeys)
    },
    //   点击添加分类，弹出分类框
    addCate() {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 在添加分类的对话框显示之前，获取所有一二级分类
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200)
        return this.$message.error('获取父级商品分类失败')
      this.parentCateList = res.data
    },
    //   监听pagesize变化的事件
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getCateList()
    },
    // 监听每一页显示多少数据变化的事件
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getCateList()
    },
    //   获取商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200)
        return this.$message.error('获取商品分类失败')
      //   将数据列表赋值给商品列表
      this.cateList = res.data.result
      //   保存商品总条数
      this.total = res.data.total
      //   console.log(this.cateList)
    }
  }
}
</script>
<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
