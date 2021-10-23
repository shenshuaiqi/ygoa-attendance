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
          <Button class="group-action" type="success" title="编辑" ghost icon="ios-create-outline" size="small"
                  @click="edit(row)"></Button>
          <!--<Button class="group-action" type="info" title="推送至OA系统" ghost icon="ios-cloud-download" size="small"
                  @click="download(row)"></Button>
          <Button class="group-action" type="success" title="同步人事信息" ghost icon="ios-cloud-upload" size="small"
                  @click="upload(row)"></Button>-->
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
              <Input v-model="formItem.empNo" readonly/>
            </FormItem>
          </i-col>

          <i-col span="16">
            <FormItem label="角色">
              <Select multiple v-model="formItem.roleList" filterable>
                <Option v-for="item in roleList" :value="item.rowGuid" :key="item.rowGuid"
                        :disabled="userInfo.userCode!=='034797'&&item.roleCode==='super_admin'">
                  {{ item.roleName }}
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
  import {queryUserRole, deleteRole, queryRole, saveUserRole, getRoleId} from '@/api/system.js'
  import {syncUser,putSyncUser} from '@/api/sync.js'

  export default {
    name: 'myuser',
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
            width: 70
          },
          {
            title: '姓名',
            key: 'empName',
            width: 100
          },
          {
            title: '工号',
            key: 'empNo',
            width:100
          },
          {
            title: '性别',
            key: 'gender',
            width:70
          },
          {
            title: '部门',
            key: 'personDepName'
          },
          {
            title: '职位',
            key: 'primaryPositionName'
          },
          {
            title: '员工类型',
            key: 'empTypeName',
            width:110
          },
          {
            title: '同步时间',
            key: 'updateTime',
            width:150
          },
          {
            title: '操作',
            width: 120,
            align: 'center',
            slot: 'action'
          }
        ],
        datas: [],
        dialog: false,
        formItem: {
          rowGuid: '',
          empName: '',
          empNo: '',
          roleList: []
        },
        roleList: [],
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
        const {status, data} = await queryUserRole(this.listQuery)
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
        this.formItem.empNo = row.empNo
        this.formItem.rowGuid = row.rowGuid
        const {status, data} = await queryRole({
          pageNum: 1, // 页码
          pageSize: 10000 // 每页展示多少条
        })
        if (status === 200 && data.code === '0000') {
          this.roleList = data.result.list
        }
        const {status: stat, data: dat} = await getRoleId(row.empNo)
        if (stat === 200 && dat.code === '0000') {
          this.formItem.roleList = dat.result
        }
      },
      async download(row) {
        const {status, data} = await syncUser({
          empNo: row.empNo
        })
        if (status === 200 && data.code === '0000') {
          this.$Notice.error({
            title: `${data && data.message}`
          })
          this.queryList()
        }
      },
      async upload(row) {
        const {status, data} = await putSyncUser({
          empNo: row.empNo
        })
        if (status === 200 && data.code === '0000') {
          this.$Notice.error({
            title: `${data && data.message}`
          })
          this.queryList()
        }
      },
      cancle() {
        this.dialog = false
        Object.keys(this.formItem).forEach(key => this.formItem[key] = '')
      },
      async save() {
        if (this.userInfo.userCode !== '034797' && this.formItem.empNo === '034797') {
          this.$Message.warning('抱歉，该用户你没有权限修改。请联系系统管理员！')
          return
        }
        const {status, data} = await saveUserRole({
          userId: this.formItem.rowGuid,
          roleIds: this.formItem.roleList
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
