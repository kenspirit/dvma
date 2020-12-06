const path = require('path')
const glob = require('glob')
const express = require('express')
const session = require('express-session')
const ESAPI = require('node-esapi')

const app = express()
const port = 3000

app.set('view engine', 'ejs')
app.set('views', './views')
app.disable('view cache')

app.use(express.static('public'))

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 's3Cur3',
  name: 'dvwa',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: true
  }
}))

app.use(ESAPI.middleware())

app.use((req, res, next) => {
  // Sample unsafe cookie
  res.cookie('main-not-http-only', 'unsafe-main',
    {
      path: '/',
      httpOnly: false
    })

  next()
})

const files = glob.sync(path.resolve(__dirname, './modules/*/*-routes.js'), {})
files.forEach((file) => {
  const moduleFile = path.relative(__dirname, file)
  const moduleRoutes = require(`./${moduleFile}`)
  const basePath = moduleRoutes.basePath

  moduleRoutes.routes.forEach((route) => {
    app[route.method || 'get'](`${basePath}${route.path}`, route.handler)
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
