<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse == true ? '64px' : '200px'">
        <!-- 侧边栏菜单区域 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <el-submenu
            :index="item.id + '#'"
            v-for="item in menuLists"
            :key="item.id"
          >
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + items.path"
              v-for="items in item.children"
              :key="items.id"
              @click="saveNavState('/' + items.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ items.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      //   左侧菜单数据
      menuLists: [],
      iconsObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath:''

    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取菜单列表信息
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      //   console.log(res)
      // 提示错误信息
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // 将服务器返回的数组，挂载到data中的空数组里面去
      this.menuLists = res.data
    },
    //   点击按钮切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存菜单的激活状态
    saveNavState(path) {
      window.sessionStorage.setItem('activePath', path)
      this.activePath = path
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  background-color: #373d41;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .iconfont {
    font-size: 20px;
    margin-right: 10px;
  }
  .el-menu {
    border-right: none;
  }
  .toggle-button {
    background-color: #4a5064;
    color: #fff;
    text-align: center;
    font-size: 10px;
    letter-spacing: 3px;
    cursor: pointer;
    line-height: 20px;
  }
}
.el-main {
  background-color: #eaedf1;
}
</style>
