module.exports = function expressRoutes (app, sp) {
  var users = require(outpostRoot + '/models/user')
  var passport = require('passport')

  app.get('/login', function(req, res, next){
    return sp.render('outpost/index', res, 'login')
  })

  app.post( '/login', function(req, res, next){
    passport.authenticate( 'local', function ( err, email, info ){
      if ( err ) {
        return next(err)
      }
      if(!email){
        return sp.render('outpost/index', res, 'login', {message: info.message})
      }
      req.session.user = email
      return res.redirect('/')

    })(req,res,next)
  })

  app.get('/register', function(req, res, next){
    return sp.render('outpost/index', res, 'register')
  })

  app.post( '/register',
    function register(req, res, next){
      var model = req.getModel()
        , userData = req.body

      if( ! userData.password){
        userData.message = 'Password is empty!'
        return sp.render('outpost/index', res, 'register', userData)
      }
      if(userData.password !== userData.passwordconfirm){
        userData.message = 'Password does not match password confirmation'
        return sp.render('outpost/index', res, 'register', userData)
      }

      model.fetch(users.user(userData.email.replace('.','_')), function(err, _usr) {
        if( err ){
          return next(err)
        }
        if( _usr.get() != null) {
          userData.message = 'email allready used'
          return sp.render('outpost/index', res, 'register', userData)
        }
        var user = users.create(userData.email, (userData.name || ''), userData.password, 'player')

        model.set( model.at(_usr),user, function ( err ){
          if ( err ) {
            return next(err)
          }
          req.session.user = user.data.email
          req.session.role = user.role
          res.redirect('/')
        })
      })
    }
  )

}