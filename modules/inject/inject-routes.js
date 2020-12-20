const joi = require('joi')
const controller = require('./inject-controller')

module.exports = {
  basePath: '/inject',
  routes: [
    {
      method: 'get',
      path: '/',
      handler: controller.index
    },
    {
      method: 'get',
      path: '/sql',
      handler: controller.sqlPage
    },
    {
      method: 'get',
      path: '/sql/data',
      handler: controller.sqlData
    },
    {
      method: 'get',
      path: '/sql/code',
      handler: controller.sqlCode
    },
    {
      method: 'get',
      path: '/nosql',
      handler: controller.nosqlPage
    },
    {
      method: 'get',
      path: '/nosql/data/:type',
      handler: controller.nosqlData
    },
    {
      method: 'get',
      path: '/nosql/code',
      handler: controller.nosqlCode
    }
  ]
}
