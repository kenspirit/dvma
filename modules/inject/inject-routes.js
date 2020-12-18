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
      path: '/sql/unsafe',
      handler: controller.sqlUnsafe
    },
    {
      method: 'get',
      path: '/sql/unsafe-data',
      handler: controller.sqlUnsafeData
    },
    {
      method: 'get',
      path: '/sql/unsafe-code',
      handler: controller.sqlUnsafeCode
    }
  ]
}
