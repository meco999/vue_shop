<template>
  <div id="app">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 权限列表区域 -->
      <template>
        <el-table :data="rightsList" style="width: 100%" stripe border>
          <el-table-column type="index" label="#" width="50px" align="center">
          </el-table-column>
          <el-table-column prop="authName" label="权限名称" align="center">
          </el-table-column>
          <el-table-column prop="path" label="路径" align="center">
          </el-table-column>
          <el-table-column prop="level" label="权限等级" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.level === '0'">一级</el-tag>
              <el-tag type="success" v-if="scope.row.level === '1'">二级</el-tag>
              <el-tag type="warning" v-if="scope.row.level === '2'">三级</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-card>
  </div>
</template>
<script>
export default {
  created() {
    this.getRightsList()
  },
  data() {
    return {
      rightsList: []
    }
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list')
    //   console.log(res.data.level)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rightsList = res.data
    }
  }
}
</script>
<style scoped></style>
