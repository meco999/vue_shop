<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 添加用户区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRole">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <template>
        <el-table :data="rolesList" style="width: 100%" stripe border>
          <!-- 展开列 -->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <!-- i1是索引 -->
              <el-row
                :class="[
                  'bdbottom',
                  i1 === 0 ? 'bdtop' : 'bdbottom',
                  'vcenter'
                ]"
                v-for="(item, i1) in scope.row.children"
                :key="item.id"
              >
                <!-- 渲染一级权限 通过:span="5"来设置每一列的宽度，总共有24格-->
                <el-col :span="5">
                  <el-tag
                    @close="removeRightById(scope.row, item.id)"
                    closable
                    >{{ item.authName }}</el-tag
                  >
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 渲染二级权限 -->
                <el-col :span="19">
                  <el-row
                    :class="[index1 === 0 ? '' : 'bdbottom', 'vcenter']"
                    v-for="(item1, index1) in item.children"
                    :key="item1.id"
                  >
                    <el-col :span="5">
                      <el-tag
                        type="success"
                        @close="removeRightById(scope.row, item1.id)"
                        closable
                        >{{ item1.authName }}</el-tag
                      >
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <el-tag
                        @close="removeRightById(scope.row, item2.id)"
                        closable
                        v-for="item2 in item1.children"
                        :key="item2.id"
                        type="warning"
                        size="mini"
                      >
                        {{ item2.authName }}</el-tag
                      >
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <!-- 索引列 -->
          <el-table-column type="index" label="#" align="center">
          </el-table-column>
          <el-table-column prop="roleName" label="角色名称" align="center">
          </el-table-column>
          <el-table-column prop="roleDesc" label="角色描述" align="center">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                class="el-icon-edit"
                size="mini"
                @click="editRole(scope.row)"
                >编辑</el-button
              >
              <el-button
                type="danger"
                class="el-icon-delete"
                size="mini"
                @click="deleteRole(scope.row.id)"
                >删除</el-button
              >
              <el-button
                type="warning"
                class="el-icon-setting"
                size="mini"
                @click="showSetRightsDialog(scope.row)"
                >分配权限</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-card>
    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightsDialogVisible"
      width="50%"
      @close="dialogClose"
    >
      <!-- 树形控件 -->
      <el-tree
        :default-checked-keys="defKes"
        show-checkbox=""
        node-key="id"
        :data="rightsList"
        :props="treetProps"
        default-expand-all
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加用户的表单 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserDialogVisible"
      width="50%"
      @close="addUserDialogClose"
    >
      <el-form
        :model="addRoleForm"
        :rules="addRoleRules"
        ref="addRoleFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="commitNewRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户的表单 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="editUserDialogVisible"
      width="50%"
    >
      <el-form
        :model="editRoleForm"
        :rules="addRoleRules"
        ref="editRoleFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="commitEditRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  created() {
    this.getRolesList()
  },
  data() {
    return {
      // 修改的角色信息
      editRoleForm: {},
      // 当前的用户信息
      userInfo: {},
      // 修改角色的对话框的是否显示
      editUserDialogVisible: false,
      // 添加角色的验证规则
      addRoleRules: {
        roleName: [{ required: true, message: '请输入角色名', trigger: 'blur' }]
      },
      // 保存添加的角色信息
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加用户的对话框是否可见
      addUserDialogVisible: false,
      // 分配权限对话框的是否可视
      setRightsDialogVisible: false,
      // 保存角色列表
      rolesList: [],
      //   所有权限的列表
      rightsList: [],
      //   树形控件的绑定对象
      treetProps: {
        children: 'children',
        label: 'authName'
      },
      defKes: [],
      //   当前即将分配权限的角色id
      roleId: ''
    }
  },
  methods: {
    //   点击删除按钮弹出是否确认删除框
    async deleteRole(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') return this.$message.info('取消删除成功')
      const { data: res } = await this.$http.delete(`roles/` + id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success('删除角色成功')
      this.getRolesList()
    },
    //   点击确定后将编辑角色表单提交
    async commitEditRoles() {
      const { data: res } = await this.$http.put(
        `roles/${this.userInfo.id}`,
        this.editRoleForm
      )
      if (res.meta.status !== 200) return this.$message.error('编辑角色失败')
      this.$message.success('编辑角色成功')
      this.getRolesList()
      this.editUserDialogVisible = false
    },
    //   编辑角色的表单
    async editRole(userInfo) {
      this.userInfo = userInfo
      const { data: res } = await this.$http.get(`roles/${userInfo.id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editRoleForm = res.data
      this.editUserDialogVisible = true
    },
    //   点击确定后发送请求添加用户
    async commitNewRoles() {
      this.$refs.addRoleFormRef.validate(valid => {
        if (!valid) return this.$message.error('请正确填写角色名')
      })
      const { data: res } = await this.$http.post('roles', this.addRoleForm)
      if (res.meta.status !== 201) return this.$message.error('添加角色失败')
      this.$message.success('添加角色成功')
      this.getRolesList()
      this.addUserDialogVisible = false
    },
    //   添加用户对话框的关闭事件
    addUserDialogClose() {
      this.$refs.addRoleFormRef.resetFields()
    },
    //  添加角色按钮的点击事件
    addRole() {
      this.addUserDialogVisible = true
    },
    //   获取所有角色的列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200)
        return this.$message.error('获取角色列表失败')
      this.rolesList = res.data
      //   console.log(res.data)
    },
    // 根据用户id删除对应的权限
    async removeRightById(role, id) {
      // console.log(id)
      const confirmResult = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('取消删除成功')
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${id}`
      )
      if (res.meta.status !== 200) return this.$message.error('删除权限失败')
      //   console.log(res.data)
      //   this.getRolesList()
      role.children = res.data
    },
    // 修改用户权限的对话框
    async showSetRightsDialog(role) {
      // 将id保存，方便后续使用
      this.roleId = role.id
      // 获取所有权限的数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取权限失败')
      //   把获取到的数据保存到data中
      this.rightsList = res.data
      // 通过递归获得三级权限的id
      this.getLeafKeys(role, this.defKes)
      this.setRightsDialogVisible = true
    },
    // 监听分配权限的对话框关闭事件
    dialogClose() {
      // 当对话框关闭时清空defKes的内容
      // 防止三级节点的id递增
      this.defKes = []
    },
    getLeafKeys(node, arr) {
      if (!node.children) return arr.push(node.id)
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 用户点击确定后 分配权限
    async allotRights(roleId) {
      // 获取用户选中的权限的id值
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // 包装成以逗号拼接的字符串
      const keysstr = keys.join(',')
      //   console.log(keysstr)
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        {
          rids: keysstr
        }
      )

      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getRolesList()
      this.setRightsDialogVisible = false
    }
  }
}
</script>
<style scoped>
.el-tag {
  margin: 7px;
}
.vcenter {
  display: flex;
  align-items: center;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
</style>
