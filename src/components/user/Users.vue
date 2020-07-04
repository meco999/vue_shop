<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <!-- :gutter="20"是指定区域间的间隔的 -->
      <el-row :gutter="20">
        <!-- :span="7"是指定该区域的宽度 -->
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->

      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index" label=""> </el-table-column>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="slotProps">
            <el-switch
              v-model="slotProps.row.mg_state"
              @change="userStateChange(slotProps.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="role_name" label="操作" width="180px">
          <template slot-scope="scope">
            <!-- slot-scope="scope" -->
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            >
            </el-button>
            <!-- 删除按钮 -->
            <el-button
              type="warning"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip
              :enterable="false"
              effect="dark"
              content="分配角色"
              placement="top-start"
            >
              <el-button
                type="danger"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主体区域 -->
      <!-- 添加用户的表单 -->
      <el-form
        :model="addUserForm"
        :rules="addUserFormRules"
        ref="addUserFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input> </el-form-item
        ><el-form-item label="密码" type="password" prop="password">
          <el-input v-model="addUserForm.password"></el-input> </el-form-item
        ><el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input> </el-form-item
        ><el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 主体区域 -->
      <el-form
        ref="editUserFormRef"
        :model="editForm"
        :rules="editUserFormRules"
        label-width="70px"
      >
        <el-form-item label="姓名">
          <el-input v-model="editForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色的对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClosed"
    >
      <div>
        <p>当前的用户：{{ userInfo.username }}</p>
        <p>当前的角色：{{ userInfo.role_name }}</p>
        <p>
          分配角色：
          <template>
            <el-select v-model="selectedRoleId" placeholder="请选择">
              <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </template>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    // 校验邮箱,第一个是规则，第二个是需要验证的值，第三个是校验成功的callback函数
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (regEmail.test(value)) {
        // 验证通过
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    // 校验手机号的规则
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        // 验证通过
        return callback()
      }
      callback(new Error('请输入合法的手机号码'))
    }
    return {
      // 角色列表
      roleList: [],
      // 当前用户信息
      userInfo: '',
      // 分配角色的对话框的显示与否
      setRoleDialogVisible: false,
      // 修改用户信息时得到对应的用户信息(查询到的用户对象)
      editForm: {},
      // 添加用户表单的数据绑定对象
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户表单的验证规则对象
      addUserFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        // 邮箱验证规则
        email: [
          { required: true, message: '请填写邮箱', trigger: 'blur' },
          { validator: checkEmail, message: '请正确填写邮箱', trigger: 'blur' }
        ],
        // 手机号验证规则
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {
            validator: checkMobile,
            message: '请正确输入手机号码',
            trigger: 'blur'
          }
        ]
      },
      //   修改用户信息表单的验证规则对象
      editUserFormRules: {
        // 邮箱验证规则
        email: [
          { required: true, message: '请填写邮箱', trigger: 'blur' },
          { validator: checkEmail, message: '请正确填写邮箱', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {
            validator: checkMobile,
            message: '请正确输入手机号码',
            trigger: 'blur'
          }
        ]
      },
      // 控制是否显示添加用户对话框
      addDialogVisible: false,
      //   控制是否显示修改用户的对话框
      editDialogVisible: false,
      //查询用户信息的参数
      queryInfo: {
        //   搜索关键字
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      //保存请求回来的用户列表数据和总数
      userList: [],
      total: 0,
      //   保存的是用户在下拉框中选择的角色id
      selectedRoleId: ''
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    //   监听分配角色对话框关闭事件
    setRoleDialogClosed(){
        this.userInfo = ''
        this.selectedRoleId = ''
    },
    //   点击确定修改用户角色
    async saveRoleInfo() {
      // 首先判断用户有没有修改角色
      if (!this.selectedRoleId) return this.$message.error('请选择角色！')
      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectedRoleId
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success('修改角色成功')
      this.getUserList()
      this.setRoleDialogVisible = false
    },
    //   展示分配角色的对话框
    async setRole(userInfo) {
      this.userInfo = userInfo
      // 在显示对话框之前获取所有的角色列表
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色失败')
      }
      //   console.log(res.data)
      this.roleList = res.data
      // 显示对话框
      this.setRoleDialogVisible = true
    },
    //   根据id删除对应的用户
    async removeUserById(id) {
      // console.log(id)
      // 弹框询问用户是否删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      // 如果用户点击确定，返回confirm字符串
      // 如果用户点击取消，返回cancle字符串
      //   console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('users/' + id)
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.getUserList()
    },
    //   提交用户修改的表单
    editUserInfo() {
      this.$refs.editUserFormRef.validate(async valid => {
        if (!valid) return

        // 验证通过发起修改用户的请求
        // 因为之前在获取用户信息的时候，将得到的用户信息都赋值给了editForm
        // 所以可以直接通过editForm来得到需要的信息
        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          { email: this.editForm.email, mobile: this.editForm.mobile }
        )
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('更新用户信息失败')
        }
        // 关闭对话框
        this.editDialogVisible = false
        // console.log(res)
        // 重新请求最新的数据
        this.getUserList()
        this.$message.success('更新用户信息成功')
      })
    },
    // 监听修改用户框的关闭事件
    editDialogClosed() {
      // 当表单被关闭时重置表单
      this.$refs.editUserFormRef.resetFields()
    },
    //   展示编辑用户的对话框
    async showEditDialog(id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get(`/users/${id}`, id)
      // console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error('查询用户失败')
      }
      this.editForm = res.data
    },
    //   当用户点击确定按钮时发送添加用户的请求
    addUser() {
      this.$refs.addUserFormRef.validate(async valid => {
        //   console.log(valid)
        if (valid === false) {
          return
        }
        const { data: res } = await this.$http.post('/users', this.addUserForm)
        // console.log(res.status)
        if (res.meta.status !== 201) {
          this.$message.error(res.meta.msg)
        } else {
          this.$message.success('添加用户成功')
        }
        // 隐藏添加用户的表单
        this.addDialogVisible = false
        // 重新获取用户列表数据
        this.getUserList()
      })
    },
    // 监听对话框的关闭事件
    addDialogClosed() {
      //对话框关闭之后，重置表单
      this.$refs.addUserFormRef.resetFields()
    },
    async getUserList() {
      //   params包裹的是需要传递的三个参数
      //   将响应的data数据结构重命名为res
      const { data: res } = await this.$http.get('/users', {
        params: this.queryInfo
      })
      //   console.log(res)
      //   如果状态错误则报错
      if (res.meta.status !== 200)
        return this.$message.error('获取用户信息失败')
      // 如果状态正常则将其请求回来的数据保存
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 监听SizeChange事件 有一个返回值，就是用户选择的页码数
    handleSizeChange(newSize) {
      // 当每页显示多少条数据变化后，应该根据这个数值来重新发起请求，请求数据
      this.queryInfo.pagesize = newSize
      this.getUserList()
      //   console.log(newSize)
    },
    // 监听页码值改变的事件 返回值是最新的页码
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
      //   console.log(newPage)
    },
    // 监听用户状态（switch开关）的变化
    async userStateChange(userInfo) {
      // 获取点击那一列的用户信息
      // console.log(`/users/${userInfo.id}/state/${userInfo.mg_state}`)
      const { data: res } = await this.$http.put(
        `/users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      //   console.log(res)
      if (res.meta.status !== 200) {
        //   当修改失败时，页面中的状态已经被修改了，所以我们需要将他重置为原来的
        res.mg_state = !res.mg_state
        return this.$message.error('修改状态失败')
      } else {
        this.$message.success(res.meta.msg)
      }
    }
  }
}
</script>
<style lang="less" scoped></style>
