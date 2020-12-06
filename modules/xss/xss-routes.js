const controller = require('./xss-controller.js')

module.exports = {
  basePath: '/xss',
  routes: [
    {
      method: 'get',
      path: '/',
      handler: controller.index
    },
    {
      method: 'get',
      path: '/dom/unsafe',
      handler: controller.domUnsafe
    },
    {
      method: 'get',
      path: '/dom/safe',
      handler: controller.domSafe
    },
    {
      method: 'get',
      path: '/dom/unsafe-complex',
      handler: controller.domUnsafeComplex
    },
    {
      method: 'get',
      path: '/dom/safe-complex',
      handler: controller.domSafeComplex
    },
    {
      method: 'get',
      path: '/js/unsafe',
      handler: controller.jsUnsafe
    },
    {
      method: 'get',
      path: '/js/safe',
      handler: controller.jsSafe
    },
    {
      method: 'get',
      path: '/html/unsafe',
      handler: controller.htmlUnsafe
    },
    {
      method: 'get',
      path: '/html/safe',
      handler: controller.htmlSafe
    }
  ]
}
