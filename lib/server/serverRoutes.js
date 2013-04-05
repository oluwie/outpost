module.exports = function expressRoutes (app, sp) {

  app.get('/', function(req, res, next){
    console.log('express get /')
    // if(req.user)
    return sp.render('outpost/index', res, 'auth')
  })

  app.get('/login', function(req, res, next){
    res.redirect('home')
  })

  app.post('/login',function(req, res){
    var username = req.body.username
      , password = req.body.password
      , model = req.model
      console.log(username, ' - ' , password)
      if ( ! (username && password) ) return res.redirect('/')
      console.log('Logged in!')
      if ( username && password ) return res.redirect('/')
  })

  app.all('*', function(req) {
    throw '404: ' + req.url
  })
}