const path = require('path')

const resolve = dir => {
  return path.join(__dirname, dir)
}

const BASE_URL =  '/ygoa-attendance/'

module.exports = {
  // Project deployment base
  // By default we assume your app will be deployed at the root of a domain,
  // e.g. https://www.my-app.com/
  // If your app is deployed at a sub-path, you will need to specify that
  // sub-path here. For example, if your app is deployed at
  // https://www.foobar.com/my-app/
  // then change this to '/my-app/'
  publicPath: BASE_URL,
  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  lintOnSave: false,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))
  },
  // 设为false打包时不生成.map文件
  productionSourceMap: false,
  // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
  devServer: {
    proxy: {
      '/oa': {
        target: 'http://oakaoqin.yong-gang.cn/innovate-api3/v3/oa/', // API服务器的地址
        //target: 'http://10.181.5.214:8080/innovate-api3/v3/oa/', // 测试服务器的地址
        // ws: true,  //代理websockets
        changeOrigin: true, // 虚拟的站点需要更管origin
        pathRewrite: { // 重写路径 比如'/api/aaa/ccc'重写为'/aaa/ccc'
          '^/oa': ''
        }
      },
      '/oaapi': {
        target: 'http://oaapi.yong-gang.cn:8080/', // API服务器的地址
        // ws: true,  //代理websockets
        changeOrigin: true, // 虚拟的站点需要更管origin
        pathRewrite: { // 重写路径 比如'/api/aaa/ccc'重写为'/aaa/ccc'
          '^/oaapi': ''
        }
      },
      '/local': {
        target: 'http://127.0.0.1:7001/', // API服务器的地址
        // ws: true,  //代理websockets
        changeOrigin: true, // 虚拟的站点需要更管origin
        pathRewrite: { // 重写路径 比如'/api/aaa/ccc'重写为'/aaa/ccc'
          '^/local': ''
        }
      }
    }
  },
  configureWebpack (config) {
    // ...

    config.externals = {
      'AMap': 'AMap' // 高德地图配置
    }
  }
}
