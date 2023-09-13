<template>
  <div>
    <!--搜索栏-->
    <el-card id="search">
      <el-row>
        <el-col :span="20">
          <el-input v-model="searchForm.address" placeholder="地址" clearable></el-input>
          <el-input v-model="searchForm.price" placeholder="价格" clearable></el-input>
          <el-button @click="getParkingLotList" type="primary" icon="el-icon-search">查询</el-button>
        </el-col>

        <el-col :span="4" align="right">
          <el-button @click="openEditDialog(null)" type="primary" icon="el-icon-plus" circle></el-button>
        </el-col>
      </el-row>
    </el-card>

    <!--结果-->
    <el-card>
      <el-table :data="parkingLotList" stripe style="width: 100%">
        <el-table-column type="index" prop="date" label="#" width="80">

        </el-table-column>
        <el-table-column prop="parkingLotId" label="车位号" width="120" sortable>

        </el-table-column>
        <el-table-column prop="district" label="车位区域" width="100">

        </el-table-column>
        <el-table-column prop="address" label="车位地址" width="180">

        </el-table-column>
        <el-table-column prop="price" label="车位价格" width="120" sortable>

        </el-table-column>
        <el-table-column prop="area" label="车位面积" width="120" sortable>

        </el-table-column>
        <el-table-column prop="availableTime" label="可用时段" width="220">

        </el-table-column>
        <el-table-column prop="username" label="发布者" width="120">

        </el-table-column>
        <el-table-column prop="avgRating" label="评分" width="220" sortable>
          <template v-slot="scope">
            <el-rate v-model="scope.row.avgRating" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="车位状态" sortable>
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 1">可用</el-tag>
            <el-tag v-else type="info">已出租</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="车位预览" width="160">
          <template v-slot="scope">
            <div class="demo-image__preview">
              <el-image
                style="width: 130px; height: 100px"
                :src="scope.row.imageUrl"
                :preview-src="scope.row.imageUrl">
              </el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="管理" width="160">
          <template v-slot="scope">
            <div v-if="scope.row.status === 1">
              <el-button @click="openEditDialog(scope.row.parkingLotId)" type="" icon="el-icon-edit" size="small" circle></el-button>
              <el-button @click="deleteParkingLot(scope.row)" type="" icon="el-icon-delete" size="small" circle></el-button>
            </div>
            <div v-else>
              <el-button type="" icon="el-icon-edit" size="small" circle disabled></el-button>
              <el-button type="" icon="el-icon-delete" size="small" circle disabled></el-button>
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
      :page-sizes="[5, 10, 20, 40]"
      :page-size="searchForm.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <!--车位表单-->
    <el-dialog @close="clearEditForm" :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="parkingLotForm" ref="parkingLotFormRef" :rules="rules">
        <el-form-item label="车位区域" prop="district" :label-width="formLabelWidth">
          <el-select v-model="parkingLotForm.district" placeholder="请选择行政区">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车位地址" prop="address" :label-width="formLabelWidth">
          <el-input v-model="parkingLotForm.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="出租价格" prop="price" :label-width="formLabelWidth">
          <el-input v-model="parkingLotForm.price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="车位面积" prop="area" :label-width="formLabelWidth">
          <el-input v-model="parkingLotForm.area" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="可用时段" prop="availableTime" :label-width="formLabelWidth">
          <el-time-picker
            v-model="parkingLotForm.availableTime"
            placeholder="选择时间">
          </el-time-picker>
        </el-form-item>
<!--        <el-form-item label="车位状态" :label-width="formLabelWidth">-->
<!--          <el-switch v-model="parkingLotForm.status" :active-value="1" :inactive-value="0" active-text="可用" inactive-text="已出租">-->
<!--          </el-switch>-->
<!--        </el-form-item>-->
        <el-form-item label="经度" prop="lng" :label-width="formLabelWidth">
          <el-input v-model="parkingLotForm.lng" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="纬度" prop="lat" :label-width="formLabelWidth">
          <el-input v-model="parkingLotForm.lat" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="预览图URL" prop="imageUrl" :label-width="formLabelWidth">
          <el-input v-model="parkingLotForm.imageUrl" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="预览图" :label-width="formLabelWidth">
          <el-image
            style="width: 260px; height: 200px"
            :src="parkingLotForm.imageUrl">
          </el-image>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import parkingLotApi from '@/api/parkingLotManager'

export default {
  data() {
    return {
      formLabelWidth: '130px',
      parkingLotForm: {},
      dialogFormVisible: false,
      title: '',
      searchForm: {
        pageNo: 1,
        pageSize: 10,
        username: this.$store.state.user.name
      },
      parkingLotList: [],
      total: 0,
      rules: {
        district: [
          { required: true, message: '请选择车位区域', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入车位地址', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入出租价格', trigger: 'blur' }
        ],
        area: [
          { required: true, message: '请输入车位面积', trigger: 'blur' }
        ],
        availableTime: [
          { required: true, message: '请选择可用时段', trigger: 'blur' }
        ]
      },
      options: [{
        value: '江岸区',
        label: '江岸区'
      }, {
        value: '江汉区',
        label: '江汉区'
      }, {
        value: '硚口区',
        label: '硚口区'
      }, {
        value: '汉阳区',
        label: '汉阳区'
      }, {
        value: '武昌区',
        label: '武昌区'
      }, {
        value: '青山区',
        label: '青山区'
      }, {
        value: '洪山区',
        label: '洪山区'
      }]
    }
  },
  methods: {
    submitForm() {
      this.$refs.parkingLotFormRef.validate((valid) => {
        if (valid) {
          // 提交
          parkingLotApi.saveParkingLot(this.parkingLotForm).then(response => {
            this.$message({
              message: response.message,
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
    clearEditForm() {
      this.parkingLotForm = {}
      this.$refs.parkingLotFormRef.clearValidate()
    },
    openEditDialog(id) {
      if (id === null) {
        this.title = '添加车位'
        this.parkingLotForm.username = this.$store.state.user.name
        this.parkingLotForm.status = 1
      } else {
        this.title = '编辑车位'
        // 根据id查询数据
        this.parkingLotForm.username = null
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
      if (!this.searchForm.status) {
        delete this.searchForm.status
      }
      parkingLotApi.getParkingLotListByName(this.searchForm).then(response => {
        this.parkingLotList = response.data.rows
        this.total = response.data.total
      })
    },
    deleteParkingLot(parkingLot) {
      this.$confirm(`确定要删除车位 ${parkingLot.parkingLotId} 吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        parkingLotApi.deleteParkingLotById(parkingLot.parkingLotId).then(response => {
          this.$message({
            type: 'success',
            message: response.message
          })
          // 刷新
          this.getParkingLotList()
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
    this.getParkingLotList()
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
</style>
