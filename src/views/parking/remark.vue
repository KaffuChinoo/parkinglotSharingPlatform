<template>
  <div>
    <!--搜索栏-->
    <el-card id="search">
      <el-row>
        <el-col :span="20">
          <el-input v-model="searchForm.commentId" placeholder="评论ID" clearable></el-input>
          <el-button @click="getCommentList" type="primary" icon="el-icon-search">查询</el-button>
        </el-col>
      </el-row>
    </el-card>

    <el-card>
      <el-table :data="commentList" stripe style="width: 100%">
        <el-table-column type="expand">
          <template v-slot="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="评价内容">
                <el-input
                  type="textarea"
                  v-model="props.row.content"
                  :autosize="{ minRows: 4, maxRows: 8}"
                  readonly
                  style="width: 700px"
                ></el-input>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="index" prop="date" label="#" width="120">

        </el-table-column>
        <el-table-column prop="commentId" label="评论ID" width="120" sortable>

        </el-table-column>
        <el-table-column prop="username" label="评价者" width="220">

        </el-table-column>
        <el-table-column prop="commentTime" label="评价时间" width="320" sortable>

        </el-table-column>
        <el-table-column prop="rating" label="评分" width="220" sortable>
          <template v-slot="scope">
            <el-rate v-model="scope.row.rating" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate>
          </template>
        </el-table-column>
        <el-table-column prop="orderId" label="订单ID" sortable>

        </el-table-column>
        <el-table-column label="管理" width="160">
          <template v-slot="scope">
            <el-button @click="openCommentDialog(scope.row.commentId)" type="" icon="el-icon-edit" size="small" circle></el-button>
            <el-button @click="deleteComment(scope.row.commentId)" type="" icon="el-icon-delete" size="small" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--分页-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="searchForm.pageNo"
      :page-sizes="[5, 10, 20, 40]"
      :page-size="searchForm.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <!--评价表单-->
    <el-dialog title="编辑评价" :visible.sync="dialogFormVisible">
      <el-form :model="commentForm" ref="commentFormRef">
        <el-form-item label="车位评价" prop="price" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="commentForm.content" :autosize="{ minRows: 4, maxRows: 8}"></el-input>
        </el-form-item>
        <el-form-item label="车位评分" prop="price" :label-width="formLabelWidth">
          <el-rate v-model="commentForm.rating" show-text :colors="colors"></el-rate>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消修改</el-button>
        <el-button type="primary" @click="submitCommentForm">确认修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import commentApi from '@/api/commentManager'

export default {
  data() {
    return {
      formLabelWidth: '130px',
      commentForm: {},
      dialogFormVisible: false,
      title: '',
      searchForm: {
        pageNo: 1,
        pageSize: 10,
        username: this.$store.state.user.name
      },
      commentList: [],
      total: 0,
      colors: ['#99A9BF', '#F7BA2A', '#FF9900']
    }
  },
  methods: {
    getCommentList() {
      if (!this.searchForm.address) {
        delete this.searchForm.address
      }
      if (!this.searchForm.price) {
        delete this.searchForm.price
      }
      commentApi.getCommentList(this.searchForm).then(response => {
        this.commentList = response.data.rows
        this.total = response.data.total
      })
    },
    handleSizeChange(pageSize) {
      this.searchForm.pageSize = pageSize
      this.getCommentList()
    },
    handleCurrentChange(pageNo) {
      this.searchForm.pageNo = pageNo
      this.getCommentList()
    },
    openCommentDialog(commentId) {
      commentApi.getCommentById(commentId).then(response => {
        this.commentForm = response.data
      })
      this.dialogFormVisible = true
    },
    submitCommentForm() {
      commentApi.createComment(this.commentForm).then(response => {
        this.dialogFormVisible = false
        this.$message({
          type: 'success',
          message: '感谢您的评价'
        })
        this.getCommentList()
      })
    },
    deleteComment(commentId) {
      this.$confirm(`确定要删除评论 ${commentId} 吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        commentApi.deleteCommentById(commentId).then(response => {
          this.$message({
            type: 'success',
            message: response.message
          })
          // 刷新
          this.getCommentList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  },
  created() {
    this.getCommentList()
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

.el-select .el-input {
  width: 85%;
}

.el-dialog .el-textarea {
  width: 85%;
}
</style>
