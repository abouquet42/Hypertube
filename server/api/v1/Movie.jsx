import {
  Meteor
} from 'meteor/meteor'
const ApiPath = '/api/v1'
import checkAuth from './CheckAuth.jsx'

WebApp.connectHandlers.use(`${ApiPath}/movie_list`, async (req, res, next) => {
  let auth = await checkAuth(req, res)
  if (auth.method) {
    const Infos = Meteor.call('get_yts', {params: auth})
    const ret = JSON.stringify(Infos)
    res.writeHead(200, {
      "content-type": "application/json; charset=utf-8",
      'Access-Control-Allow-Origin': '*'
    })
    res.write(ret)
    res.end()
  }
})

WebApp.connectHandlers.use(`${ApiPath}/movie_suggestion`, async (req, res, next) => {
  let auth = await checkAuth(req, res)
  if (auth.method && auth.movie_id) {
    const Infos = Meteor.call('Get_Recommanded_Movie', {MovieId: auth.movie_id})
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

WebApp.connectHandlers.use(`${ApiPath}/movie_infos`, async (req, res, next) => {
  let auth = await checkAuth(req, res)
  if (auth.method && auth.movie_id) {
    const result = Meteor.call('get_yts_details', {params: auth})
    let imdbId = result.data.movie.imdb_code
    let newRes = Meteor.call('get_imdb_infos', { id: imdbId })
    newRes.credits = Meteor.call('get_tmdb_credits', { imdbid: imdbId })
    newRes.prod = Meteor.call('get_tmdb_infos', { imdbid: imdbId })
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
