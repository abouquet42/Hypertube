import {
  Meteor
} from 'meteor/meteor'

const checkAuth = async (req, res) => {
  return new Promise((resolve, reject) => {
    if (req.method === 'POST') {
      let body = ""
      req.on('data', Meteor.bindEnvironment(function (data) {
        body += data
      }))
      req.on('end', Meteor.bindEnvironment(function () {
        let params = JSON.parse(body)
        let { api_key } = params
        let user = Meteor.users.findOne({ 'profile.api_token': api_key })
        if (api_key && user) {
          params.method = 'POST'
          resolve(params)
        } else {
          let error = JSON.stringify({
            status: 400,
            message: 'Wrong Api Token'
          })
          res.writeHead(400, '', {
            "content-type": "application/json; charset=utf-8",
            'Access-Control-Allow-Origin': '*'
          })
          res.write(error)
          res.end()
          resolve(false)
        }
      }))
    } else {
      let apiKey = req.query.api_key
      let user = Meteor.users.findOne({ 'profile.api_token': apiKey })
      if (apiKey && user) {
        let params = req.query
        params.method = 'GET'
        resolve(params)
      } else {
        let error = JSON.stringify({
          status: 400,
          message: 'Wrong Api Token'
        })
        res.writeHead(400, '', {
          "content-type": "application/json; charset=utf-8",
          'Access-Control-Allow-Origin': '*'
        })
        res.write(error)
        res.end()
        resolve(false)
      }
    }
  })
}

export default checkAuth
