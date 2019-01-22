import {
  Meteor
} from 'meteor/meteor'
const ApiPath = '/api/v1'
import checkAuth from './CheckAuth.jsx'

WebApp.connectHandlers.use(`${ApiPath}/user_infos`, async (req, res, next) => {
  let auth = await checkAuth(req, res)
  if (auth.method) {
    let { api_key } = auth
    let user = Meteor.users.findOne({ 'profile.api_token': api_key })
    let Infos = {
      Creation_date: user.createdAt,
      Login: user.username,
      First_name: user.profile.fname,
      Last_name: user.profile.lname,
      Image: user.profile.userImage,
      API: user.profile.api_token,
      Email: user.emails[0].address,
      Api_request_id: user._id 
    }
    const ret = JSON.stringify(Infos)
    res.writeHead(200, {
      "content-type": "application/json; charset=utf-8",
      'Access-Control-Allow-Origin': '*'
    })
    res.write(ret)
    res.end()
  } else if (auth) {
    let error = JSON.stringify({
      status: 400,
      message: 'Please provide a movie_id'
    })
    res.writeHead(400, '', {
      "content-type": "application/json; charset=utf-8",
      'Access-Control-Allow-Origin': '*'
    })
    res.write(error)
    res.end()
  }
})

WebApp.connectHandlers.use(`${ApiPath}/user_movies`, async (req, res, next) => {
  let auth = await checkAuth(req, res)
  let {userId} = auth
  let result = Meteor.call('Get_all_Avancement', {userId})
  if (auth.method && auth.userId && result.length > 0) {
    let newRes = {status: 'OK'}
    newRes.movies = result.map((val, key) => {
      delete val.userId
      val.Api_request_id = val._id
      delete val._id
      delete val.screenshot
      return val
    })
    if (newRes.movies.length === 0) newRes.movies = 'Empty'
    const ret = JSON.stringify(newRes)
    res.writeHead(200, {
      "content-type": "application/json; charset=utf-8",
      'Access-Control-Allow-Origin': '*'
    })
    res.write(ret)
    res.end()
  } else if (auth) {
    let error = JSON.stringify({
      status: 400,
      message: auth.userId ? 'Invalid usedId' : 'Please provide your api_request_id'
    })
    res.writeHead(400, '', {
      "content-type": "application/json; charset=utf-8",
      'Access-Control-Allow-Origin': '*'
    })
    res.write(error)
    res.end()
  }
})

WebApp.connectHandlers.use(`${ApiPath}/user_post_movie_comment`, async (req, res, next) => {
  let auth = await checkAuth(req, res)
  if (auth.method && auth.userId && auth.movie_id && auth.comment && auth.comment.length > 0) {
    let {userId, comment} = auth
    let id = parseInt(auth.movie_id, 10)
    let user = Meteor.users.findOne({ _id: userId })
    if (user) {
      let image = user.profile.userImage
      let userName = user.username
      const InfosMovie = Meteor.call('get_yts_details', {params: {movie_id: id}})
      if (InfosMovie) {
        let imdb = InfosMovie.data.movie.imdb_code
        let result = Meteor.call('Send.comment_movie', { comment, userId, id, imdb, image, userName })
        res.writeHead(200, {
          "content-type": "application/json; charset=utf-8",
          'Access-Control-Allow-Origin': '*'
        })
        let rett = JSON.stringify({
          status: 'OK',
          message: "Your comment has been published"
        })
        res.write(rett)
        res.end()
      } else {
        let mess = 'Invalid movie id'
        let error = JSON.stringify({
          status: 400,
          message: mess
        })
        res.writeHead(400, '', {
          "content-type": "application/json; charset=utf-8",
          'Access-Control-Allow-Origin': '*'
        })
        res.write(error)
        res.end()
      }
    } else {
      let mess = 'Invalid user id'
      let error = JSON.stringify({
        status: 400,
        message: mess
      })
      res.writeHead(400, '', {
        "content-type": "application/json; charset=utf-8",
        'Access-Control-Allow-Origin': '*'
      })
      res.write(error)
      res.end()
    }
  } else if (auth) {
    let mess = null
    if (!auth.userId) mess = 'Please provide your api_request_id'
    else if (!auth.movieId) mess = 'Please provide a valid movie id'
    else if (!auth.comment || auth.comment.length === 0) mess = 'Please provide a valid/non-null comment'
    let error = JSON.stringify({
      status: 400,
      message: mess
    })
    res.writeHead(400, '', {
      "content-type": "application/json; charset=utf-8",
      'Access-Control-Allow-Origin': '*'
    })
    res.write(error)
    res.end()
  }
})
