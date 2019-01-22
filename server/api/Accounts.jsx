import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check'
import { Accounts } from 'meteor/accounts-base'
import { ServiceConfiguration } from 'meteor/service-configuration'
import { MovieWatch, WatchDb } from '/common/Collections/Movie.jsx'
import { TvWatch, WatchLaterTv } from '/common/Collections/Tv.jsx'
import { CommentDB } from '/common/Collections/Comment.jsx'
let faker = require('faker')
import moment from 'moment'
const crypto = require('crypto')
// const crypto = require('crypto')

// export const UserAcc = new Mongo.Collection('tasks')
// ServiceConfiguration.configurations.remove({
//   service: "facebook"
// })
// ServiceConfiguration.configurations.insert({
//   service:"facebook",
//   appId: '1154081311422728',
//   secret: 'b2f0010edec0afc1fef6672edde81be4',
//   RedirectUri: 'https://localhost:5000/oauth/fb'
// })
ServiceConfiguration.configurations.remove({
  service: 'google'
});

ServiceConfiguration.configurations.insert({
  service: 'google',
  clientId: '479600398331-vk053728oh8kl90ruebvukq0sm901fm7.apps.googleusercontent.com',
  secret: '0mDFpAYLC6AjQeaIKD96qcTY'
})

ServiceConfiguration.configurations.remove({
  service: 'facebook'
});

