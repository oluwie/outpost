module.exports = function initModels (store) {
  // var model = store.createModel()
  // model.set('users', [])
  require('./accessControl')(store)
  require('./queries')(store)
}