<template>
  <div>
    <div class="card-list">
      <el-card style="width: 300px; height: 390px" shadow="hover">
        <div class="welcome-container">
          <div class="welcome-text">欢迎！{{ name }}</div>
          <el-image
            style="width: 100px; height: 100px; margin-top: 20px"
            :src="this.$store.state.user.avatar"
          >
          </el-image>
        </div>
        <div v-if="this.$store.state.user.role === 1">
          <div class="dashboard-container">
            <div class="dashboard-text">☺用户名: {{ name }}☺</div>
            <div class="dashboard-text">☺角色: 管理员☺</div>
          </div>
        </div>
        <div v-else>
          <div class="dashboard-container">
            <div class="dashboard-text">☺用户名: {{ name }}☺</div>
            <div class="dashboard-text">☺角色: 用户☺</div>
          </div>
        </div>
        <div>
          <div class="dashboard-container">
            <el-button type="text" @click="openDrawer" style="font-size: 18px">查看 / 编辑个人信息</el-button>
          </div>
        </div>
      </el-card>
      <el-card style="margin-left: 20px; width: 70%; height: 390px" shadow="hover">
        <el-image
          style="width: 1000px; height: 260px; margin-top: 40px"
          src="https://img1.baidu.com/it/u=85008395,2599160647&fm=253&fmt=auto&app=138&f=JPG?w=437&h=123"
        >
        </el-image>
      </el-card>
    </div>

    <el-divider><i class="el-icon-star-off"></i></el-divider>

    <div class="welcome-container">
      <div style="font-size: 24px"><i class="el-icon-magic-stick"></i> 精选车位 <i class="el-icon-magic-stick"></i></div>
    </div>

    <el-carousel :interval="4000" type="card" height="500px">
      <el-carousel-item v-for="item in parkingLotList" :key="item">
        <el-image :src="item.imageUrl" style="width: 100%; height: 100%">
        </el-image>
      </el-carousel-item>
    </el-carousel>

    <el-divider><i class="el-icon-truck"></i></el-divider>

    <div class="welcome-container">
      <div style="font-size: 24px"><i class="el-icon-star-off"></i> 为您推荐 <i class="el-icon-star-off"></i></div>
    </div>

    <div class="card-list">
      <el-card v-for="rowData in parkingLotList" :key="rowData.index" :body-style="{ padding: '0px' }" shadow="hover" class="my-card">
        <el-image :src="rowData.imageUrl" class="image" style="height: 300px"></el-image>
        <div style="padding: 14px;">
          <span>{{ rowData.district }} - {{ rowData.address }}的车位</span>
          <div class="bottom clearfix">
            <time class="time">可用时段： {{ rowData.availableTime }}</time>
            <br><br>
            <time class="time">车位面积： {{ rowData.area }} ㎡</time>
            <br><br>
            <time class="highlight">车位价格： {{ rowData.price }} 元 / 次</time>
            <br><br>
            <time class="time">发布者： {{ rowData.username }} </time>
            <br><br>
            <div>
              <div v-if="rowData.avgRating === 0">
                <time class="time">用户评分： 暂无评分</time>
              </div>
              <div v-else>
                <time class="time">用户评分：</time>
                <el-rate
                  v-model="rowData.avgRating"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value}"
                  style="margin-left: 70px; margin-top: -17px">
                </el-rate>
              </div>
            </div>
            <br><br>
            <el-tag v-if="rowData.status === 1">可用</el-tag>
            <el-tag v-else type="info">已出租</el-tag>

            <el-button v-if="rowData.status === 1" @click="openEditDialog(rowData.parkingLotId)" type="text" class="button" style="font-size: 18px">
              点我预订
            </el-button>
            <el-button v-else type="text" class="button" style="font-size: 18px" disabled>
              无法预订
            </el-button>

            <time class="time" style="font-size: 16px; margin-left: 25px">{{ rowData.followCount }} 人关注</time>
            <el-button v-if="rowData.isFollowed === false" @click="createFollow(rowData.parkingLotId)" type="text" class="button" style="font-size: 18px; color: #E6A23C; margin-right: 15px">
              添加关注
            </el-button>
            <el-button v-else @click="deleteFollow(rowData.parkingLotId)" type="text" class="button" style="font-size: 18px; margin-right: 15px; color: #F56C6C">
              取消关注
            </el-button>
          </div>
        </div>
      </el-card>
    </div>

    <el-divider>已经到底了</el-divider>

    <!--订单表单-->
    <el-dialog @close="clearEditForm" :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="parkingLotForm" ref="parkingLotFormRef">
        <el-form-item label="车位区域：" prop="district" :label-width="formLabelWidth">
          <div>{{ parkingLotForm.district }}</div>
        </el-form-item>
        <el-form-item label="车位地址：" prop="address" :label-width="formLabelWidth">
          <div>{{ parkingLotForm.address }}</div>
        </el-form-item>
        <el-form-item label="出租价格：" prop="price" :label-width="formLabelWidth">
          <div>{{ parkingLotForm.price }} 元 / 次</div>
        </el-form-item>
        <el-form-item label="车位面积：" prop="area" :label-width="formLabelWidth">
          <div>{{ parkingLotForm.area }} ㎡</div>
        </el-form-item>
        <el-form-item label="可用时段：" prop="availableTime" :label-width="formLabelWidth">
          <el-time-picker
            v-model="parkingLotForm.availableTime"
            placeholder="选择时间"
            disabled
          >
          </el-time-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">下订单</el-button>
      </div>
    </el-dialog>

    <!--用户信息抽屉-->
    <el-drawer
      title="编辑个人信息"
      :visible.sync="dialog"
      direction="ltr"
      custom-class="demo-drawer"
      ref="drawer"
    >
      <div class="demo-drawer__content">
        <el-form :model="userForm" ref="userFormRef" :rules="rules">
          <el-form-item label="用户名" prop="username" :label-width="formLabelWidth" style="margin-right: 50px">
            <el-input v-model="userForm.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="登录密码" prop="password" :label-width="formLabelWidth" style="margin-right: 50px">
            <el-input v-model="userForm.password" autocomplete="off" type="password"></el-input>
          </el-form-item>
          <el-form-item label="管理员权限" :label-width="formLabelWidth" style="margin-right: 50px">
            <el-switch v-model="userForm.role" :active-value="1" :inactive-value="0" active-text="开" inactive-text="关" disabled>
            </el-switch>
          </el-form-item>
          <el-form-item label="电子邮箱" prop="email" :label-width="formLabelWidth" style="margin-right: 50px">
            <el-input v-model="userForm.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="头像URL" prop="avatar" :label-width="formLabelWidth" style="margin-right: 50px">
            <el-input v-model="userForm.avatar" autocomplete="off" clearable></el-input>
          </el-form-item>
          <el-form-item label="头像预览" :label-width="formLabelWidth">
            <el-image
              style="width: 200px; height: 200px"
              :src="userForm.avatar">
            </el-image>
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer" align="right" style="margin-right: 40px">
          <el-button @click="closeDrawer">取 消</el-button>
          <el-button type="primary" @click="submitUserForm">确 定</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import parkingLotApi from '@/api/parkingLotManager'
