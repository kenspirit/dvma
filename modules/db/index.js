const nosqlDB = require('./nosql')
const sqlDB = require('./sql')

const fs = require('fs')
const path = require('path')

function initDB() {
  const dbFilePath = path.resolve(process.cwd(), './data')

  fs.writeFileSync(path.resolve(dbFilePath, './sql.db'), '')
  fs.writeFileSync(path.resolve(dbFilePath, './users.db'), '')
}

module.exports = {
  nosqlDB,
  sqlDB,
  initDB
}
