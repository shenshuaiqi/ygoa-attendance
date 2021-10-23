<template>
  <Modal class="box" :value="dialog" scrollable title="考勤地点" width="900"
         :mask-closable="false" :closable="false">
    <div slot="footer">
      <Button @click="posicancle">关闭</Button>
    </div>
    <div>
      <div class="container" id="containerView"></div>
      <div class="info">
        <List v-show="searchList&&searchList.length" border size="small" style="background: white">
          <ListItem v-for="(item,index) in searchList" :key="index" class="list">
            <p>{{item.name}}</p>
            <p class="list-position">{{item.district}}</p>
          </ListItem>
        </List>
      </div>
    </div>

  </Modal>
</template>

<script>
  import AMap from 'AMap'

  export default {
    name: 'attendanceview',
    props: {
      dialog: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        default: ''
      },
      positions: {
        type: String
      }
    },
    data() {
      return {
        map: null,
        place: '',
        searchList: [],
        location: {},
        formItem: {
          radius: 0,
          placeName: '',
          placeLocation: '',
          place: ''
        }
      }
    },
    mounted() {
      this.init()
    },
    watch: {
      dialog(val, oldVal) {
        if (val) {
          this.init()
        }
      }
    },
    methods: {
      posicancle() {
        this.init()
        this.$emit('closeposi', this.type)
        this.place = ''
        this.searchList = []

      },
      init() {
        if (this.positions) {

          const positionsObj = JSON.parse(this.positions)
          if (positionsObj.attendRecords.longitude && positionsObj.attendRecords.latitude) {
            this.map = new AMap.Map('containerView', {
              center: [positionsObj.attendRecords.longitude, positionsObj.attendRecords.latitude],
              resizeEnable: true,
              zoom: 16
            })
            for (let item of positionsObj.configPoint) {
              this.addCircle(item.longitude, item.latitude, item.radius)
            }
            this.addMarker(positionsObj.attendRecords.longitude, positionsObj.attendRecords.latitude)
          }
        }
        // 同时引入工具条插件，比例尺插件和鹰眼插件
        AMap.plugin([
          'AMap.ToolBar',
          'AMap.Scale',
          'AMap.OverView',
          'AMap.MapType',
          'AMap.Geolocation',
        ], () => {
          // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
          this.map.addControl(new AMap.ToolBar());

          // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
          this.map.addControl(new AMap.Scale());

          // 在图面添加鹰眼控件，在地图右下角显示地图的缩略图
          //this.map.addControl(new AMap.OverView({isOpen: true}));

          // 在图面添加类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
          this.map.addControl(new AMap.MapType());

          // 在图面添加定位控件，用来获取和展示用户主机所在的经纬度位置
          this.map.addControl(new AMap.Geolocation());
        });
        // this.map.on('click', this.showInfoClick)
      },
      addCircle(lng, lat, radius) {
        let circle = new AMap.Circle({
          center: new AMap.LngLat(lng, lat),
          radius: this.positions && Number(JSON.parse(radius)), // 半径
          strokeColor: '#F33', // 线颜色
          strokeOpacity: 1, // 线透明度
          strokeWeight: 3, // 线粗细度
          fillColor: '#ee2200', // 填充颜色
          fillOpacity: 0.35 // 填充透明度
        })
        this.map.add(circle)
        this.map.setFitView()
      },
      addMarker(lng, lat) {
        let marker = new AMap.Marker({
          icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
          position: [lng, lat]
        })
        this.map.add(marker)
        this.map.setFitView()
      },
    }
  }
</script>

<style scoped lang="less">
  .box {
    position: relative;
    .container {
      position: relative;
      height: 400px;
    }
    .info {
      position: absolute;
      top: 100px;
      left: 24px;
      z-index: 1000;
      .list {
        &:hover {
          background-color: #cae1ff;
          cursor: pointer;
        }
        .list-position {
          margin-left: 20px;
          font-size: 13px;
          color: #999;
        }
      }
    }
  }
</style>