ServiceConfiguration.configurations.insert({
  service: 'facebook',
  appId: '1154081311422728',
  secret: 'b2f0010edec0afc1fef6672edde81be4'

})
Accounts.config({ sendVerificationEmail: true, forbidClientAccountCreation: true })
Accounts.onCreateUser((options, user) => {
  if (options.service === '42') {
    user.emails[0].verified = true
    user.username = options.profile.login + '.42'
    user.profile = {
      lname: options.profile.last_name,
      fname: options.profile.first_name,
      userImage: options.profile.image_url,
      subtitles: 'none',
      quality: '480p',
      serv: 'hypertube'
    }
  } else if (user.services.password) {
    Meteor.setTimeout(() => { Accounts.sendVerificationEmail(user._id) }, 1000)
    user.profile = options.profile
  } else if (user.services.google) {
    user.emails = [{ address: user.services.google.email, verified: true }]
    user.username = faker.internet.userName()
    user.profile = {
      lname: user.services.google.family_name,
      fname: user.services.google.given_name,
      userImage: user.services.google.picture,
      subtitles: 'none',
      quality: '480p',
      serv: 'hypertube'
    }
  } else if (user.services.facebook) {
    user.emails = [{ address: user.services.facebook.email, verified: true }]
    user.username = faker.internet.userName()
    user.profile = {
      lname: user.services.facebook.last_name,
      fname: user.services.facebook.first_name,
      userImage: `http://graph.facebook.com/` + user.services.facebook.id + "/picture/?width=400",
      subtitles: 'none',
      quality: '480p',
      serv: 'hypertube'
    }
  }
  return user
})
Accounts.validateLoginAttempt((opts) => {
  if (!opts.allowed) {
    return new Meteor.Error('Error-log', opts.error.reason);
  } else {
    if (opts.user.services.facebook || opts.user.services.google)
      return true
    else if (opts.user.emails[0].verified === true) {
      return true
    }
    else {
      return false // + new Meteor.Error(403, 'You must verify your email address before you can log in')
    }
  }
})
Meteor.methods({
  'User.loged'() {
    return Meteor.user()
  },
  'User.insert'({ email, username, password, lname, fname, userImage }) {
    let subtitles = 'none'
    let quality = '480p'
    Accounts.createUser({ email, username, password, profile: { lname, fname, userImage, subtitles, quality } })
  },
  'User.remove'(taskId) {
    check(taskId);

    Tasks.remove(taskId);
  },
  'Users.CheckMail'({ email }) {
    if (email.length === 0) {
      return false
    } else {
      let res = Accounts.findUserByEmail(email)
      return (!res || res.length === 0)
    }
  },
  'Users.CheckUsername'({ username }) {
    if (username.length === 0) {
      return false
    } else {
      let res = Accounts.findUserByUsername(username)
      return (!res || res.length === 0)
    }
  },
  'User.Create42'(data) {
    let password = data.id + data.login
    Accounts.createUser({ email: data.email, username: data.login, password, profile: data, service: '42' })
    // return true
  },
  'Change.password'({ userId, passwordConf, username }) {
    let res = Accounts.findUserByUsername(username)
    if (res.length !== 0 && userId === res._id) {
      Accounts.setPassword(userId, passwordConf, { logout: false })
    }
  },
  'Change.username'({ username, oldusername, userId }) {
    let res = Accounts.findUserByUsername(oldusername)
    if (res.length !== 0 && userId === res._id) {
      Accounts.setUsername(userId, username)
    }
  },
  'Change.email'({ email, oldemail, userId, username }) {
    let res = Accounts.findUserByUsername(username)
    if (res.length !== 0 && userId === res._id) {
      if (oldemail !== null) {
        Accounts.removeEmail(userId, oldemail)
      }
      Accounts.addEmail(userId, email)
      Accounts.sendVerificationEmail(userId)
      return email
    }
  },
  'Change.fname'({ userId, username, fname }) {
    let res = Accounts.findUserByUsername(username)
    if (res.length !== 0 && userId === res._id) {
      Meteor.users.update({ _id: userId }, { $set: { "profile.fname": fname } })
    }
  },
  'Change.lname'({ userId, username, newname }) {
    let res = Accounts.findUserByUsername(username)
    if (res.length !== 0 && userId === res._id) {
      Meteor.users.update({ _id: userId }, { $set: { "profile.lname": newname } })
    }
  },
  'Change.picture'({ userId, username, userImage }) {
    let res = Accounts.findUserByUsername(username)
    if (res.length !== 0 && userId === res._id) {
      Meteor.users.update({ _id: userId }, { $set: { "profile.userImage": userImage } })
    }
  },
  'Change.quality'({ userId, username, quality }) {
    let res = Accounts.findUserByUsername(username)
    if (res.length !== 0 && userId === res._id) {
      Meteor.users.update({ _id: userId }, { $set: { "profile.quality": quality } })
    }
  },
  'Change.subtitles'({ userId, username, subtitles }) {
    let res = Accounts.findUserByUsername(username)
    if (res.length !== 0 && userId === res._id) {
      Meteor.users.update({ _id: userId }, { $set: { "profile.subtitles": subtitles } })
    }
  },
  'Remove.user'({ userId }) {
    // import { MovieWatch, WatchDb } from '/common/Collections/Movie.jsx'
// import { TvWatch, WatchLaterTv } from '/common/Collections/Tv.jsx'
    Meteor.users.remove(userId)
    MovieWatch.remove({userId})
    WatchDb.remove({userId})
    TvWatch.remove({userId})
    WatchLaterTv.remove({userId})
    CommentDB.remove({userId})
  },
  'User.get.info'({ _id }) {
    if (_id) {
      let user = Meteor.users.findOne({ _id })
      return user || false
    }
  },
  'Gen.Token'({ userId }) {
    let now = moment().format('x')
    let token = crypto.randomBytes(16).toString('hex')
    Meteor.users.update({ _id: userId }, { $set: { "profile.api_token": token, "profile.token_exp": now } })
    return { now, token }
  },
  'User.forgot.email'({ email }) {
    let res1 = Accounts.findUserByUsername(email)
    let res2 = Accounts.findUserByEmail(email)
    if (!res1 && !res2) {
      return false
    }
    else if (res1) {
      Accounts.sendResetPasswordEmail(res1._id)
      return res1
    }
    else if (res2) {
      Accounts.sendResetPasswordEmail(res2._id)
      return res2
    }
  }
})
