<template>
  <div class="box">
    <Card :bordered="false" dis-hover>
      <Form>
        <Row :gutter="16">
          <i-col span="12">
            <FormItem>
              <router-link to="/system/role-edit" class="ivu-btn ivu-btn-info">
                添加角色
              </router-link>
            </FormItem>
          </i-col>
          <i-col span="4" push="8">
            <Input v-model="listQuery.roleName" search placeholder="输入角色名称" @on-search="search"/>
          </i-col>
        </Row>
      </Form>
      <Table size="small" border :columns="columns1" :data="datas">
        <template slot-scope="{ row, index }" slot="action">
          <Button class="group-action" type="success" ghost icon="ios-create-outline" size="small"
                  @click="edit(row)" :disabled="userInfo.userCode!=='034797'&&row.roleCode==='super_admin'"></Button>
          <Button class="group-action-action" type="error" icon="ios-backspace-outline" ghost size="small"
                  @click="deleteRow(row)"
                  :disabled="userInfo.userCode!=='034797'&&row.roleCode==='super_admin'"></Button>
        </template>
      </Table>
      <Page class-name="place-page" show-total :page-size="this.listQuery.pageSize" :total="total"
            @on-change="handleCurrentChange"/>
    </Card>
  </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex'
  import {queryRole, deleteRole} from '@/api/system.js'

  export default {
    name: 'myrole',
    data() {
      return {
        total: 100,
        listQuery: { // 查询信息
          roleName: '',
          pageNum: 1, // 页码
          pageSize: 20 // 每页展示多少条
        },
        posiDialog: false,
        columns1: [
          {
            title: '序号',
            type: 'index',
            width: 100
          },
          {
            title: '角色名称',
            key: 'roleName'
          },
          {
            title: '角色编号',
            key: 'roleCode'
          },
          {
            title: '角色描述',
            key: 'roleDescription'
          },
          {
            title: '修改时间',
            key: 'updatedTime'
          },
          {
            title: '操作',
            width: 100,
            slot: 'action'
          }
        ],
        datas: []
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
        const {status, data} = await queryRole(this.listQuery)
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
      edit(row) {
        this.$router.push({
          name: 'role-edit',
          params: {
            rowGuid: row.rowGuid
          }
        })
      },
      deleteRow: async function (row) {
        this.$Modal.confirm({
          title: '提示',
          content: `是否删除${row.roleName}？`,
          onOk: async () => {
            if (this.userInfo.userCode !== '034797' && row.roleCode === 'super_admin') {
              this.$Message.warning('抱歉，该功能你没有权限。请联系系统管理员！');
              return
            }
            const {status, data} = await deleteRole(row.rowGuid)
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
    .place-page {
      margin-top: 10px;
    }
    .group-action {
      margin-right: 5px;
    }
  }
</style>
