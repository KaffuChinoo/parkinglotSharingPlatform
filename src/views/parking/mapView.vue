<template>
  <div>
    <el-card>
      <div class="welcome-text">
        可用车位标记地图
      </div>
    </el-card>
    <el-card>
      <baidu-map class="bm-view" center="武汉">
        <!--缩略图-->
        <bm-overview-map anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :isOpen="true"></bm-overview-map>
        <!--版权信息-->
        <bm-copyright
          anchor="BMAP_ANCHOR_TOP_LEFT"
          :copyright="[{id: 1, content: '<a>© 2023 CUG车位管理 </a>'}]"
        >
        </bm-copyright>
        <!--比例尺-->
        <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale>
        <!--缩放-->
        <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT">
        </bm-navigation>
        <!--车位标记-->
        <bml-marker-clusterer :average-center="true">
          <bm-marker
            v-for="(marker, index) in markers"
            :key="index"
            :position="{lng: marker.lng, lat: marker.lat}"
            @click="infoWindowOpen(marker)"
          >
            <bm-label
              content="P"
              :labelStyle="{color: '#fff', fontSize : '12px',background:'rgba(0, 0, 0, 0)',borderColor:'rgba(0, 0, 0, 0)'}"
              :offset="{width: 4,height:2 }"
            />
            <bm-info-window :show="marker.show" @close="infoWindowClose(marker)" @open="infoWindowOpen(marker)">
              <span>{{ marker.district }} - {{ marker.address }}的车位</span>
              <div class="bottom clearfix">
                <br>
                <time class="tips">可用时段： {{ marker.availableTime }}</time>
                <br>
                <time class="tips">车位面积： {{ marker.area }} ㎡</time>
                <br>
                <time class="highlight">车位价格： {{ marker.price }} 元 / 次</time>
                <br>
                <time class="tips">发布者： {{ marker.username }} </time>
                <br>
                <el-tag v-if="marker.status === 1">可用</el-tag>
                <el-tag v-else type="info">已出租</el-tag>

                <time class="tips" style="margin-left: 25px">{{ marker.followCount }} 人关注</time>

                <el-button v-if="marker.isFollowed === false" @click="createFollow(marker.parkingLotId)" type="text" class="button" style="font-size: 18px; color: #E6A23C; margin-left: 25px">
                  添加关注
                </el-button>
                <el-button v-else @click="deleteFollow(marker.parkingLotId)" type="text" class="button" style="font-size: 18px; margin-left: 25px; color: #F56C6C">
                  取消关注
                </el-button>

                <el-button v-if="marker.status === 1" @click="openEditDialog(marker.parkingLotId)" type="text" class="button" style="font-size: 18px; margin-left: 200px">点我预订</el-button>
                <el-button v-else type="text" class="button" style="font-size: 18px; margin-left: 200px" disabled>无法预订</el-button>
              </div>
            </bm-info-window>
          </bm-marker>
        </bml-marker-clusterer>
      </baidu-map>
    </el-card>

    <!--订单表单-->
    <el-dialog @close="clearEditForm" title="检查您的订单" :visible.sync="dialogFormVisible">
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
import Vue from 'vue'
import BaiduMap from 'vue-baidu-map'
import { BmlMarkerClusterer } from 'vue-baidu-map'
import parkingLotApi from '@/api/parkingLotManager'
import followApi from '@/api/followManager'

Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'nU7hxiz41G1Dd0hSOPOIx99zRmABNb33'
})
export default {
  data() {
    const markers = []
    const position = { lng: 116.3, lat: 39.6 }
    markers.push(position)
    return {
      show: false,
      markers,
      searchForm: {
        pageNo: 1,
        pageSize: 20
      },
      formLabelWidth: '130px',
      parkingLotForm: {},
      dialogFormVisible: false
    }
  },
  components: {
    BmlMarkerClusterer
  },
  mounted() {
    this.getLocations()
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
    infoWindowClose(marker) {
      marker.show = false
    },
    infoWindowOpen(marker) {
      marker.show = true
    },
    getLocations() {
      this.searchForm.username = this.$store.state.user.name
      parkingLotApi.getParkingLotList(this.searchForm)
        .then(response => {
          const rows = response.data.rows
          for (const location of rows) {
            if (location.lng !== null && location.status === 1) {
              // const position = { lng: location.lng, lat: location.lat }
              // this.markers.push({ lng: 30.6, lat: 114.3 })
              location.show = false
              this.markers.push(location)
            }
          }
        })
        .catch(error => {
          console.error('Failed to fetch locations:', error)
        })
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
  }
}
</script>

<style scoped>
.bm-view {
  width: 100%;
  height: 750px;
}

.welcome-text {
  font-size: 30px;
  line-height: 42px;
}

.tips {
  font-size: 13px;
  color: #939393;
}

.highlight {
  font-size: 13px;
  color: #ff6969;
}
</style>
