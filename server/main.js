import {
  Meteor
} from 'meteor/meteor'
import './api/Accounts'
import './api/CronRemove'
import CreateTorrent from './api/Bittorrent/index'
import {
  SubtitlesFiles
} from '/common/Collections/Files'
import {
  HTTP
} from 'meteor/http'

Meteor.startup(() => {
  Meteor.publish(null, function () {
    return SubtitlesFiles.find().cursor
  });
});

var bodyParser = Npm.require("body-parser")
var httpProxy = Npm.require("http-proxy")
const OS = Npm.require('opensubtitles-api');
let fs = Npm.require('fs')
let _fs = Npm.require('fs-extra')
let parseTorrent = Npm.require('parse-torrent')
let mainPath = Npm.require('path')
let path = '/sgoinfre/goinfre/Perso/llonger/hypertube/videos/'
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const ffmpeg = require('fluent-ffmpeg')
WebApp.connectHandlers.use(bodyParser.urlencoded({
  extended: true
}))
import './api/v1/Movie.jsx'
import './api/v1/User.jsx'
ffmpeg.setFfmpegPath(ffmpegPath)
const OpenSubtitles = new OS({
  useragent: 'Hyper42Tmp',
  username: 'hypertubealw',
  password: 'test123',
  ssl: true
});
const srt2vtt = Npm.require('srt-to-vtt')
const download = require('download')

Meteor.startup(() => {
  SyncedCron.start()
  let params = {
    port: 6000,
    ssl: {
      key: Assets.getText("server.key"),
      cert: Assets.getText("server.crt")
    }
  }
  SubtitlesFiles.collection.remove({ })
  httpProxy.createServer({
    target: {
      host: 'localhost',
      port: 3000
    },
    ssl: params.ssl,
    ws: true,
  }).listen(5000)
  var username = 'matcha42aboullon@gmail.com';
  var password = 'Matcha42!';
  var server = 'smtp.gmail.com';
  var port = '465';

  process.env.MAIL_URL = 'smtps://' +
    encodeURIComponent(username) + ':' +
    encodeURIComponent(password) + '@' +
    encodeURIComponent(server) + ':' + port

  Accounts.emailTemplates.siteName = 'Hypertube'

  WebApp.connectHandlers.use('/stream/', (req, res, next) => {
    let hash = req.originalUrl.split('/')[2]
    if (hash)
      CreateTorrent(hash, res, req)
  })
  import './api/Movies.jsx'
  import './api/Tv.jsx'
  import './api/Anime.jsx'
  Meteor.methods({
    'get_subtitles': async function (movie) {
      let ret = await new Promise(function (resolve, reject) {
        if (movie.magnet) {
          let info = parseTorrent(movie.magnet)
          OpenSubtitles.search({
            sublanguageid: ['fre', 'eng', 'fra'].join(),
            extensions: 'srt',
            season: movie.season,
            episode: movie.episode,
            limit: 'all',
            imdbid: movie.id
          }).then(async (subtitles) => {
            let tv = {
              name: info.name.replace('[eztv]', ''),
              url: movie.magnet
            }
            resolve(CreateSub(subtitles, tv))
          })
        } else {
          download(movie.url, path + 'public/tmp/torrent/').then((res) => {
            let sub = {}
            let info = parseTorrent(res)
            info.files.map((val, key) => {
              if (
                mainPath.extname(val.name) === '.mp4' ||
                mainPath.extname(val.name) === '.avi' ||
                mainPath.extname(val.name) === '.mkv' ||
                mainPath.extname(val.name) === '.ogg'
              ) {
                let name = val.name.split(mainPath.extname(val.name))[0]
                movie.name = name
                OpenSubtitles.search({
                  sublanguageid: ['fre', 'eng', 'fra'].join(),
                  extensions: 'srt',
                  season: movie.season | null,
                  episode: movie.episode | null,
                  limit: 'all',
                  imdbid: movie.id
                }).then(async (subtitles) => {
                  resolve(CreateSub(subtitles, movie))
                }).catch((err) => {
                  resolve(null)
                  // console.log('err', err)
                })
              }
            })
          })
        }
      })
      return (ret)
    },
  })
})


