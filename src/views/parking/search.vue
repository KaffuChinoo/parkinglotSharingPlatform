<template>
  <div>
    <!--搜索栏-->
    <el-card id="search">
      <el-row>
        <el-col :span="20">
          <el-input v-model="searchForm.address" placeholder="地址" clearable></el-input>
          <el-input v-model="searchForm.price" placeholder="价格" clearable></el-input>
          <el-input v-model="searchForm.creator" placeholder="发布者" clearable></el-input>
          <el-select v-model="searchForm.district" placeholder="请选择行政区" clearable>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button @click="getParkingLotList" type="primary" icon="el-icon-search" style="margin-left: 15px">查询</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!--结果-->
    <el-card>
      <el-table :data="parkingLotList" stripe style="width: 100%">
        <el-table-column type="index" prop="date" label="#" width="80">

        </el-table-column>
        <el-table-column prop="parkingLotId" label="车位号" width="100" sortable>

        </el-table-column>
        <el-table-column prop="district" label="车位区域" width="120">

        </el-table-column>
        <el-table-column prop="address" label="车位地址" width="160">

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
            <div v-if="scope.row.avgRating === 0">暂无评分</div>
            <div v-else>
              <el-rate v-model="scope.row.avgRating" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="车位状态" sortable>
          <template v-slot="scope">
            <el-tag v-if="scope.row.status === 1">可用</el-tag>
            <el-tag v-else type="info">已出租</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="availableTime" width="170">
          <template v-slot="scope">
            <div v-if="scope.row.status === 1">
              <el-button @click="openEditDialog(scope.row.parkingLotId)" type="primary" icon="el-icon-s-order" round>预订</el-button>
            </div>
            <div v-else>
              <el-button type="info" icon="el-icon-s-order" round disabled>预订</el-button>
            </div>
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
        pageSize: 10
      },
      parkingLotList: [],
      total: 0,
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
      if (!this.searchForm.district) {
        delete this.searchForm.district
      }
      parkingLotApi.getParkingLotList(this.searchForm).then(response => {
        this.parkingLotList = response.data.rows
        this.total = response.data.total
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
  width: 250px;
  margin-right: 15px;
}

.el-dialog .el-input {
  width: 85%;
}

.el-select .el-input {
  width: 85%;
}
</style>
