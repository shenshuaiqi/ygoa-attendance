<template>
  <Modal class="box" :value="dialog" scrollable :title="'编辑考勤地点（'+active+'/2）'" width="900"
         :mask-closable="false" :closable="false">
    <div slot="footer">
      <Button @click="posicancle">{{cancelText}}</Button>
      <Button :disabled="okDisabled" type="info" @click="posichose">{{okTxt}}</Button>
    </div>
    <div v-show="active===1">
      <div class="container" id="container"></div>
      <div class="info">
        <div class="input-item">
          <Input search enter-button placeholder="输入考勤地点" v-model="place" @on-keyup="autoInput"
                 @on-search="autoInput"/>
        </div>
        <List v-show="searchList&&searchList.length" border size="small" style="background: white">
          <ListItem v-for="(item,index) in searchList" :key="index" class="list" @click.native="clickLocation(item)">
            <p>{{item.name}}</p>
            <p class="list-position">{{item.district}}</p>
          </ListItem>
        </List>
      </div>
    </div>
    <div v-show="active===2">
      <Form :model="formItem" :label-width="80">
        <FormItem label="地点名称">
          <Input v-model="formItem.placeName" placeholder="地点名称"></Input>
        </FormItem>
        <FormItem>
          <div>输入名称方便员工识别打卡地点</div>
        </FormItem>
        <FormItem>
          <div>考勤地点: {{formItem.place}}</div>
        </FormItem>

      </Form>
    </div>

  </Modal>
</template>

<script>
  import AMap from 'AMap'

  export default {
    name: 'position',
    props: {
      dialog: {
        type: Boolean,
        default: false
      },
      radius: {
        type: Number,
        default: 200
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
        active: 1,
        okTxt: '下一步',
        cancelText: '取消',
        okDisabled: true,
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
        if (this.positions) {
          const positionsObj = JSON.parse(this.positions)
          this.okDisabled = false
          this.formItem.radius = Number(positionsObj.radius)
          this.formItem.placeName = positionsObj.name
          this.formItem.placeLocation = `${positionsObj.longitude},${positionsObj.latitude}`
          this.formItem.place = positionsObj.address
        }
      },
    },
    methods: {
      posichose() {
        this.active++
        if (this.active === 1) {
          this.okTxt = '下一步'
          this.cancelText = '取消'
        } else if (this.active === 2) {
          this.okTxt = '完成'
          this.cancelText = '上一步'
        } else if (this.active === 3) {
          this.formItem.radius = this.radius
          this.$emit('choseposi', {data: JSON.stringify(this.formItem), type: this.type})
          this.okTxt = '下一步'
          this.cancelText = '取消'
          this.active = 1
          this.place = ''
          this.searchList = []
          this.okDisabled = true
          this.map = null
          this.init()
        }
      },
      posicancle() {
        this.init()
        this.active--
        if (this.active === 2) {
          this.okTxt = '完成'
          this.cancelText = '上一步'
        } else if (this.active === 1) {
          this.okTxt = '下一步'
          this.cancelText = '取消'
        } else if (this.active === 0) {
          this.$emit('closeposi', this.type)
          this.okTxt = '下一步'
          this.cancelText = '取消'
          this.active = 1
          this.place = ''
          this.searchList = []
          this.okDisabled = true
        }
      },
      init() {
        if (this.positions) {
          const positionsObj = JSON.parse(this.positions)
          this.map = new AMap.Map('container', {
            center: [positionsObj.longitude, positionsObj.latitude],
            resizeEnable: true,
            zoom: 16
          })
          let circle = new AMap.Circle({
            bubble: true,
            center: new AMap.LngLat(positionsObj.longitude, positionsObj.latitude),
            radius: this.positions && Number(JSON.parse(this.positions).radius), // 半径
            strokeColor: '#F33', // 线颜色
            strokeOpacity: 1, // 线透明度
            strokeWeight: 3, // 线粗细度
            fillColor: '#ee2200', // 填充颜色
            fillOpacity: 0.35 // 填充透明度
          })
          this.map.add(circle)
          this.map.setFitView()
        } else {
          this.map = new AMap.Map('container', {
            center: [120.555994, 31.876698],
            resizeEnable: true,
            zoom: 13
          })
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

        this.map.on('click', this.showInfoClick)
      },
      /**
       * 绘制圆圈
       * @param lng
       * @param lat
       */
      addCircle(lng, lat) {
        let circle = new AMap.Circle({
          bubble: true,
          center: new AMap.LngLat(lng, lat),
          radius: this.radius, // 半径
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
      // 鼠标单击事件获取坐标
      showInfoClick(e) {
        this.map.clearMap() // 清除所有覆盖物
        var lnglatXY = [e.lnglat.getLng(), e.lnglat.getLat()]// 地图上所标点的坐标
        AMap.service('AMap.Geocoder', () => {
          let geocoder = new AMap.Geocoder({})
          geocoder.getAddress(lnglatXY, (status, result) => {
            if (status === 'complete' && result.info === 'OK') {
              // 获得了有效的地址信息result.regeocode.formattedAddress
              this.searchList = [{
                name: result.regeocode.formattedAddress,
                district: ''
              }]
              this.formItem.placeName = result.regeocode.formattedAddress
              this.formItem.place = result.regeocode.formattedAddress
              this.formItem.placeLocation = `${e.lnglat.getLng()},${e.lnglat.getLat()}`
              this.addMarker(e.lnglat.getLng(), e.lnglat.getLat())
              this.addCircle(e.lnglat.getLng(), e.lnglat.getLat())
              if (this.formItem.place) {
                this.okDisabled = false
              } else {
                this.okDisabled = true
              }
            } else {
              // 获取地址失败
            }
          })
        })
      },
      autoInput() {
        var keywords = this.place
        AMap.plugin('AMap.Autocomplete', () => {
          // 实例化Autocomplete
          var autoOptions = {
            city: '全国'
          }
          var autoComplete = new AMap.Autocomplete(autoOptions)
          autoComplete.search(keywords, (status, result) => {
            // 搜索成功时，result即是对应的匹配数据
            if (status === 'complete' && result.tips.length > 0) {
              this.searchList = result.tips
            }

            this.map.clearMap() // 清除所有覆盖物
            for (let item of this.searchList) {
              if (item.location && item.location.lng && item.location.lat) {
                this.addMarker(item.location.lng, item.location.lat)
              }
            }
          })
        })
      },
      clickLocation(item) {
        this.location = item
        this.place = item.name
        this.searchList = []
        this.searchList.push(item)
        if (item.location) {
          this.map.clearMap() // 清除所有覆盖物
          this.addMarker(item.location.lng, item.location.lat)
          this.addCircle(item.location.lng, item.location.lat)
          this.formItem.placeName = item.name
          this.formItem.place = item.name
          this.formItem.placeLocation = `${item.location.lng},${item.location.lat}`
          if (this.formItem.place) {
            this.okDisabled = false
          } else {
            this.okDisabled = true
          }
        }
      }
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
