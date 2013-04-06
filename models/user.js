var crypto = require('crypto')

/* HELPERS */
/**
 * @param  {string} pw
 * @return {string}  hashed with sha1
 */
var hash  = exports.hash = function hash(pw){
  var pwHash = crypto.createHash('sha1')
  pwHash.update(pw, 'utf8')
  return pwHash.digest('utf8')
}

/**
 * creates a new User
 * @param  {Object} user data containing <name>, email
 * @return {User}
 */
var create = exports.create = function create(email, name, pw, role){
  return  { data     : { email:email
                       , name : name
                       }
          , role     : role
          , password : hash(pw)
          }
}

/* PATHS */
exports.paths = {}
var user = exports.paths.user = exports.user = function user(userId) {
  return 'outpost.users.' + (userId || '*')
}
var password = exports.paths.password = exports.password = function password(userId) {
  return user(userId) + '.password'
}
var role = exports.paths.role = exports.role = function role(userId) {
  return user(userId) + '.role'
}
var data = exports.paths.data = exports.data = function data(userId) {
  return user(userId) + '.data'
}
