import {
  Meteor
} from 'meteor/meteor'
import {
  MovieDB,
  WatchDb,
  MovieWatch
} from '/common/Collections/Movie.jsx'
import { CommentDB } from '/common/Collections/Comment.jsx'
import { HTTP } from 'meteor/http'
let moment = require('moment')
const fetch = require('node-fetch')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const ffmpeg = require('fluent-ffmpeg')
ffmpeg.setFfmpegPath(ffmpegPath)
let fs = Npm.require('fs')

Meteor.methods({
  'Update_time': async (movie) => {
    if (movie.elapsed > 60) {
      movie.finished = false
      const {
        userId,
        imdb,
        movieId
      } = movie
      if (movie.total - movie.elapsed < 600) {
        movie.finished = true
      } else {
        let moviePath = MovieDB.findOne({
          magnet: movie.magnet
        })
        if (moviePath) {
          movie.screenshot = 'data:image/png;base64,' + await new Promise((resolve, reject) => {
            var proc = ffmpeg('/sgoinfre/goinfre/Perso/llonger/hypertube/videos/' + moviePath.path)
              .on('filenames', function (filenames) {
              })
              .on('end', function () {
                // console.log('screenshots were saved')
                fs.readFile('/sgoinfre/goinfre/Perso/llonger/hypertube/videos/thumbnails/' + `${movie.userId}-tmp.png`, (err, result) => {
                  if (!err) {
                    resolve(new Buffer(result).toString('base64'))
                    fs.unlinkSync('/sgoinfre/goinfre/Perso/llonger/hypertube/videos/thumbnails/' + `${movie.userId}-tmp.png`)
                  }
                })
              })
              .on('error', function (err) {
                resolve(null)
                // console.log('an error happened: ' + err.message);
              })
              .takeScreenshots({
                timestamps: [movie.elapsed],
                filename: `${movie.userId}-tmp.png`
              }, '/sgoinfre/goinfre/Perso/llonger/hypertube/videos/thumbnails')
          })
        }
      }
      MovieWatch.upsert({
        userId,
        imdb,
        movieId
      }, movie)
    }
  },
  'Get_Avancement': (data) => {
    let result = MovieWatch.findOne(data)
    return result || false
  },
  'Get_all_Avancement': (data) => {
    let result = MovieWatch.find(data).fetch()
    return result || false
  },
  'Set_WatchLater': (vals) => {
    let {
      userId,
      movieId,
      imdb,
      data
    } = vals
    vals.type = 'Movie'
    WatchDb.upsert({
      userId,
      movieId,
      imdb
    }, vals)
  },
  'Unset_WatchLater': (data) => {
    let {
      userId,
      movieId,
      imdb
    } = data
    WatchDb.remove({
      userId,
      movieId,
      imdb
    })
  },
  'Get_WatchLater': (data) => {
    let {
      userId,
      movieId,
      imdb
    } = data
    let result = WatchDb.findOne({
      userId,
      movieId,
      imdb,
      type: 'Movie'
    })
    return result ? true : false
  },
  'Get_all_WatchLater': (data) => {
    let result = WatchDb.find(data).fetch()
    return result || false
  },
  'Send.comment_movie': ({ comment, userId, id, imdb, image, userName }) => {
    if (comment && userId && id && imdb && image && userName) {
      let date = moment().format('D-M-YYYY HH:mm:ss')
      CommentDB.insert({ comment, userId, id, imdb, date, image, userName })
      return true
    } else {
      return { comment, userId, id, imdb, image, userName }
    }
  },
  'Get_Recommanded_Movie': async ({ MovieId }) => {
    let result = await new Promise((resolve, reject) => {
      let url = `https://yts.am/api/v2/movie_suggestions.json?movie_id=${MovieId}`
      fetch(url).then((resp) => resp.json())
        .then((result) => {
          resolve(result)
        })
    })
    return result
  },
  'get_yts': async (params) => {
    var url = 'https://yts.am/api/v2/list_movies.json'
    try {
      const res = HTTP.call('GET', url, params)
      let { movies } = res.data.data
      if (movies) {
        let test = await new Promise((resolve, reject) => {
          resolve(Promise.all(Object.keys(movies).map(async (val, index) => {
            movies[val].medium_cover_image = await new Promise((resolve, reject) => {
              HTTP.get(movies[val].medium_cover_image, (err, result) => {
                if (err) resolve('https://media.istockphoto.com/photos/35mm-movie-film-with-metal-reels-picture-id475113128?k=6&m=475113128&s=612x612&w=0&h=gtzstjbNbQ2l63RdKmJXvlVs3-dsiTFEJVmovrkAwZY=')
                else resolve(movies[val].medium_cover_image)
              })
            })
            return movies[val]
          })))
        })
        res.data.data.movies = test
        return res.data
      } else return false
    } catch (e) {
      return false
    }
  },
  'get_yts_details': async (params) => {
    var url = 'https://yts.am/api/v2/movie_details.json'
    try {
      const res = HTTP.call('GET', url, params)
      let img = await new Promise((resolve, reject) => {
        HTTP.get(res.data.data.movie.large_cover_image, (err, result) => {
          if (err) resolve('https://media.istockphoto.com/photos/35mm-movie-film-with-metal-reels-picture-id475113128?k=6&m=475113128&s=612x612&w=0&h=gtzstjbNbQ2l63RdKmJXvlVs3-dsiTFEJVmovrkAwZY=')
          else resolve(res.data.data.movie.large_cover_image)
        })
      })
      res.data.data.movie.large_cover_image = img
      return res.data
    } catch (e) {
      return false
    }
  },
  'get_tmdb_credits': (id) => {
    var url = 'https://api.themoviedb.org/3/movie/' + id['imdbid'] + '/credits?api_key=873d89398840272ba3cbc7340e84105a'
    try {
      const res = HTTP.call('GET', url)
      return res.data
    } catch (e) {
      return false
    }
  },
  'get_tmdb_infos': (id) => {
    var url = 'https://api.themoviedb.org/3/movie/' + id['imdbid'] + '?api_key=873d89398840272ba3cbc7340e84105a'
    try {
      const res = HTTP.call('GET', url)
      return res.data
    } catch (e) {
      return false
    }
  },
})

Meteor.publish('Get_all_WatchLater', (data) => {
  const {
    userId
  } = data
  return WatchDb.find({
    userId,
    type: 'Movie'
  })
})
Meteor.publish('Get_all_Movie_Comments', (data) => {
  const { id, imdb } = data
  return CommentDB.find({ id, imdb }, { sort: { 'date': -1 } })
})
Meteor.publish('Get_all_Avancement', (data) => {
  const { userId } = data
  return MovieWatch.find({ userId })
})