CreateSub = async (subtitles, movie) => {
  let sub = {}
  sub.en = await new Promise(function (enRes, enRej) {
    let good = null
    if (!subtitles.en || !subtitles.en[0]) enRes(null)
    subtitles.en.map((val, index) => {
      if (!good && val.filename.includes(movie.name))
        good = val
    })
    if (!good) good = subtitles.en[0]
    let name = good.filename.split('.srt')[0]
    const exist = SubtitlesFiles.findOne({
      'meta.url': good.url
    })
    let testExist = false
    if (exist) {
      testExist = fs.existsSync(exist.path)
    }
    if (!exist || exist.length < 21 || !testExist) {
      if (exist) {
        SubtitlesFiles.collection.remove({
          _id: exist._id
        })
      }
      const fileId = SubtitlesFiles.collection.insert({
        meta: {
          url: good.url
        }
      })
      download(good.url, `assets/app/uploads/SubtitlesFiles/${fileId}_srt`)
        .then(async () => {
          _addFileMeta = {
            fileName: good.filename,
            type: 'srt',
            size: '??',
            movieUrl: movie.url,
            meta: {
              url: good.url
            }
          }
          let CreatedStream = await fs.createReadStream(`assets/app/uploads/SubtitlesFiles/${fileId}_srt/${good.filename}`)
            .pipe(srt2vtt())
            .pipe(fs.createWriteStream(`assets/app/uploads/SubtitlesFiles/${fileId}.vtt`))
          CreatedStream.on('finish', () => {
            fs.readFile(`assets/app/uploads/SubtitlesFiles/${fileId}.vtt`, function (_readError, _readData) {
              if (_readError) {
                // console.log(_readError)
              } else {
                _addFileMeta.fileName = name + '.vtt'
                const vttFileId = SubtitlesFiles.write(_readData, _addFileMeta, function (_uploadError, _uploadData) {
                  if (_uploadError) {
                    // console.log(_uploadError)
                  } else {
                    _fs.removeSync(`assets/app/uploads/SubtitlesFiles/${fileId}_srt`); // remove temp upload
                    _fs.removeSync(`assets/app/uploads/SubtitlesFiles/${fileId}.vtt`); // remove temp upload
                    SubtitlesFiles.collection.remove({
                      _id: fileId
                    })
                    enRes(_uploadData._id)
                  }
                }, true);
              }
            })
          })
        })
    } else {
      enRes(exist._id)
    }
  })
  sub.fr = await new Promise(function (frRes, frRej) {
    let good = null
    if (!subtitles.fr || !subtitles.fr[0]) frRes(null)
    subtitles.fr.map((val, index) => {
      if (!good && val.filename.includes(movie.name))
        good = val
    })
    if (!good) good = subtitles.fr[0]
    let name = good.filename.split('.srt')[0]
    const exist = SubtitlesFiles.findOne({
      'meta.url': good.url
    })
    let testExist = false
    if (exist) {
      testExist = fs.existsSync(exist.path)
    }
    if (!exist || exist.length < 21 || !testExist) {
      if (exist) {
        SubtitlesFiles.collection.remove({
          _id: exist._id
        })
      }
      const fileId = SubtitlesFiles.collection.insert({
        meta: {
          url: good.url
        }
      })
      download(good.url, `assets/app/uploads/SubtitlesFiles/${fileId}_srt`)
        .then(async () => {
          _addFileMeta = {
            fileName: good.filename,
            type: 'srt',
            size: '??',
            movieUrl: movie.url,
            meta: {
              url: good.url
            }
          }
          let CreatedStream = await fs.createReadStream(`assets/app/uploads/SubtitlesFiles/${fileId}_srt/${good.filename}`)
            .pipe(srt2vtt())
            .pipe(fs.createWriteStream(`assets/app/uploads/SubtitlesFiles/${fileId}.vtt`))
          CreatedStream.on('finish', () => {
            fs.readFile(`assets/app/uploads/SubtitlesFiles/${fileId}.vtt`, function (_readError, _readData) {
              if (_readError) {
                // console.log(_readError)
              } else {
                _addFileMeta.fileName = name + '.vtt'
                const vttFileId = SubtitlesFiles.write(_readData, _addFileMeta, function (_uploadError, _uploadData) {
                  if (_uploadError) {
                    // console.log(_uploadError)
                  } else {
                    _fs.removeSync(`assets/app/uploads/SubtitlesFiles/${fileId}_srt`); // remove temp upload
                    _fs.removeSync(`assets/app/uploads/SubtitlesFiles/${fileId}.vtt`); // remove temp upload
                    SubtitlesFiles.collection.remove({
                      _id: fileId
                    })
                    frRes(_uploadData._id)
                  }
                }, true);
              }
            })
          })
        })
    } else {
      frRes(exist._id)
    }
  })
  return sub
}
