var user = require('./user')

module.exports = function(store){
  // store.accessControl.readPath = true
  // store.accessControl.write    = true
  // store.accessControl.query    = true

  store.readPathAccess(user.data('*'), function ( userId, accept, onErr ){
    // only known users allowed
    if(this.session.user && this.session.role)
      return accept(true)
    accept(false)
  })

  store.readPathAccess(user.password('*'), function ( userId, accept, onErr ){
  console.log(this.session)
    // only known users allowed
    if(this.session.user && this.session.role)
      return accept(true)
    accept(false)
  })

  store.writeAccess('*', user.role('*'), function(userId,accept,onErr){
    // only known admins allowed
    if(this.session.user && this.session.role && this.session.role == 'admin' )
      return accept(true)
    accept(false)
  })

  store.writeAccess('*', user.data('*'), function(userId, accept, onErr){
    // only known users allowed
    if( ! (this.session.user && this.session.role) )
      return accept(false)
    // user may write their own dataset
    if( this.session.user.id === userId)
      return accept(true)
    if( this.session.role == 'admin' )
      return accept(true)
    accept(false)
  })

  store.writeAccess('*', user.password('*'), function(userId, accept, onErr){
    // only known users allowed
    if( ! (this.session.user && this.session.role) )
      return accept(false)
    // user may write their own dataset
    if( this.session.user.id === userId)
      return accept(true)
    accept(false)
  })

}