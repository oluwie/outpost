var derby = require('derby')
  , outpost = derby.createApp(module)
  , get = outpost.get
  , view = outpost.view
  , ready = outpost.ready

var users = require('../../models/user')

derby.use(require('../../ui'))

// ROUTES //

//catch all derbies and allow only authenticed access
get('*',function(page, model, params, next){
  if(model.session.user == null) {
    return page.redirect('/register')
  }
  next()
})

get('/logout', function(page,model,params,next){
  delete model.session.user
  delete model.session.role
  page.redirect('/login')
})

// Derby routes can be rendered on the client and the server
get('/', function(page, model, params, next) {
  model.fetch(users.user(model.session.user.replace('.','_')), '_session', function(err, _user, _session){
    console.log(_user.get())
    model.ref('_user', _user)
    page.render()
  })
})

// CONTROLLER FUNCTIONS //

ready(function(model) {
})
