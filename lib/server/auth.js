var users = require(outpostRoot +'/models/user')

module.exports = function(store){

  return function(email, password, done){
    var hashedPW = users.hash(password)
      , model = store.createModel()

    model.fetch(users.password(email.replace('.','_')), function(err, _pw){
      if(err){
        done(err)
      }
      var pw = _pw.get()
      if( typeof pw !== 'string' )  return done(null, false, { message: 'User not found!'})
      if( pw !== hashedPW )         return done(null, false, { message: 'Invalid password!'})
      return done(null, email)
    })
  }
}