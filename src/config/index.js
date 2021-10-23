export default {
  /**
   * @description 配置显示在浏览器标签的title
   */
  title: '考勤平台',
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 1,
  /**
   * @description 是否使用国际化，默认为false
   *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
   *              用来在菜单中显示文字
   */
  useI18n: false,
  /**
   * @description api请求基础路径
   */
  baseUrl: {
    dev: '',
    pro: '/innovate-api3/v3'
  },
  noProxyUrl:{
    dev: 'http://10.181.5.76:8080/'
  },
  shrUrl:{  //人事接口
    dev: 'http://10.181.5.63:8080/',
    pro:'http://testoa.yong-gang.cn/'
  },
  oaApprove:{
    dev:'http://oaapprove.yong-gang.cn/',
    pro:'http://oaapprove.yong-gang.cn/'
  },
  testoa:{
    dev:'http://testoa.yong-gang.cn/',
    pro:'http://testoa.yong-gang.cn/'
  },
  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homeName: 'home', //默认home，否则会报错找不到homeRouter的icon
  /**
   * @description 需要加载的插件
   */
  plugin: {
    'error-store': {
      showInHeader: false, // 设为false后不会在顶部显示错误日志徽标
      developmentOff: true // 设为true后在开发环境不会收集错误信息，方便开发中排查错误
    }
  }
}
