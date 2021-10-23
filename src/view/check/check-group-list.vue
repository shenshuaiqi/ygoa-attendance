<template>
  <div class="box">
    <Card :bordered="false" dis-hover>
      <Form>
        <Row :gutter="16">
          <i-col span="12">
            <FormItem>
              <router-link to="/check/group" class="ivu-btn ivu-btn-info">
                添加考勤区域
              </router-link>
            </FormItem>
          </i-col>
          <i-col span="4" push="8">
            <Input search placeholder="输入考勤区域名称" v-model="listQuery.name" @on-search="search"/>
          </i-col>
        </Row>
      </Form>
      <Table size="small" border :columns="columns1" :data="datas">
        <template slot-scope="{ row, index }" slot="isPhoto">
          {{row.isPhoto|isphotoFilter}}
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <Button class="group-action" type="success" ghost icon="ios-create-outline" size="small"
                  @click="edit(row)"></Button>
          <!--删除功能暂时下线-->
          <!--<Button class="group-action-action" type="error" icon="ios-backspace-outline" ghost size="small"
                  @click="deleteRow(row)"></Button>-->
        </template>
      </Table>
      <Page class-name="place-page" show-total :page-size="this.listQuery.pageSize" :total="total"
            @on-change="handleCurrentChange"/>
    </Card>
  </div>
</template>

<script>
  import {queryDistrict, deleteDistrict} from '@/api/attendanceGroup.js'

  export default {
    name: 'checkList',
    data() {
      return {
        total: 100,
        listQuery: { // 查询信息
          name: '',
          pageNum: 1, // 页码
          pageSize: 20 // 每页展示多少条
        },
        posiDialog: false,
        columns1: [
          {
            title: '序号',
            type: 'index',
            width: 80
          },
          {
            title: '部门',
            key: 'deptName'
          },
          {
            title: '名称',
            key: 'name'
          },
          {
            title: '是否开启拍照',
            key: 'isPhoto',
            slot: 'isPhoto',
            width: 150
          },

          {
            title: '角色编号',
            key: 'roleId',
          },
          {
            title: '更新时间',
            key: 'updateTime',
            width: 150,
          },
          {
            title: '操作',
            width: 150,
            slot: 'action',
            align: 'center'
          }
        ],
        datas: []
      }
    },
    filters: {
      isphotoFilter(val) {
        const photo = {
          "Y": "是",
          "N": "否"
        }
        return photo[val]
      }
    },
    components: {},
    computed: {},
    mounted() {
      this.queryList()
    },
    methods: {
      addPosition() {
        this.posiDialog = true
      },
      queryList: async function () {
        const {status, data} = await queryDistrict(this.listQuery)
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
          name: 'group',
          params: {
            rowGuid: row.rowGuid
          }
        })
      },
      deleteRow: async function (row) {
        this.$Modal.confirm({
          title: '提示',
          content: `是否删除${row.name}？`,
          onOk: async () => {
            const {status, data} = await deleteDistrict(row.rowGuid)
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
    .group-action {
      margin-right: 5px;
    }
  }
</style>
