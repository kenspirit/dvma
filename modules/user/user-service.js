const { promisify } = require('util')
const argon2 = require('argon2')
const nosqlDB = require('../db/nosql')
const sqlDB = require('../db/sql')

const userFindOne = promisify(nosqlDB.users.findOne).bind(nosqlDB.users)
const userInsert = promisify(nosqlDB.users.insert).bind(nosqlDB.users)

async function findOneById(id) {
  return userFindOne({ _id: id })
}

async function findOneByUserName(username) {
  return userFindOne({ username })
}

async function registerUser({ username, password }) {
  const dbUser = await findOneByUserName(username)
  if (dbUser) {
    throw new BusinessError('BERR_USER_EXISTED', 'User already exists')
  }

  const passwordHash = await argon2.hash(password)
  return userInsert({ username, passwordHash })
}

async function verifyUserPassword(passwordHash, password) {
  return argon2.verify(passwordHash, password)
}

async function initSampleUsers() {
  const sampleUsers = [
    { username: 'admin', password: 'admin.password' },
    { username: 'normal', password: 'normal.password' }
  ]

  const createdUsers = await Promise.all(sampleUsers.map(registerUser))

  sqlDB.get('SELECT name FROM sqlite_master WHERE type=\'table\' AND name=\'user\'', (err, record) => {
    sqlDB.run('CREATE TABLE user (username TEXT, passwordHash TEXT)', (err, result) => {

      createdUsers.forEach((createdUser) => {
        sqlDB.run(`INSERT INTO user (username, passwordHash) VALUES ('${createdUser.username}', '${createdUser.passwordHash}')`)
      })

      sqlDB.all('SELECT * FROM user', (err, rows) => {
        console.log('Initialized data in sqlite.', JSON.stringify(rows, null, 2))
      })
    })
  })
}

module.exports = {
  findOneById,
  findOneByUserName,
  registerUser,
  verifyUserPassword,
  initSampleUsers
}
