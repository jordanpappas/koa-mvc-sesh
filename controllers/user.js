var mongoose = require('mongoose')
var parse = require('co-body')
var co = require('co')

var User = mongoose.model('User')

exports.createUser = co.wrap(function* (ctx, next) {
  var body = yield parse(ctx)
  var user = new User({
    username: body.username,
    password: body.password,
    email: body.email,
    level: 'basic'
  })

  try {
    yield user.save()
    ctx.body = 'New user added'
  } catch(err) {
    console.log(err)
    ctx.body = 'Something went wrong.'
  }
})

exports.getUsers = co.wrap(function* (ctx, next) {
  ctx.body = yield User.find()
})

exports.makeAdmin = co.wrap(function* (ctx, next) {
  var user = yield User.findOne({_id: this.params.id})
  user.level = 'admin'
  yield user.save()
  ctx.body = 'Made admin.'
})
