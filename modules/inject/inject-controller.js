const sqlDB = require('../db').sqlDB

function index(req, res) {
  res.render('inject/index')
}

function sqlSafe(req, res) {
  res.render('inject/sql/safe')
}

function sqlUnsafe(req, res) {
  res.render('inject/sql/unsafe')
}

function sqlUnsafeData(req, res) {
  sqlDB.all('SELECT * FROM user where username == \'' + req.query.username + '\'', (err, users) => {
    res.json(users || [])
  })
}
function sqlUnsafeCode(req, res) {
  res.send(sqlUnsafeData.toString())
}

module.exports = {
  index,
  sqlUnsafe,
  sqlUnsafeData,
  sqlUnsafeCode,
  sqlSafe
}
