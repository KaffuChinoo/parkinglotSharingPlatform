<template>
  <div>
    <!--车位表单-->
    <el-card>
      <el-form :model="parkingLotForm" ref="parkingLotFormRef" :rules="rules">
        <el-form-item label="车位地址" prop="address" :label-width="formLabelWidth">
          <el-input v-model="parkingLotForm.address" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="出租价格" prop="price" :label-width="formLabelWidth">
          <el-input v-model="parkingLotForm.price" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="车位状态" :label-width="formLabelWidth">
          <el-switch v-model="parkingLotForm.status" :active-value="1" :inactive-value="0" active-text="可用" inactive-text="已出租">
          </el-switch>
        </el-form-item>
        <el-form-item label="车位面积" prop="area" :label-width="formLabelWidth">
          <el-input v-model="parkingLotForm.area" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="可用时段" prop="availableTime" :label-width="formLabelWidth">
          <el-time-picker
            v-model="parkingLotForm.availableTime"
            placeholder="选择时间">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="预览图URL" prop="imageUrl" :label-width="formLabelWidth">
          <el-input v-model="parkingLotForm.imageUrl" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="预览图" :label-width="formLabelWidth">
          <el-image
            style="width: 260px; height: 200px"
            :src="parkingLotForm.imageUrl">
          </el-image>
        </el-form-item>
        <el-form-item prop="check" :label-width="formLabelWidth">
          <el-checkbox>我已阅读并同意《用户许可协议》与《车位发布须知》</el-checkbox>
        </el-form-item>
      </el-form>
      <div align="right" class="footer">
        <el-button type="primary" @click="submitForm" icon="el-icon-upload"> 发 布</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import parkingLotApi from '@/api/parkingLotManager'

export default {
  data() {
    return {
      formLabelWidth: '130px',
      parkingLotForm: {
        status: 1
      },
      rules: {
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
          { required: true, message: '请输入可用时段', trigger: 'blur' }
        ],
        check: [
          { required: false, message: '请勾选此栏', trigger: 'blur' }
        ]
      }
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
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.footer .el-button{
  width: 100px;
}

.footer {
  width: 43%;
}

.el-input {
  width: 40%;
}
</style>
