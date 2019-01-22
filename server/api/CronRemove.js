import {
  Meteor
} from 'meteor/meteor'
import {
  MovieDB,
  WatchDb,
  MovieWatch
} from '/common/Collections/Movie.jsx'
import {
  TvWatch,
  TvDb,
  WatchLaterTv
} from '/common/Collections/Tv.jsx'
let moment = require('moment')
let fs = Npm.require('fs')

let MyLogger = function(opts) {
}

SyncedCron.config({
  logger: MyLogger
})

SyncedCron.add({
  name: 'test',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('every 10 seconds');
  },
  job: function() {
    let now = moment().subtract(1, 'months').format('x')
    let result = MovieDB.find({$expr: {$lt: ['$last_watch', now]}}).fetch()
    if (result.length > 0) {
      result.map((val) => {
        fs.unlinkSync('/sgoinfre/goinfre/Perso/llonger/hypertube/videos/' + val.path)
        MovieDB.remove({_id: val._id})
      })
    }
  }
})

//https://stackoverflow.com/questions/7937233/how-do-i-calculate-the-date-in-javascript-three-months-prior-to-today
