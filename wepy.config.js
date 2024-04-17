const path = require('path')
const Autoprefixer = require('autoprefixer')
const DefinePlugin = require('@wepy/plugin-define')
const PluginUglifyjs = require('@wepy/plugin-uglifyjs')

const envTarget = process.env.envTarget
const prod = process.env.NODE_ENV === 'production'

// todo 接口根据业务添加
function host () {
  switch (envTarget) {
    // 测试环境
    case 'dev':
      return JSON.stringify('https://api.linkedvisa.com')
    // easymock
    case 'proxy':
      return JSON.stringify('')
    // 正式
    case 'prod':
      return JSON.stringify('')
    default:
      return JSON.stringify('')
  }
}

let pluginsConf = [
  DefinePlugin({
    BASE_URL: host()
  })
]
if (prod) {
  pluginsConf = pluginsConf.concat([
    PluginUglifyjs()
  ])
}

module.exports = {
  wpyExt: '.wpy',
  eslint: true,
  cliLogs: !prod,
  static: ['static'],
  build: {
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
      '@api': path.join(__dirname, 'src/api'),
      '@pages': path.join(__dirname, 'src/pages'),
      '@common': path.join(__dirname, 'src/common'),
      '@components': path.join(__dirname, 'src/components')
    },
    aliasFields: ['wepy', 'weapp'],
    modules: ['node_modules']
  },
  compilers: {
    less: {
      compress: prod
    },
    postcss: {
      plugins: [
        Autoprefixer({
          overrideBrowserslist: 'last 5 version'
        })
      ],
      map: {
        inline: true
      }
    },
    babel: {
      sourceMap: true,
      presets: [
        '@babel/preset-env'
      ],
      plugins: [
        '@wepy/babel-plugin-import-regenerator'
      ]
    }
  },
  plugins: pluginsConf,
  appConfig: {
    noPromiseAPI: ['createSelectorQuery']
  }
}
