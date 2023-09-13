<template>
  <div>
    <!--搜索栏-->
    <el-card id="search">
      <el-row>
        <el-col :span="20">
          <el-input v-model="searchForm.orderId" placeholder="订单号" clearable></el-input>
          <el-input v-model="searchForm.price" placeholder="订单金额" clearable></el-input>
          <el-button @click="getOrderList" type="primary" icon="el-icon-search">查询</el-button>
          <el-button @click="getCompletedOrderList" type="primary" icon="el-icon-s-order">历史订单</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!--结果-->
    <el-card>
      <el-table :data="orderList" stripe style="width: 100%" :default-sort="{prop: 'status', order: 'descending'}">
        <el-table-column type="index" prop="date" label="#" width="120">

        </el-table-column>
        <el-table-column prop="orderId" label="订单号" width="120" sortable>

        </el-table-column>
        <el-table-column prop="parkingLotId" label="车位号" width="120" sortable>

        </el-table-column>
        <el-table-column prop="rentTime" label="订单创建时间" width="320" sortable>

        </el-table-column>
        <el-table-column prop="username" label="订单创建者" width="180">

        </el-table-column>
        <el-table-column prop="rentPrice" label="订单金额" sortable width="180">

        </el-table-column>
        <el-table-column prop="status" label="订单状态">
          <template v-slot="scope">
            <el-tag v-if="scope.row.status === 1">进行中</el-tag>
            <el-tag v-else-if="scope.row.status === 0" type="success">待评价</el-tag>
            <el-tag v-else type="info">已完成</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="订单操作" width="200">
          <template v-slot="scope">
            <div v-if="scope.row.status === 1">
              <el-button @click="open(scope.row.parkingLotId, scope.row.orderId)" type="primary" icon="el-icon-check" round>
                结束订单
              </el-button>
            </div>
            <div v-else-if="scope.row.status === 0">
              <el-button @click="openCommentDialog(scope.row.orderId)" type="success" icon="el-icon-chat-dot-round" round>
                评价车位
              </el-button>
            </div>
            <div v-else>
              <el-button type="info" icon="el-icon-info" round disabled>
                已评价
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--分页-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="searchForm.pageNo"
      :page-sizes="[30, 100, 200, 400]"
      :page-size="searchForm.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <!--评价表单-->
    <el-dialog @close="clearEditForm" title="编辑评价" :visible.sync="dialogFormVisible">
      <el-form :model="commentForm" ref="commentFormRef">
        <el-form-item label="车位评价" prop="price" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="commentForm.content" :autosize="{ minRows: 4, maxRows: 8}"></el-input>
        </el-form-item>
        <el-form-item label="车位评分" prop="price" :label-width="formLabelWidth">
          <el-rate v-model="commentForm.rating" show-text :colors="colors"></el-rate>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消评价</el-button>
        <el-button type="primary" @click="submitCommentForm">确认评价</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import orderApi from '@/api/orderManager'
import commentApi from '@/api/commentManager'

export default {
  data() {
    return {
      formLabelWidth: '130px',
      orderForm: {},
      commentForm: {
        rating: 5,
        username: this.$store.state.user.name
      },
      dialogFormVisible: false,
      title: '',
      searchForm: {
        pageNo: 1,
        pageSize: 100,
        username: this.$store.state.user.name
      },
      orderList: [],
      total: 0,
      value: 5,
      colors: ['#99A9BF', '#F7BA2A', '#FF9900']
    }
  },
  methods: {
    handleSizeChange(pageSize) {
      this.searchForm.pageSize = pageSize
      this.getOrderList()
    },
    handleCurrentChange(pageNo) {
      this.searchForm.pageNo = pageNo
      this.getOrderList()
    },
    clearEditForm() {
      this.commentForm = {}
      this.$refs.commentFormRef.clearValidate()
    },
    getOrderList() {
      if (!this.searchForm.price) {
        delete this.searchForm.price
      }
      if (!this.searchForm.orderId) {
        delete this.searchForm.orderId
      }
      orderApi.getOrderList(this.searchForm).then(response => {
        this.orderList = response.data.rows.filter(order => order.status !== -1)
        this.total = this.orderList.length
      })
    },
    getCompletedOrderList() {
      if (!this.searchForm.price) {
        delete this.searchForm.price
      }
      if (!this.searchForm.orderId) {
        delete this.searchForm.orderId
      }
      orderApi.getOrderList(this.searchForm).then(response => {
        this.orderList = response.data.rows.filter(order => order.status === -1)
        this.total = this.orderList.length
      })
    },
    updateStatus(parkingLotId, orderId) {
      orderApi.updateStatus(parkingLotId, orderId).then(response => {
        this.$message({
          type: 'success',
          message: '订单已完成'
        })
        this.getOrderList()
      })
    },
    openCommentDialog(orderId) {
      this.dialogFormVisible = true
      this.commentForm.orderId = orderId
      this.commentForm.username = this.$store.state.user.name
    },
    submitCommentForm() {
      commentApi.createComment(this.commentForm).then(response => {
        this.dialogFormVisible = false
        this.$message({
          type: 'success',
          message: '感谢您的评价'
        })
        this.getOrderList()
      })
    },
    open(parkingLotId, orderId) {
      this.$confirm('是否确认您的订单已经完成?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.updateStatus(parkingLotId, orderId)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    }
  },
  created() {
    this.getOrderList()
  }
}
</script>

<style scoped>
#search .el-input {
  width: 300px;
  margin-right: 15px;
}

.el-dialog .el-input {
  width: 85%;
}

.el-dialog .el-textarea {
  width: 85%;
}

.el-select .el-input {
  width: 85%;
}

.el-rate {
  margin-top: 10px;
}
</style>
