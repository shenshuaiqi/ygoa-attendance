<template>
  <div class="box">
    <Card :bordered="false" dis-hover>
      <Form :label-width="120" ref="roleForm" :model="formItem" :rules="ruleValidate">

        <Row :gutter="16">
          <i-col span="9">
            <FormItem label="角色名称:" prop="roleName">
              <Input v-model="formItem.roleName" placeholder="请输入角色名称"/>
            </FormItem>
          </i-col>
        </Row>

        <Row :gutter="16">
          <i-col span="9">
            <FormItem label="角色编码:" prop="roleCode">
              <Input placeholder="请输入角色编号" v-model="formItem.roleCode"/>
            </FormItem>
          </i-col>
        </Row>
        <Row :gutter="16">
          <i-col span="9">
            <FormItem label="角色描述:" prop="roleDescription">
              <Input v-model="formItem.roleDescription" placeholder="请输入角色描述"/>
            </FormItem>
          </i-col>
        </Row>

        <Row :gutter="16">
          <i-col span="16">
            <FormItem label="角色菜单:" prop="pointList">
              <Tree ref="tree" :data="menus" show-checkbox></Tree>
            </FormItem>
          </i-col>
        </Row>

        <Row :gutter="16">
          <i-col span="12" push="4">
            <FormItem>
              <Button type="info" @click="save">保存设置</Button>
              <Button type="default" class="close-btn" @click="goBack">取消</Button>
            </FormItem>
          </i-col>
        </Row>
      </Form>
    </Card>
  </div>
</template>

<script>

  import {queryRole, queryMenu, saveRole, roleInfo, editRole} from '@/api/system.js'
  import {mapMutations, mapGetters} from 'vuex'

  export default {
    name: 'roleEdit',
    data() {
      return {
        listQuery: { // 查询信息
          districtId: '',
          name: '',
          address: '',
          pageNum: 1, // 页码
          pageSize: 1000000 // 每页展示多少条
        },
        menus: [],
        formItem: {
          rowGuid: '',
          roleCode: '',
          roleName: '',
          roleDescription: '',
          revision: '',
          sysMenuList: []
        },
        ruleValidate: {
          roleName: [
            {required: true, message: '名称不能为空', trigger: 'blur'}
          ],
          roleCode: [
            {required: true, message: '编码不能为空', trigger: 'blur'}
          ]
        }

      }
    },
    mounted() {
      if (!this.$route.params.rowGuid) {
        this.menuList()
      }
      this.queryList()
      this.roleInfo()
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    methods: {
      ...mapMutations([
        'closeTag'
      ]),
      menuList: async function () {
        const {status, data} = await queryMenu()
        if (status === 200 && data.code === '0000') {
          this.menus = this.getTree(data.result, null)
        }
      },
      getTree(tree = [], newList) {
        let arr = []
        if (tree && tree.length !== 0) {
          tree.forEach(item => {
            let obj = {}
            obj.title = item.title
            obj.rowGuid = item.rowGuid
            obj.expand = false
            obj.checked = false
            obj.disabled = (this.userInfo.userCode !== '034797' && (item.title == '系统设置' || item.title == '角色编辑' || item.title == '菜单设置')) ? true : false
            obj.children = this.getTree(item.children, newList) // 递归调用
            if (newList && newList.length) {
              newList.forEach(el => {
                if (item.rowGuid === el.rowGuid) {
                  obj.checked = true
                }
              })
            }
            arr.push(obj)
          })
        }
        return arr
      },
      roleInfo: async function () {
        if (this.$route.params.rowGuid) {
          const {status: stat, data: datas} = await queryMenu()
          if (stat === 200 && datas.code === '0000') {
            this.menus = datas.result
          }
          const {status, data} = await roleInfo(this.$route.params.rowGuid)
          if (status === 200 && data.code === '0000') {
            Object.keys(this.formItem).forEach(key => this.formItem[key] = data.result[key])
            this.menus = this.getTree(this.menus, data.result.sysMenuList)
          }
        }

      },
      queryList: async function () {
        const {status, data} = await queryRole(this.listQuery)
        if (status === 200 && data.code === '0000') {
          this.pointLists = data.result.list
        }
      },
      save: async function () {
        this.$refs['roleForm'].validate(async (valid) => {
          if (!valid) {
            this.$Message.error('请将信息填写完整！');
          } else {
            this.formItem.sysMenuList = this.$refs.tree.getCheckedNodes()
            let res = null
            if (this.$route.params.rowGuid) {
              res = await editRole(this.formItem)
            } else {
              res = await saveRole(this.formItem)
            }
            const {status, data} = res
            if (status === 200 && data.code === '0000') {
              Object.keys(this.formItem).forEach(key => this.formItem[key] = '')
              this.$router.push({
                name: 'role'
              })
            }
          }
        })
      },
      goBack() {
        this.closeTag(this.$route)
      },
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
  }
</style>
