<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 添加商品区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品表格区域 -->
      <template>
        <el-table :data="goodsList" border stripe>
          <el-table-column type="index" align="center"> </el-table-column>
          <el-table-column prop="goods_name" label="商品名称"></el-table-column>
          <el-table-column
            prop="goods_price"
            label="商品价格（元）"
            width="100px"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="goods_weight"
            label="商品重量（g）"
            width="100px"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="upd_time"
            label="创建时间"
            width="180px"
            align="center"
            ><template slot-scope="scope"
              >{{ scope.row.upd_time | dateFormat }}
            </template></el-table-column
          >
          <el-table-column label="操作" width="180px" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteGoods(scope.row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 分页区域 -->
      <template>
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="this.total"
        >
        </el-pagination>
      </template>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      //   商品列表
      goodsList: [],
      //   总数据条数
      total: 0
    }
  },
  methods: {
    //   点击添加商品，跳转到添加商品页面
    goAddPage(){
        this.$router.push('/goods/add')
    },
    //   点击删除图标，删除商品
    async deleteGoods(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult === 'cancel') return this.$message.info('取消删除成功')
      const { data: res } = await this.$http.delete(`goods/` + id.goods_id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success('删除商品成功')
      this.getGoodsList()
    },
    //   监听 每页显示多少条数据 的变化
    handleSizeChange(val) {
      console.log(val)
      this.queryInfo.pagesize = val
      this.getGoodsList()
    },
    //   监听 当前页数 的变化
    handleCurrentChange(val) {
      console.log(val)
      this.queryInfo.pagenum = val
      this.getGoodsList()
    },
    //   获取商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: {
          query: this.queryInfo.query,
          pagenum: this.queryInfo.pagenum,
          pagesize: this.queryInfo.pagesize
        }
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
    //   this.$message.success('获取商品列表成功')

      this.goodsList = res.data.goods
      //   console.log(this.goodsList)
      this.total = res.data.total
    }
  },
  created() {
    this.getGoodsList()
  }
}
</script>
<style lang="less" scoped></style>
