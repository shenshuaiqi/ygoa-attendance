<template>
  <div class="box">
    <Card :bordered="false" dis-hover>
      <Alert closable show-icon class="position-alert">考勤人员设置：只需勾选参与考勤人员，未勾选人员不参与考勤</Alert>
      <Form :label-width="120" ref="groupForm" :model="formItem" :rules="ruleValidate">

        <Row :gutter="16">
          <i-col span="9">
            <FormItem label="部门:" prop="deptName">
              <Input @on-click="searchDept" v-model="formItem.deptName" icon="ios-search"
                     class="peoList" readonly placeholder="请选择"/>
            </FormItem>
          </i-col>
        </Row>

        <Row :gutter="16">
          <i-col span="9">
            <FormItem label="区域名称:">
              <Input placeholder="请输入考勤区域名称" v-model="formItem.name"/>
            </FormItem>
          </i-col>
        </Row>
        <Row :gutter="16">
          <i-col span="9">
            <FormItem label="参与考勤人员:" prop="userList">
              <Input @on-click="searchPeo" v-model="users.val" icon="ios-search"
                     class="peoList" readonly placeholder="请选择"/>
            </FormItem>
          </i-col>
        </Row>

        <Row :gutter="16">
          <i-col span="16">
            <!--<FormItem label="考勤地点:" prop="pointList">
              <Select filterable multiple v-model="formItem.pointList" @tag-close="closeTag" style="width:260px">
                <Option v-for="item in pointLists" :value="item.rowGuid" :key="item.rowGuid"
                        :disabled="item.districtId!==''&&item.districtId!=null">
                  {{ item.name}}
                </Option>
              </Select>
              <span class="place-desc">可添加多个办公地点
                <router-link to="/check/group_point">点击查看</router-link>
              </span>
            </FormItem>-->
            <FormItem label="考勤地点:">

              <Button @click="addPosition" type="default">添加考勤点</Button>
              <span class="place-desc">可添加多个办公地点 <a target="_blank"
                                                    href="https://lbs.amap.com/console/show/picker">查看经纬度</a></span>
            </FormItem>
          </i-col>
          <i-col span="18" v-if="formItem.pointList&&formItem.pointList.length">
            <FormItem>
              <List border size="small">
                <template slot="header">
                  <span>考勤地址</span>
                  <span style="float: right">有效范围
                    <Select class="radius" size="small" v-model="radius">
                      <Option v-for="(item,index) in radiusList" :value="item" :key="index">{{ item }}米</Option>
                    </Select>
                  </span>
                </template>
                <ListItem v-for="(item,index) in formItem.pointList" :key="index">
                  <ListItemMeta class="item-hover" :title="item.name" :description="item.address+' 考勤半径：'+item.radius+'米'"
                                @click.native="viewPoint(item)"/>
                  <template slot="action">
                    <li v-if="formItem.rowGuid">
                      <a href="javascript:void(0)" @click="editPoint(item)">编辑</a>
                    </li>
                    <li>
                      <a href="javascript:void(0)" @click="removePoint(index,item)">删除</a>
                    </li>
                  </template>
                </ListItem>
              </List>
            </FormItem>
          </i-col>
        </Row>
        <Row :gutter="16">
          <i-col span="20">
            <FormItem label="是否开启拍照:">
              <i-switch v-model="formItem.isPhoto" :true-value="'Y'" :false-value="'N'">
                <span slot="open">是</span>
                <span slot="close">否</span>
              </i-switch>
            </FormItem>
          </i-col>
        </Row>
        <Row :gutter="16">
          <i-col span="18">
            <FormItem label="备注:">
              <Input v-model="formItem.remark"/>
            </FormItem>
          </i-col>
        </Row>
        <!--<Row :gutter="16">
          <Col span="20">
          <FormItem label="其他设置:">
            <span class="place-desc">
              上班打卡后
              <Select class="outtime" size="small">
                <Option v-for="(item,index) in outtime" :value="item" :key="index">{{ item }}小时</Option>
              </Select>
              可打下班卡（防止误操作，误打下班卡）
            </span>
          </FormItem>
          </Col>
        </Row>-->
        <Row :gutter="16">
          <i-col span="12" push="4">
            <FormItem>
              <Button type="info" @click="save" :loading="loading">保存设置</Button>
              <Button type="default" class="close-btn" @click="goBack">取消</Button>
            </FormItem>
          </i-col>
        </Row>
      </Form>

      <department :type="depts.type" :dialog="deptdialog" @diachose="deptChose" @discancle="deptClose"/>
      <get-user ref="dialogUser" :type="type" :dialog="selfdialog" @diachose="choseDialog" @discancle="closeDialog"/>
      <position :positions="positions" :type="'chosePlace'" :dialog="posiDialog" :radius="radius" @choseposi="choseposi"
                @closeposi="closePosi"/>
      <position-view :positions="positions" :type="'chosePlace'" :dialog="posiDialogView" :radius="radius"
                     @closeposi="closePosiView"/>
    </Card>
  </div>
