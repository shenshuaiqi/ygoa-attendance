import {hasChild, localRead, getToken, localSave} from '@/libs/util'
import Main from '@/components/main'
import {forEach} from '@/libs/tools'
import {
  userMenu	// 这里是封装的后台返回菜单数据的接口，方法名称根据实际情况改变
} from '@/api/system'

// 加载菜单
export const loadMenu = () => {
  let list = []
  let data = localRead('route')
  if (!data) {
    return list
  }
  list = formatMenu(JSON.parse(data))
  return list
}

// 格式化菜单
export const formatMenu = (list) => {
  let res = []
  forEach(list, item => {
    let obj = item
    if (item.isParentNode === '1') {
      obj.component = Main
    } else {
      let data = item.component
      // 这里的data应为 /notice/notice.vue 类似的数据，对应的是src/view/下的本地文件
      if (data) {
        obj.component = () => import('@/view' + data)
      }
    }
    if (hasChild(item)) {
      obj.children = formatMenu(item.children)
    }
    res.push(obj)
  })
  return res
}

export const insertRouter = async () => {
  const {status, data} = await userMenu()
  if (status === 200 && data.code === '0000') {
    localSave('route', JSON.stringify(data.result.list))
  }
}
