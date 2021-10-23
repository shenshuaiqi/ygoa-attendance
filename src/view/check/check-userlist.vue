<template>
  <div class="box">
    <Card :bordered="false" dis-hover>
      <Form>
        <Row :gutter="16">
          <i-col span="6">
            <FormItem>
              <Input v-model="listQuery.codeOrName" search placeholder="输入工号姓名检索" @on-search="search"/>
            </FormItem>
          </i-col>
        </Row>
      </Form>
      <Table size="small" border :columns="columns1" :data="datas">
        <template slot-scope="{ row, index }" slot="action">
          <Button class="group-action" type="success" ghost icon="ios-create-outline" size="small"
                  @click="edit(row)"></Button>
        </template>
      </Table>
      <Page class-name="place-page" show-total :page-size="this.listQuery.pageSize" :total="total"
            @on-change="handleCurrentChange"/>
    </Card>

    <Modal :value="dialog" :mask-closable="false" scrollable title="编辑" width="700" :closable="false">
      <div slot="footer">
        <Button @click="cancle">关闭</Button>
        <Button type="primary" @click="save">保存</Button>
      </div>
      <Form :label-width="100" :label-colon="true" :model="formItem" ref="menuForm" :rules="ruleValidate">
        <Row :gutter="16">
          <i-col span="16">
            <FormItem label="姓名">
              <Input v-model="formItem.empName" readonly/>
            </FormItem>
          </i-col>

          <i-col span="16">
            <FormItem label="工号">
              <Input v-model="formItem.userCode" readonly/>
            </FormItem>
          </i-col>

          <i-col span="16">
            <FormItem label="考勤组">
              <Select v-model="formItem.districtId" filterable>
                <Option v-for="item in groupList" :value="item.rowGuid" :key="item.rowGuid">
                  {{ item.name }}
                </Option>
              </Select>
            </FormItem>
          </i-col>

        </Row>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex'
  import {attendanceUserList, queryDistrict, updateUserDistrict} from '@/api/attendanceGroup.js'

  export default {
    name: 'checkuser',
    data() {
      return {
        total: 0,
        listQuery: { // 查询信息
          pageNum: 1, // 页码
          pageSize: 20, // 每页展示多少条
          codeOrName: ''
        },

        columns1: [
          {
            title: '序号',
            type: 'index',
            width: 80
          },
          {
            title: '姓名',
            key: 'empName'
          },
          {
            title: '工号',
            key: 'empNo'
          },
          {
            title: '部门',
            key: 'personDepName'
          },
          {
            title: '员工类型',
            key: 'empTypeName'
          },
          {
            title: '考勤组',
            key: 'districtName',
            width: 300,
          },
          {
            title: '编辑',
            width: 100,
            align: 'center',
            slot: 'action'
          }
        ],
        datas: [],
        dialog: false,
        formItem: {
          rowGuid: '',
          empName: '',
          districtId:'',
          userCode:''
        },
        groupList: [],
        ruleValidate: {}
      }
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    mounted() {
      this.queryList()
    },
    methods: {
      queryList: async function () {
        const {status, data} = await attendanceUserList(this.listQuery)
        if (status === 200 && data.code === '0000') {
          this.datas = data.result.list
          this.total = data.result.total
        }
      },
      search() {
        this.listQuery.pageNum = 1
        this.queryList()
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val
        this.queryList()
      },
      edit: async function (row) {
        this.dialog = true
        this.formItem.empName = row.empName
        this.formItem.userCode = row.empNo
        const {status, data} = await queryDistrict({
          pageNum: 1, // 页码
          pageSize: 10000 // 每页展示多少条
        })
        if (status === 200 && data.code === '0000') {
          this.groupList = data.result.list
        }
      },
      cancle() {
        this.dialog = false
        Object.keys(this.formItem).forEach(key => this.formItem[key] = '')
      },
      async save() {
        if (this.userInfo.userCode !== '034797' && this.formItem.userCode === '034797') {
          this.$Message.warning('抱歉，该用户你没有权限修改。请联系系统管理员！')
          return
        }
        const {status, data} = await updateUserDistrict({
          userCode: this.formItem.userCode,
          districtId: this.formItem.districtId
        })
        if (status === 200 && data.code === '0000') {
          this.dialog = false
          this.queryList()
          Object.keys(this.formItem).forEach(key => this.formItem[key] = '')
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .box {
    .place-page {
      margin-top: 10px;
    }
    .group-action {
      margin-right: 5px;
    }
  }
</style>
