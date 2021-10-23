<template>
  <Card :bordered="false" dis-hover>
    <Table row-key="rowGuid" :columns="columns" :data="list" border>
      <template slot-scope="{ row, index }" slot="action">
        <Button type="primary" ghost size="small" @click="add(row)">
          <Icon type="ios-add"></Icon>
        </Button>
        <Button type="success" ghost size="small" @click="edit(row)">
          <Icon type="ios-create-outline"></Icon>
        </Button>
        <Button type="error" ghost size="small" @click="deleteRow(row)">
          <Icon type="ios-backspace-outline"></Icon>
        </Button>
      </template>
    </Table>

    <Modal :value="dialog" draggable scrollable :title="dialogTxt" width="900" :closable="false">
      <div slot="footer">
        <Button @click="cancle">关闭</Button>
        <Button type="primary" @click="save(dialogTxt)">保存</Button>
      </div>
      <Form :label-width="110" :label-colon="true" :model="formItem" ref="menuForm" :rules="ruleValidate">
        <Row :gutter="16">
          <i-col span="10">
            <FormItem label="菜单名称" prop="title">
              <Input v-model="formItem.title"/>
            </FormItem>
          </i-col>

          <i-col span="10">
            <FormItem label="路由" prop="path">
              <Input v-model="formItem.path"/>
            </FormItem>
          </i-col>

          <i-col span="10">
            <FormItem label="路由名" prop="name">
              <Input v-model="formItem.name"/>
            </FormItem>
          </i-col>
          <i-col span="10">
            <FormItem label="菜单图标" prop="icon">
              <Input v-model="formItem.icon"/>
            </FormItem>
          </i-col>
          <i-col span="10">
            <FormItem label="地址">
              <Input v-model="formItem.component"/>
            </FormItem>
          </i-col>
          <i-col span="10">
            <FormItem label="重定向地址">
              <Input v-model="formItem.redirect"/>
            </FormItem>
          </i-col>

          <i-col span="10">
            <FormItem label="外部链接">
              <Input v-model="formItem.href"/>
            </FormItem>
          </i-col>
          <i-col span="10">
            <FormItem label="关闭回调">
              <Input v-model="formItem.beforeCloseName"/>
            </FormItem>
          </i-col>
          <i-col span="10">
            <FormItem label="显示父菜单">
              <i-switch size="large" v-model="formItem.showAlways">
                <span slot="open">是</span>
                <span slot="close">否</span>
              </i-switch>
            </FormItem>
          </i-col>
          <i-col span="10">
            <FormItem label="标题隐藏">
              <i-switch size="large" v-model="formItem.hideInBread">
                <span slot="open">是</span>
                <span slot="close">否</span>
              </i-switch>
            </FormItem>
          </i-col>
          <i-col span="10">
            <FormItem label="菜单隐藏">
              <i-switch size="large" v-model="formItem.hideInMenu">
                <span slot="open">是</span>
                <span slot="close">否</span>
              </i-switch>
            </FormItem>
          </i-col>
          <i-col span="10">
            <FormItem label="是否缓存">
              <i-switch size="large" v-model="formItem.notCache">
                <span slot="open">是</span>
                <span slot="close">否</span>
              </i-switch>
            </FormItem>
          </i-col>

        </Row>
      </Form>
    </Modal>
  </Card>
</template>

