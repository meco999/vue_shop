<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加商品区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getOrdersList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrdersList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="ordersList" border stripe>
        <el-table-column type="index"> </el-table-column>
        <el-table-column label="订单编号" prop="order_number">
        </el-table-column>
        <el-table-column label="订单价格" prop="order_price"> </el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status === '1'" type="success"
              >已付款</el-tag
            >
            <el-tag v-else type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"> </el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showBox"
            ></el-button
            ><el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="showProgressBox"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressDialogVisible"
      width="50%"
      @close="addressDialogClose"
    >
      <el-form
        :model="adressForm"
        :rules="adressFormRules"
        ref="adressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="adress1">
          <el-cascader
            v-model="adressForm.adress1"
            :options="cityData"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="adress2">
          <el-input v-model="adressForm.adress2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 展示物流进度的对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="progressDialogVisible"
      width="50%"
    >
      <!-- 物流进度对话框 -->
      <el-timeline :reverse="reverse">
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>
<script>
import cityData from './citydata.js'

export default {
  data() {
    return {
      reverse: false,
      progressInfo: {},
      progressDialogVisible: false,
      cityData,
      adressFormRules: {
        adress1: [{ required: true, message: '请选择地区', trigger: 'change' }],
        adress2: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      adressForm: {
        adress1: [],
        adress2: ''
      },
      // 修改地址对话框的可视
      addressDialogVisible: false,
      // 查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 保存订单列表
      ordersList: [],
      //   保存订单列表总条数
      total: 0
    }
  },
  methods: {
    async showProgressBox() {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.progressInfo = res.data
      this.progressDialogVisible = true
      //    console.log(this.progressInfo  )
    },
    //   情况选择框
    addressDialogClose() {
      this.$refs.adressFormRef.resetFields()
    },
    //   点击编辑按钮，弹出对话框
    showBox() {
      this.addressDialogVisible = true
    },
    //   获取订单列表
    async getOrdersList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      //   this.$message.success('获取商品列表成功')

      this.ordersList = res.data.goods
      //   console.log(this.ordersList)
      this.total = res.data.total
    },
    // 监听SizeChange事件 有一个返回值，就是用户选择的页码数
    handleSizeChange(newSize) {
      // 当每页显示多少条数据变化后，应该根据这个数值来重新发起请求，请求数据
      this.queryInfo.pagesize = newSize
      this.getOrdersList()
      //   console.log(newSize)
    },
    // 监听页码值改变的事件 返回值是最新的页码
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrdersList()
      //   console.log(newPage)
    }
  },
  created() {
    this.getOrdersList()
  }
}
</script>
<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
