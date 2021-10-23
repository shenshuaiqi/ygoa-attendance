<template>
  <div class="box">
    <Card :bordered="false" dis-hover>
      <Form>
        <Row :gutter="16">
          <!-- <i-col span="14">
             <FormItem label="考勤地点:">
               有效范围
               <Select class="radius" size="small" v-model="radius">
                 <Option v-for="(item,index) in radiusList" :value="item" :key="index">{{ item }}米</Option>
               </Select>
               <Button @click="addPosition" type="info">添加考勤点</Button>
               <span class="place-desc">可添加多个办公地点 <a target="_blank"
                                                     href="https://lbs.amap.com/console/show/picker">查看经纬度</a></span>
             </FormItem>
           </i-col>-->
          <i-col span="8">
            <FormItem>
              <Input search placeholder="输入考勤点名称" v-model="listQuery.name" @on-search="search"/>
            </FormItem>
          </i-col>
        </Row>
      </Form>
      <Table border size="small" :columns="columns1" :data="datas">
        <!--<template slot-scope="{ row, index }" slot="action">
          <Button class="palce-action" type="success" ghost icon="ios-create-outline" size="small"
                  @click="edit(row)"></Button>
          <Button class="palce-action" type="error" icon="ios-backspace-outline" ghost size="small"
                  @click="deleteRow(row)"></Button>
        </template>-->
      </Table>
      <Page class-name="place-page" :page-size="this.listQuery.pageSize" show-total :total="total"
            @on-change="handleCurrentChange"/>
      <!--<position :positions="positions" :type="'chosePlace'" :dialog="posiDialog" :radius="radius" @choseposi="choseposi"
                @closeposi="closePosi"/>-->
    </Card>
  </div>
</template>

<script>
  //import Position from '@/view/components/gdmap/position'

  import {savePoint, editPoint, queryPoint, pointInfo, deletePoint} from '@/api/attendanceGroup.js'

  export default {
    name: 'checkPlace',
    data() {
      return {
        total: 0,
        listQuery: { // 查询信息
          districtId: '',
          name: '',
          address: '',
          pageNum: 1, // 页码
          pageSize: 20 // 每页展示多少条
        },
        posiDialog: false,
        radiusList: [100, 200, 300, 500, 1000, 2000, 3000],
        radius: 200,
        formItem: {
          rowGuid: '',
          name: '',
          longitude: '',
          latitude: '',
          address: '',
          radius: 0
        },
        columns1: [
          {
            title: '地点编码',
            key: 'code',
            width:100
          },
          {
            title: '地点名称',
            key: 'name'
          },
          {
            title: '考勤地址',
            key: 'address'
          },
          {
            title: '经度',
            key: 'longitude',
            width: 120
          },
          {
            title: '纬度',
            key: 'latitude',
            width: 120
          },
          {
            title: '有效范围（米）',
            key: 'radius',
            width: 150
          },
          {
            title: '更新时间',
            key: 'updateTime',
            width: 150
          },
          {
            title: '角色编号',
            key: 'roleId',
            width: 170
          }
          /*{
            title: '操作',
            slot: 'action',
            width: 150,
            align: 'center'
          }*/
        ],
        datas: [],
        positions: ''
      }
    },
    components: {
      //Position
    },
    computed: {},
    mounted() {
      this.queryList()
    },
    methods: {
      addPosition() {
        this.positions = ''
        this.posiDialog = true
      },
      queryList: async function () {
        const {status, data} = await queryPoint(this.listQuery)
        if (status === 200 && data.code === '0000') {
          this.datas = data.result.list
          this.total = data.result.total
        }
      },
      search() {
        this.listQuery.pageNum = 1
        this.queryList()
      },
      choseposi: async function (datas) {
        if (datas.type === 'chosePlace') {
          const point = JSON.parse(datas.data)
          this.formItem.name = point.placeName
          this.formItem.address = point.place
          this.formItem.longitude = point.placeLocation.split(',')[0]
          this.formItem.latitude = point.placeLocation.split(',')[1]
          this.formItem.radius = point.radius
          let res = null
          if (this.positions) {
            res = await editPoint(this.formItem)
          } else {
            res = await savePoint(this.formItem)
          }
          const {status, data} = res
          if (status === 200 && data.code === '0000') {
            this.posiDialog = false
            this.queryList()
          }

        }

      },
      closePosi() {
        this.posiDialog = false
      },

      handleCurrentChange(val) {
        this.listQuery.pageNum = val
        this.queryList()
      },
      edit: async function (row) {
        const {status, data} = await pointInfo(row.rowGuid)
        if (status === 200 && data.code === '0000') {
          this.positions = JSON.stringify(data.result)
          Object.keys(this.formItem).forEach(key => this.formItem[key] = data.result[key])
          this.posiDialog = true
          //console.log(this.positions)
        }
      },
      deleteRow: async function (row) {
        this.$Modal.confirm({
          title: '提示',
          content: `是否删除${row.name}？`,
          onOk: async () => {
            const {status, data} = await deletePoint(row.rowGuid)
            if (status === 200 && data.code === '0000') {
              this.queryList()
              this.$Notice.success({
                title: '成功',
                desc: data.message
              })
            }
          }
        });

      }
    }
  }
</script>

<style scoped lang="less">
  .box {
    .position-alert {
      font-size: 13px;
      a {
        margin-left: 20px;
      }
      margin-bottom: 20px;
    }
    .radius {
      width: auto;
      font-size: 13px;
      margin-right: 10px;
    }
    .place-desc {
      font-size: 13px;
      margin-left: 20px;
    }
    .place-page {
      margin-top: 10px;
    }
    .palce-action {
      margin-right: 5px;

    }
  }
</style>
