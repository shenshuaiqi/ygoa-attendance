import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import ViewUI from 'view-design'
import {
  setToken,
  getToken,
  setTitle,
  localSave,
  localRead,
  compareRoute
} from '@/libs/util'
import config from '@/config'

const {
  homeName
} = config

import {
  loadMenu,
  formatMenu
} from '@/libs/router-util'
import {
  userMenu	
} from '@/api/system'

Vue.use(Router)
const router = new Router({
  routes: [...routes, ...loadMenu()],
  mode: 'hash'
})

const LOGIN_PAGE_NAME = 'login'

router.beforeEach((to, from, next) => {
  ViewUI.LoadingBar.start()
  const token = getToken()
  const whiteArr = ['/404', '/500', '/401']
  if (whiteArr.indexOf(to.path) !== -1) {
    next()
  } else {
    if (!token && to.name !== LOGIN_PAGE_NAME) {
    
      next({
        name: LOGIN_PAGE_NAME // 跳转到登录页
      })
    } else if (!token && to.name === LOGIN_PAGE_NAME) {
    
      next() // 跳转
    } else if (token && to.name === LOGIN_PAGE_NAME) {
     
      next({
        name: homeName // 跳转到homeName页
      })
    } else {
      store.dispatch('getUserInfoNoPass').then(() => {
       
        userMenu().then(res => {
          if (res.status === 200 && res.data.code === '0000') {
            let menuData = res.data.result.list
            localSave('route', JSON.stringify(menuData))
         
            let list = formatMenu(menuData)

            if (compareRoute(to.name, res.data.result.accessMenu)) {
              next()
              store.commit('updateMenuList', list)
            } else {
              next({
                name: 'error_401'
              })
            }
          } else {
            next({
              name: 'error_404'
            })
          }
        })
      }).catch(() => {
        setToken('')
        next({
          name: 'login'
        })
      })
    }
  }
})

router.afterEach(to => {
  setTitle(to, router.app)
  ViewUI.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router

