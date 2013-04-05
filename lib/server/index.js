var http = require('http')
  , path = require('path')
  , express = require('express')
  , gzippo = require('gzippo')
  , derby = require('derby')
  , outpost = require('../outpost')
  , serverError = require('./serverError')


// SERVER CONFIGURATION //

var expressApp = express()
  , server = module.exports = http.createServer(expressApp)

derby.use(derby.logPlugin)
var store = derby.createStore({listen: server})

var ONE_YEAR = 1000 * 60 * 60 * 24 * 365
  , root = path.dirname(path.dirname(__dirname))
  , publicPath = path.join(root, 'public')
  , staticPages = derby.createStatic ( root )

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
  // Creates an express middleware from the app's routes
  .use(outpost.router())
  .use(expressApp.router)
  .use(serverError(root))


// SERVER ONLY ROUTES //
require('./serverRoutes')(expressApp, staticPages)