
const Datastore = require('nedb')

const DB = {}
DB.users = new Datastore({ filename: './data/users.db', autoload: true })

module.exports = DB
