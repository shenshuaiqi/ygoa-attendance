<template>
  <div class="box">
    <p>测试页面</p>
    <Button type="info" @click="opens">选择人员</Button>
    <Button type="info" @click="chosePosi">添加考勤地点</Button>
    <get-user :dialog="selfdialog" @diachose="closeDialog" @discancle="closeDialog"/>
    <position :dialog="posiDialog" :radius="200" @choseposi="closePosi" @closeposi="closePosi" />
    <!--<div class="amap-page-container">
      <el-amap-search-box class="search-box" :search-option="searchOption"
                          :on-search-result="onSearchResult"></el-amap-search-box>
      &lt;!&ndash; <el-amap vid="amapDemo" :center="mapCenter" :zoom="12" class="amap-demo">
         <el-amap-marker v-for="marker in markers" :amap-manager="amapManager" :position="marker"></el-amap-marker>
         <el-amap-circle :center="circles.center" :radius="circles.radius" :fill-opacity="circles.fillOpacity"
                         :events="circles.events"></el-amap-circle>
       </el-amap>&ndash;&gt;
      <el-amap vid="amapDemo" :center="mapCenter" :amap-manager="amapManager" zoom="12" class="amap-demo">
        <el-amap-marker v-for="marker in markers" :amap-manager="amapManager" :position="marker"></el-amap-marker>
      </el-amap>
    </div>-->

  </div>
</template>

<script>
import GetUser from '@/components/system/users/GetUsers'
import Position from '@/view/components/gdmap/position'
import routers from '@/router/routers'
// let amapManager = new VueAMap.AMapManager();

export default {
  name: 'test',
  data () {
    return {
      selfdialog: false,
      posiDialog: false
    }
  },
  components: {
    GetUser,
    Position
  },
  mounted () {
    console.log(routers)
  },

  methods: {

    opens () {
      this.selfdialog = true
    },
    closeDialog () {
      this.selfdialog = false
    },
    chosePosi () {
      this.posiDialog = true
    },
    closePosi () {
      this.posiDialog = false
    }
  }
}
</script>

<style scoped lang="less">

</style>
