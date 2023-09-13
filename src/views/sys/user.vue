<template>
  <div v-if="this.$store.state.user.role === 1">
    <!--搜索栏-->
    <el-card id="search">
      <el-row>
        <el-col :span="20">
          <el-input v-model="searchForm.username" placeholder="用户名" clearable></el-input>
          <el-input v-model="searchForm.email" placeholder="邮箱" clearable></el-input>
          <el-button @click="getUserList" type="primary" icon="el-icon-search">查询</el-button>
        </el-col>

        <el-col :span="4" align="right">
          <el-button @click="openEditDialog(null)" type="primary" icon="el-icon-plus" circle></el-button>
        </el-col>
      </el-row>
    </el-card>

    <!--结果-->
    <el-card>
      <el-table :data="userList" stripe style="width: 100%">
        <el-table-column type="index" prop="date" label="#" width="120">

        </el-table-column>
        <el-table-column prop="userId" label="UID" width="120">

        </el-table-column>
        <el-table-column prop="username" label="用户名" width="180">

        </el-table-column>
        <el-table-column prop="email" label="电子邮箱">

        </el-table-column>
        <el-table-column prop="role" label="用户角色" width="120">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.role === 1">管理员</el-tag>
            <el-tag v-else type="info">用户</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="管理" width="160">
          <template slot-scope="scope">
            <el-button @click="openEditDialog(scope.row.userId)" type="" icon="el-icon-edit" size="small" circle></el-button>
            <el-button @click="deleteUser(scope.row)" type="" icon="el-icon-delete" size="small" circle></el-button>
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

    <!--用户信息编辑-->
    <el-dialog @close="clearEditForm" :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="userForm" ref="userFormRef" :rules="rules">
        <el-form-item label="用户名" prop="username" :label-width="formLabelWidth">
          <el-input v-model="userForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="password" :label-width="formLabelWidth">
          <el-input v-model="userForm.password" autocomplete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item label="管理员权限" :label-width="formLabelWidth">
          <el-switch v-model="userForm.role" :active-value="1" :inactive-value="0" active-text="开" inactive-text="关">
          </el-switch>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email" :label-width="formLabelWidth">
          <el-input v-model="userForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="头像URL" prop="avatar" :label-width="formLabelWidth">
          <el-input v-model="userForm.avatar" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="头像预览" :label-width="formLabelWidth">
          <el-image
            style="width: 200px; height: 200px"
            :src="userForm.avatar">
          </el-image>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
  <div v-else>
    <div class="wscn-http404-container">
      <div class="wscn-http404">
        <div class="pic-404">
          <img class="pic-404__parent" src="@/assets/404_images/404.png" alt="404">
          <img class="pic-404__child left" src="@/assets/404_images/404_cloud.png" alt="404">
          <img class="pic-404__child mid" src="@/assets/404_images/404_cloud.png" alt="404">
          <img class="pic-404__child right" src="@/assets/404_images/404_cloud.png" alt="404">
        </div>
        <div>
          <span style="font-size: 1.5em">抱歉，您无权访问该页面</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import userApi from '@/api/userManager'

export default {
  data() {
    return {
      formLabelWidth: '130px',
      userForm: {},
      dialogFormVisible: false,
      title: '',
      total: 0,
      searchForm: {
        pageNo: 1,
        pageSize: 10
      },
      userList: [],
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 4, max: 64, message: '长度在 4 到 50 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮件地址', trigger: 'blur' },
          { type: 'email', message: '请输入有效的邮件地址', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs.userFormRef.validate((valid) => {
        if (valid) {
          // 提交
          userApi.saveUser(this.userForm).then(response => {
            this.$message({
              message: response.message,
              type: 'success'
            })
            // 关闭对话框
            this.dialogFormVisible = false
            this.getUserList()
          })
        } else {
          return false
        }
      })
    },
    clearEditForm() {
      this.userForm = {}
      this.$refs.userFormRef.clearValidate()
    },
    openEditDialog(id) {
      if (id === null) {
        this.title = '添加用户'
      } else {
        this.title = '编辑用户'
        // 根据id查询数据
        userApi.getUserById(id).then(response => {
          this.userForm = response.data
        })
      }
      this.dialogFormVisible = true
    },
    handleSizeChange(pageSize) {
      this.searchForm.pageSize = pageSize
      this.getUserList()
    },
    handleCurrentChange(pageNo) {
      this.searchForm.pageNo = pageNo
      this.getUserList()
    },
    getUserList() {
      if (!this.searchForm.username) {
        delete this.searchForm.username
      }
      if (!this.searchForm.email) {
        delete this.searchForm.email
      }
      userApi.getUserList(this.searchForm).then(response => {
        this.userList = response.data.rows
        this.total = response.data.total
      })
    },
    deleteUser(user) {
      this.$confirm(`确定要删除用户 ${user.username} 吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        userApi.deleteUserById(user.userId).then(response => {
          this.$message({
            type: 'success',
            message: response.message
          })
          // 刷新
          this.getUserList()
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
    this.getUserList()
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
</style>