<script>
  import {queryMenu, saveMenu, editMenu, menuInfo, deleteMenu} from '@/api/system.js'

  export default {
    name: 'Menu',
    data() {
      return {
        total: 100,
        list: [
          {
            id: 1,
            path: '路由',
            name: '路由名',
            redirect: '重定向',
            component: '地址',
            // meta:{
            title: '菜单名称',
            showAlways: '显示父菜单',
            hideInBread: '标题隐藏',
            hideInMenu: '菜单隐藏',
            notCache: '是否缓存',
            access: '权限列表',
            icon: '菜单图标',
            href: '外部链接',
            beforeCloseName: '关闭回调',
            children: [
              {
                id: 11,
                path: '路由',
                name: '路由名',
                redirect: '重定向',
                component: '地址',
                // meta:{
                title: '菜单名称',
                showAlways: '显示父菜单',
                hideInBread: '标题隐藏',
                hideInMenu: '菜单隐藏',
                notCache: '是否缓存',
                access: '权限列表',
                icon: '菜单图标',
                href: '外部链接'
                // }
              }
            ]
            // }
          },
          {
            id: 2,
            path: '路由',
            name: '路由名',
            redirect: '重定向',
            component: '地址',
            // meta:{
            title: '菜单名称',
            showAlways: '显示父菜单',
            hideInBread: '标题隐藏',
            hideInMenu: '菜单隐藏',
            notCache: '是否缓存',
            access: '权限列表',
            icon: '菜单图标',
            href: '外部链接'
            // }
          }
        ],
        listQuery: { // 查询信息
          pageNum: 1, // 页码
          pageSize: 10, // 每页展示多少条
          userName: '',
          userCode: '',
          roleName: '',
          deptName: ''
        },
        columns: [
          {
            title: '菜单名称',
            key: 'title',
            tree: true
          },
          {
            title: '路由',
            key: 'path'
          }, {
            title: '路由名',
            key: 'name'
          }, {
            title: '地址',
            key: 'component'
          }, {
            title: '菜单图标',
            key: 'icon'
          }, {
            title: '操作',
            key: 'action',
            slot: 'action'
          }
        ],
        dialog: false,
        dialogTxt: '新增',
        formItem: {
          rowGuid: '',
          parentId: '',
          menuCode: '',
          path: '',
          name: '',
          redirect: '',
          component: '',
          title: '',
          showAlways: false,
          beforeCloseName: '',
          hideInBread: false,
          hideInMenu: false,
          notCache: false,
          access: '',
          icon: '',
          href: '',
          isMeta: false
        },
        ruleValidate: {
          path: [
            {required: true, message: '路由不能为空', trigger: 'blur'}
          ],
          title: [
            {required: true, message: '菜单名不能为空', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '路由名不能为空', trigger: 'blur'}
          ],
          icon: [
            {required: true, message: '菜单图标不能为空', trigger: 'blur'}
          ],
          component: [
            {required: true, message: '地址不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    mounted() {
      this.queryList()
    },
    methods: {
      queryList: async function () {
        const {status, data} = await queryMenu()
        if (status === 200 && data.code === '0000') {
          this.list = data.result
        }
      },
      menuInfo: async function (id) {
        const {status, data} = await menuInfo(id)
        if (status === 200 && data.code === '0000') {
          Object.keys(this.formItem).forEach(key => this.formItem[key] = data.result[key])
        }
      },
      handleSizeChange(val) {
        this.listQuery.pageSize = val
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val
      },
      add(row) {
        this.formItem.parentId = row.rowGuid
        this.dialog = true
      },
      cancle() {
        Object.keys(this.formItem).forEach(key => this.formItem[key] = '')
        this.$refs['menuForm'].resetFields();
        this.dialog = false
      },
      save: async function (type) {
        this.$refs['menuForm'].validate(async (valid) => {
          if (!valid) {
            this.$Message.error('请将信息填写完整！');
          } else {
            let res = null
            if (type === '修改') {
              res = await editMenu(this.formItem)
            } else {
              res = await saveMenu(this.formItem)
            }
            const {status, data} = res
            if (status === 200 && data.code === '0000') {
              this.dialog = false
              this.queryList()
              Object.keys(this.formItem).forEach(key => this.formItem[key] = '')
            }
          }
        })

      },
      edit(row) {
        this.dialogTxt = '修改'
        this.menuInfo(row.rowGuid)
        this.dialog = true
      },
      deleteRow: async function (row) {
        this.$Modal.confirm({
          title: '提示',
          content: `是否删除？`,
          onOk: async () => {
            const {status, data} = await deleteMenu(row.rowGuid)
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
  button {
    margin-right: 5px;
  }
</style>
