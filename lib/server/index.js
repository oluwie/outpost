var http = require('http')
  , path = require('path')
  , express = require('express')
  , gzippo = require('gzippo')
  , derby = require('derby')
  , passport = require('passport')
  // , flash = require('connect-flash')
  , LocalStrategy = require('passport-local').Strategy

  , root = path.dirname(path.dirname(__dirname))
  , serverError = require('./serverError')


// SERVER CONFIGURATION //
global.outpostRoot = root

var expressApp = express()
  , outpost = require('../outpost')
  , server = module.exports = http.createServer(expressApp)

// derby.use(derby.logPlugin)
var store = derby.createStore({listen: server})

require(outpostRoot + '/models')(store)

var ONE_YEAR = 1000 * 60 * 60 * 24 * 365
  , publicPath = path.join(root, 'public')
  , staticPages = derby.createStatic ( root )


passport.use(new LocalStrategy(
  { usernameField: 'email'
  , passwordField: 'password'
  },
  require('./auth')(store)
))

expressApp
  .use(express.favicon())
  // Gzip static files and serve from memory
  .use(gzippo.staticGzip(publicPath, {maxAge: ONE_YEAR}))
  // Gzip dynamically rendered content
  .use(express.compress())

  // Uncomment to add form data parsing support
  .use(express.bodyParser())
  .use(express.methodOverride())

  // Uncomment and supply secret to add Derby session handling
  // Derby session middleware creates req.model and subscribes to _session
  .use(express.cookieParser())
  .use(store.sessionMiddleware({
    secret: process.env.SESSION_SECRET || 'heroes never die'
  , cookie: {maxAge: ONE_YEAR}
  }))

  // Adds req.getModel method
  .use(store.modelMiddleware())
  // .use(flash())
  // Creates an express middleware from the app's routes
  .use(passport.initialize())
  .use(passport.session())
  .use(expressApp.router)
  .use(outpost.router())
  .use(function(req) { throw '404: ' + req.url })
  .use(serverError(root))


// SERVER ONLY ROUTES //
require('./serverRoutes')(expressApp, staticPages)
