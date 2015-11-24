const co = require('co')
const koa = require('koa')
const parse = require('co-body')
const mongoose = require('mongoose')
const Router = require('koa-router')
const session = require('koa-session')
const convert = require('koa-convert')

const router = Router()
const app = new koa()

// sesh
app.use(convert(session(app)))
app.keys = ['secret', 'keys']

// db
mongoose.connect('localhost/koa2db')
mongoose.connection.on('error', err=>{console.error(err)})

// models
require('./models')
var User = mongoose.model('User')

// controllers
var controllers = {}
controllers.user = require('./controllers/user')

// views
var views = require('./views')

// middleware
const mw = require('./middleware')
app.use(mw.logger)


router.get('/', views.homePage)

router.get  ( '/signup', views.signupForm )
router.post ( '/signup', controllers.user.createUser )

router.get  ( '/login', views.loginForm )
router.post ( '/login', mw.login )

router.get  ( '/logout', mw.logout )
router.get  ( '/hidden', mw.authenticate, views.hiddenPage )

router.get  ('/users/all', controllers.user.getUsers)

app.use(router.routes())
app.use(router.allowedMethods())
app.listen(3000)