</template>

<script>
  import GetUser from '@/components/system/users/GetUsers'
  import Department from '@/components/system/department/Department'
  import Position from '@/view/components/gdmap/position'
  import PositionView from '@/view/components/gdmap/PositionView.vue'
  import {queryDept} from '@/api/user'
  import {
    queryPoint,
    district,
    districtInfo,
    editDistrict,
    editPoint,
    savePoint,
    deletePoint
  } from '@/api/attendanceGroup.js'
  import ICol from "iview/src/components/grid/col";
  import {mapMutations} from 'vuex'

  export default {
    name: 'checkGroup',
    data() {
      return {
        pointLists: [],
        listQuery: { // 查询信息
          districtId: '',
          name: '',
          address: '',
          pageNum: 1, // 页码
          pageSize: 1000000 // 每页展示多少条
        },
        radiusList: [50,100, 200, 300, 500, 1000, 2000, 3000],
        radius: 200,
        positions: '',
        selfdialog: false,
        deptdialog: false,
        posiDialog: false,
        posiDialogView: false,
        type: '',
        users: {
          type: 'users',
          val: '',
          userList: []
        },
        depts: {
          type: 'dept',
          val: ''
        },
        checkAdmin: {
          type: 'checkAdmin',
          val: '',
          userList: []
        },
        formItem: {
          rowGuid: '',
          name: '',
          code: '',
          address: '',
          isPhoto: 'N',
          remark: '',
          deptId: '00000000-0000-0000-0000-000000000000CCE7AED4',
          deptName: '永钢集团',
          userList: [],
          pointList: []
        },
        ruleValidate: {
          name: [
            {required: true, message: '路径不能为空', trigger: 'blur'}
          ],
          /*userList: [
            {
              validator: (rule, value, callback) => {
                if (!(value && value.length)) {
                  callback(new Error('参与考勤人员不能为空'));
                } else {
                  callback();
                }
              }, trigger: 'blur'
            }
          ],*/
          pointList: [
            {
              validator: (rule, value, callback) => {
                if (!(value && value.length)) {
                  callback(new Error('考勤点不能为空'));
                } else {
                  callback();
                }
              },
              trigger: 'change'
            }
          ],
          deptName: [
            {
              validator: (rule, value, callback) => {
                if (value === '') {
                  callback(new Error('部门不能为空'));
                } else {
                  callback();
                }
              },
              trigger: 'blur'
            }
          ]
        },
        loading: false
      }
    },
    mounted() {
      this.queryDetail()
    },
    components: {
      ICol,
      GetUser,
      Position,
      PositionView,
      Department
    },
    methods: {
      ...mapMutations([
        'closeTag'
      ]),
      async queryDetail() {
        const id = this.$route.params.rowGuid
        if (id) {
          const {status, data} = await districtInfo(id)
          if (status === 200 && data.code === '0000') {
            this.formItem.rowGuid = data.result.rowGuid
            this.formItem.deptId = data.result.deptId
            this.formItem.deptName = data.result.deptName
            this.formItem.name = data.result.name
            this.formItem.isPhoto = data.result.isPhoto
            this.formItem.remark = data.result.remark
            this.formItem.pointList = data.result.pointList
            let arr = [];
            let userList = data.result.userList
            userList.forEach(item => {
              arr.push(JSON.stringify(item))
            })
            this.formItem.userList = arr
            if (this.formItem.userList && this.formItem.userList.length > 0) {
              this.users.val = `共${this.formItem.userList.length}人，点击查看`
            } else {
              this.users.val = ''
            }

          }
        }
      },
      searchPeo() {
        this.type = this.users.type
        this.selfdialog = true
        this.$refs.dialogUser.userList = JSON.parse(JSON.stringify(this.formItem.userList))
      },
      searchDept() {
        this.deptdialog = true
      },
      choseDialog(list) {
        if (list.type === 'users') {
          this.formItem.userList = JSON.parse(list.data)
          if (this.formItem.userList && this.formItem.userList.length > 0) {
            this.users.val = `共${this.formItem.userList.length}人，点击查看`
          } else {
            this.users.val = ''
          }
        } else if (list.type === 'checkAdmin') {
          this.checkAdmin.userList = JSON.parse(list.data)
          if (this.checkAdmin.userList && this.checkAdmin.userList.length > 0) {
            this.checkAdmin.val = `共${this.checkAdmin.userList.length}人，点击查看`
          }
        }
        this.selfdialog = false
      },
      deptChose(list) {
        if (list.type === 'dept') {
          let dept = JSON.parse(list.data)
          this.formItem.deptId = dept.id
          this.formItem.deptName = dept.title
        }
        this.deptdialog = false
      },
      closeDialog() {
        this.selfdialog = false
      },
      deptClose() {
        this.deptdialog = false
      },
      addPosition() {
        this.posiDialog = true
      },
      async choseposi(datas) {
        if (datas.type === 'chosePlace') {
          const point = JSON.parse(datas.data)
          if (!this.formItem.rowGuid) {
            this.formItem.pointList.push({
              districtId: this.formItem.rowGuid,
              code: '',
              name: point.placeName,
              address: point.place,
              longitude: point.placeLocation.split(',')[0],
              latitude: point.placeLocation.split(',')[1],
              radius: point.radius
            })
          } else {
            let res = null
            if (this.positions) {
              res = await editPoint({
                rowGuid: JSON.parse(this.positions).rowGuid,
                districtId: JSON.parse(this.positions).districtId,
                code: JSON.parse(this.positions).code,
                name: point.placeName,
                address: point.place,
                longitude: point.placeLocation.split(',')[0],
                latitude: point.placeLocation.split(',')[1],
                radius: point.radius
              })
            } else {
              res = await savePoint({
                districtId: this.formItem.rowGuid,
                code: '',
                name: point.placeName,
                address: point.place,
                longitude: point.placeLocation.split(',')[0],
                latitude: point.placeLocation.split(',')[1],
                radius: point.radius
              })
            }
            const {status, data} = res
            if (status === 200 && data.code === '0000') {
              this.queryDetail()
            }
          }

          this.posiDialog = false
        }
      },
      closePosi() {
        this.posiDialog = false
      },
      closePosiView() {
        this.posiDialogView = false
      },
      save: async function () {
        this.$refs['groupForm'].validate(async (valid) => {
          if (!valid) {
            this.$Message.error('请将信息填写完整！');
          } else {
            const obj = new Object()
            obj.oaAttendanceDistrict = {
              rowGuid: this.formItem.rowGuid,
              name: this.formItem.name,
              code: this.formItem.code,
              address: this.formItem.address,
              isPhoto: this.formItem.isPhoto,
              remark: this.formItem.remark,
              deptId: this.formItem.deptId
            }
            let arr = [];
            let userList = this.formItem.userList
            userList.forEach(item => {
              arr.push(JSON.parse(item).empNo)
            })
            obj.userList = arr
            obj.pointList = this.formItem.pointList
            this.loading = true
            let res = null
            if (this.$route.params.rowGuid) {
              res = await editDistrict(obj)
            } else {
              res = await district(obj)
            }
            const {status, data} = res
            if (status === 200 && data.code === '0000') {
              this.loading = false
              this.$router.push({
                name: 'group-list'
              })
            }
          }
        })
      },
      goBack() {
        this.closeTag(this.$route)
        /*this.$router.push({
          name: 'group-list'
        })*/
      },
      /*closeTag(data) {
        console.log(data)
      },*/
      addPosition() {
        this.positions = ''
        this.posiDialog = true
      },
      editPoint(item) {
        //item.radius = this.radius
        this.positions = JSON.stringify(item)
        this.posiDialog = true
      },
      viewPoint(item) {
        this.positions = JSON.stringify(item)
        this.posiDialogView = true
      },
      removePoint(index, item) {
        if (!item.districtId) {
          this.formItem.pointList.splice(index, 1)
        } else {
          this.$Modal.confirm({
            title: '提示',
            content: `是否删除：${item.name}考勤点？`,
            onOk: async () => {
              const {status, data} = await deletePoint(item.rowGuid)
              if (status === 200 && data.code === '0000') {
                this.queryDetail()
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
    .peoList {
      &:hover {
        cursor: pointer;
      }
    }
    .place-desc {
      font-size: 13px;
      margin-left: 20px;
    }
    .outtime {
      width: auto;
      margin: 0 5px;
    }
    .close-btn {
      margin-left: 10px;
    }
    .radius {
      width: auto;
      font-size: 13px;
      margin-right: 10px;
    }
    .item-hover:hover {
      background: #eff9ff;
      cursor: pointer;
    }

  }

</style>