import userApi from '@/api/userManager'
import followApi from '@/api/followManager'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name',
      'role'
    ])
  },
  data() {
    return {
      formLabelWidth: '130px',
      parkingLotForm: {},
      userForm: {},
      dialogFormVisible: false,
      title: '',
      searchForm: {
        pageNo: 1,
        pageSize: 10
      },
      parkingLotList: [],
      total: 0,
      dialog: false,
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
      this.$refs.parkingLotFormRef.validate((valid) => {
        if (valid) {
          // 提交
          if (this.parkingLotForm.status === 1) {
            this.parkingLotForm.status = 0
          }
          parkingLotApi.saveParkingLotOrder(this.parkingLotForm, this.$store.state.user.name).then(response => {
            this.$message({
              message: '创建订单成功',
              type: 'success'
            })
            // 关闭对话框
            this.dialogFormVisible = false
            this.getParkingLotList()
          })
        } else {
          return false
        }
      })
    },
    submitUserForm() {
      this.$refs.userFormRef.validate((valid) => {
        if (valid) {
          this.$confirm('确定要修改信息吗？')
            .then(_ => {
              // 提交
              userApi.saveUser(this.userForm).then(response => {
                this.$message({
                  message: response.message,
                  type: 'success'
                })
                // 关闭对话框
                this.dialog = false
              })
            })
            .catch(_ => {})
        } else {
          return false
        }
      })
    },
    clearEditForm() {
      this.parkingLotForm = {}
      this.$refs.parkingLotFormRef.clearValidate()
    },
    openEditDialog(id) {
      if (id === null) {
        this.title = '添加车位'
      } else {
        this.title = '检查您的订单'
        // 根据id查询数据
        parkingLotApi.getParkingLotById(id).then(response => {
          this.parkingLotForm = response.data
        })
      }
      this.dialogFormVisible = true
    },
    handleSizeChange(pageSize) {
      this.searchForm.pageSize = pageSize
      this.getParkingLotList()
    },
    handleCurrentChange(pageNo) {
      this.searchForm.pageNo = pageNo
      this.getParkingLotList()
    },
    getParkingLotList() {
      if (!this.searchForm.address) {
        delete this.searchForm.address
      }
      if (!this.searchForm.price) {
        delete this.searchForm.price
      }
      if (!this.searchForm.creator) {
        delete this.searchForm.creator
      }
      if (!this.searchForm.status) {
        delete this.searchForm.status
      }
      this.searchForm.username = this.$store.state.user.name
      parkingLotApi.getParkingLotList(this.searchForm).then(response => {
        this.parkingLotList = response.data.rows
        this.total = response.data.total
      })
    },
    openDrawer() {
      this.dialog = true
      userApi.getUserByName(this.$store.state.user.name).then(response => {
        this.userForm = response.data
      })
    },
    closeDrawer() {
      this.userForm = {}
      this.dialog = false
    },
    createFollow(parkingLotId) {
      followApi.createFollow(parkingLotId, this.$store.state.user.name).then(response => {
        this.$message({
          message: response.message,
          type: 'success'
        })
        this.getParkingLotList()
      })
    },
    deleteFollow(parkingLotId) {
      followApi.deleteFollow(parkingLotId, this.$store.state.user.name).then(response => {
        this.$message({
          message: response.message,
          type: 'success'
        })
        this.getParkingLotList()
      })
    }
  },
  created() {
    this.getParkingLotList()
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 20px;
  }
  &-text {
    font-size: 22px;
    line-height: 32px;
  }
}

.welcome {
  &-container {
    margin: 20px;
  }
  &-text {
    font-size: 30px;
    line-height: 42px;
  }
}

.my-card {
  width: 400px;
  height: 535px;
}

.card-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.card-list .my-card {
  width: calc(25.00% - 20px);
  margin-right: 20px;
  margin-bottom: 20px;
}

.card-list .my-card:last-child {
  margin-right: 0;
}

.time {
  font-size: 13px;
  color: #939393;
}

.highlight {
  font-size: 13px;
  color: #ff6969;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

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

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
</style>
