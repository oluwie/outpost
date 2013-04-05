var derby = require('derby')
  , outpost = derby.createApp(module)
  , get = outpost.get
  , view = outpost.view
  , ready = outpost.ready

derby.use(require('../../ui'))


// ROUTES //

// Derby routes can be rendered on the client and the server
// get('/', function(page, model, params, next) {
//   page.render()
// })


// CONTROLLER FUNCTIONS //

ready(function(model) {

})
