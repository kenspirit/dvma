const joi = require('joi')
const { sqlDB, nosqlDB } = require('../db')

function index(req, res) {
  res.render('inject/index')
}

function sqlPage(req, res) {
  res.render(`inject/sql`, { type: req.query.type })
}

function sqlData(req, res) {
  const cb = (err, users) => {
    res.json(users || [])
  }
  const username = req.query.username

  switch (req.query.type) {
    case 'safe':
      _sqlSafeData(username, cb)
      break
    case 'unsafe':
      _sqlUnsafeData(username, cb)
      break
  }
}

function _sqlSafeData(username, cb) {
  const statement = sqlDB.prepare('SELECT * FROM user where username like ?')

  statement.all(`${username}%`, cb)
}

function _sqlUnsafeData(username, cb) {
  sqlDB.all('SELECT * FROM user where username like \'' + username + '%\'', cb)
}

function sqlCode(req, res) {
  let code;
  switch (req.query.type) {
    case 'safe':
      code = _sqlSafeData.toString()
      break
    case 'unsafe':
      code = _sqlUnsafeData.toString()
      break
  }
  res.send(code)
}

function nosqlPage(req, res) {
  res.render(`inject/nosql`, { type: req.query.type })
}

function nosqlData(req, res) {
  const cb = (err, users) => {
    if (err) {
      return res.status(400).json({ error: err })
    }
    res.json(users || [])
  }

  switch (req.params.type) {
    case 'safe':
      _nosqlSafeData(req, cb)
      break
    case 'unsafe':
      _nosqlUnsafeData(req, cb)
      break
  }
}

function _nosqlSafeData(req, cb) {
  const queryValidationResult = joi.string().alphanum().validate(req.query.username)
  if (queryValidationResult.error) {
    return cb(queryValidationResult.error.message, null)
  }

  const regex = new RegExp(req.query.username)
  nosqlDB.users.find({ username: { $regex: regex } }, cb)
}

function _nosqlUnsafeData(req, cb) {
  // nosqlDB.users.find(req.query, cb)
  const regex = new RegExp(req.query.username)
  nosqlDB.users.find({ username: { $regex: regex } }, cb)
}

function nosqlCode(req, res) {
  let code;
  switch (req.query.type) {
    case 'safe':
      code = _nosqlSafeData.toString()
      break
    case 'unsafe':
      code = _nosqlUnsafeData.toString()
      break
  }
  res.send(code)
}

module.exports = {
  index,
  sqlPage,
  sqlData,
  sqlCode,
  nosqlPage,
  nosqlData,
  nosqlCode
}
