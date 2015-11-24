const co = require('co')
const parse = require('co-body')
const mongoose = require('mongoose')

const User = mongoose.model('User')

exports.logger = (ctx, next) => {
  const start = new Date
  return next().then(() => {
    const ms = new Date - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
  })
}

exports.login = co.wrap(function* (ctx, next) {
  var body = yield parse(ctx)
  var username = body.username
  var password = body.password
  var user = yield User.findOne({ username:username }).exec()

  if (!user) return ctx.body = 'Invalid user.'

  if(yield user.verifyPassword(password)) {
    ctx.session.user = user._id
    return ctx.body = 'Login Success!'
  }

  ctx.body = 'Login failed.'
})

exports.logout = co.wrap(function* (ctx, next) {
  ctx.session = null
  ctx.redirect('/')
})

exports.authenticate = co.wrap(function* (ctx, next) {
  if (ctx.session.user) return yield next()
  ctx.body = 'You are not logged in'
})
