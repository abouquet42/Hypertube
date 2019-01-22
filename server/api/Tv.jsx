import {
  Meteor
} from 'meteor/meteor'
const imdb = require('imdb-api')
import { CommentDB } from '/common/Collections/Comment.jsx'
import { HTTP } from 'meteor/http'
import {
  TvWatch,
  WatchLaterTv,
  SavedTvShow
} from '/common/Collections/Tv.jsx'
let moment = require('moment')
const fetch = require('node-fetch')
const PopCorn = require('popcorn-api')
const TvApi = 'a1df6b4f23ae0441f2e186ad1a1c2db6'
const mainTvUrl = 'https://api.themoviedb.org/3/'
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const ffmpeg = require('fluent-ffmpeg')
ffmpeg.setFfmpegPath(ffmpegPath)
let flag = false

getPopCornInfos = async (id) => {
  let res = await new Promise(async (resolve, reject) => {
    try {
      let ret = await PopCorn.shows.get(id).then(datas => {
        let nbSeasons = []
        let imgSeason = null
        datas.episodes.map((data) => {
          let flag = 0
          nbSeasons.forEach(key => {
            if (parseInt(key['nb'], 16) === parseInt(data.season, 16)) flag = 1
          })
          if (flag === 0) {
            nbSeasons.push({ nb: data.season, value: [], img: imgSeason })
          }
          function compNb(a, b) {
            return a.nb - b.nb
          }
          nbSeasons = nbSeasons.sort(compNb)
        })
        datas.episodes.map((data) => {
          nbSeasons.forEach((k, i) => {
            if (k.nb === data.season)
              nbSeasons[i].value.push(data)
          })
        })
        return ({ pop: datas, allEp: nbSeasons })
      }).catch(e => { })
      resolve(ret)
    } catch (e) {
      resolve(false)
    }
  })
  return res
}

Meteor.methods({
  'Get_Recommanded_Tv': async (params) => {
    let url = `https://api.themoviedb.org/3/tv/${params.imdbID}/recommendations`
    try {
      let j = 0
      let res = []
      let dataMem = []
      if (j != 0) params.params['page']++
      j++
      let FinishResult = await new Promise((resolve, reject) => {
        HTTP.get(url, params, async (e, result) => {
          if (e) {
            params.params['page']--
            resolve('Empty')
          }
          else {
            // for (let i = 0; i < result.data.results.length; i++) {
            //   if (result.data.results[i].original_language !== 'en' && result.data.results[i].original_language !== 'fr'
            //     && result.data.results[i].original_language !== 'it' && result.data.results[i].original_language !== 'es') {
            //     result.data.results.splice(i, 1)
            //     i--
            //   }
            // }
            let all = await new Promise((resolve, reject) => {
              resolve(Promise.all(result.data.results.map(async (val, key) => {
                let test = await new Promise((resolve, reject) => {
                  let url = mainTvUrl + `tv/${val.id}/external_ids?api_key=${TvApi}&language=${params.language}`
                  try {
                    HTTP.get(url, params, async (e, resultId) => {
                      if (e) resolve('Empty')
                      else {
                        if (resultId.data.imdb_id) {
                          if (resultId.data.imdb_id.length > 0) {
                            let imdbId = resultId.data.imdb_id
                            let ret = await new Promise(async (resolve, reject) => {
                              let resPopCorn = await getPopCornInfos(imdbId)
                              resolve(resPopCorn)
                            })
                            resolve(ret)
                          } else resolve('Empty')
                        } else resolve('Empty')
                      }
                    })
                  } catch (e) {
                    resolve('Empty')
                  }
                })
                if (test) test.tvdb = val
                return (test)
              })))
            }).catch(e => { })
            resolve(all)
          }
        })
      })
      for (let k = 0; k < FinishResult.length; k++) {
        if (!FinishResult[k] || FinishResult[k] === 'Empty' || FinishResult[k].pop.episodes.length === 0) {
          FinishResult.splice(k, 1)
          k--
        }
      }
      if (FinishResult !== 'Empty') res = res.concat(FinishResult)
      return ({ res: res, mem: dataMem, page: params.params['page'] })
    } catch (e) {
      return false
    }
  },
  'Update_time_TV': (data) => {
    const {
      season,
      episode,
      nbSeason,
      nbEp,
      quality,
      subtitle,
      imdbID,
      tvdbID,
      userId,
      pop,
      tvdb,
      allEp,
      EpisodeNumber,
      SeasonNumber,
      torrent
    } = data
    let finished = false
    let totalEpisode = 0
    let episodeSeen = 0
    allEp.map((val, key) => {
      if (key === season) {
        episodeSeen = totalEpisode + episode
      }
      totalEpisode += val.value.length
    })
    if (season === nbSeason && episode === nbEp) finished = true
    let url = `https://api.themoviedb.org/3/tv/${tvdbID}/season/${SeasonNumber}/episode/${EpisodeNumber}/images?api_key=a1df6b4f23ae0441f2e186ad1a1c2db6`
    // let res = await new Promise((resolve, reject) => {
    fetch(url).then((resp) => resp.json()).then((result) => {
      if (result.stills && result.stills[0])
        image = 'https://image.tmdb.org/t/p/original' + result.stills[0].file_path
      else
        image = null
      TvWatch.upsert({
        userId,
        imdbID,
        tvdbID
      }, {
          season,
          episode,
          nbSeason,
          episodeSeen,
          totalEpisode,
          nbEp,
          quality,
          subtitle,
          imdbID,
          tvdbID,
          userId,
          pop,
          tvdb,
          allEp,
          finished,
          EpisodeNumber,
          SeasonNumber,
          image,
          torrent
        })
    })
    // })
  },
  'Get_Avancement_Tv': (data) => {
    let result = TvWatch.findOne(data)
    // console.log('result', result)
    return result || false
  },
  'Set_WatchLater_Tv': (vals) => {
    const { userId, imdbID, tvdbID, data } = vals
    vals.type = 'TV'
    WatchLaterTv.upsert({
      userId,
      imdbID,
      tvdbID
    }, vals)
  },
  'Unset_WatchLater_Tv': (data) => {
    let {
      userId,
      imdbID,
      tvdbID
    } = data
    WatchLaterTv.remove({
      userId,
      imdbID,
      tvdbID
    })
  },
  'Get_WatchLater_Tv': (data) => {
    let {
      userId,
      tvdbID,
      imdbID
    } = data
    let result = WatchLaterTv.findOne({
      userId,
      tvdbID,
      imdbID,
      type: 'TV'
    })
    return result ? true : false
  },
  'Send.comment_serie': ({ comment, userId, id, tvdb, image, userName }) => {
    if (comment && userId && id && tvdb && image && userName) {
      let date = moment().format('D-M-YYYY HH:mm:ss')
      CommentDB.insert({ comment, userId, id, tvdb, date, image, userName })
    }
  },
  'Send.comment_episode_serie': ({ comment, userId, id, tvdb, image, userName, seasonID }) => {
    if (comment && userId && id && tvdb && image && userName && seasonID) {
      let date = moment().format('D-M-YYYY HH:mm:ss')
      CommentDB.insert({ comment, userId, id, tvdb, date, image, userName, seasonID })
    }
  },
  'get_imdb_infos': (id) => {
    try {
      let ret = imdb.get({ id: id['id'] }, { apiKey: '3d2792f' }).then((resImdb) => {
        resImdb.actors = resImdb.actors.split(', ')
        return resImdb
      })
      return (ret)
    } catch (e) {
      // console.log('Error: ', e)
      return false
    }
  },
  'get_tmdb_popu': async (params) => {
    let timeOut = null
    let allResultTMDB = null
    let dataMem = []
    let url = ''
    if (params.type === 'popu') url = 'https://api.themoviedb.org/3/tv/popular'
    else if (params.type === 'disco') url = 'https://api.themoviedb.org/3/discover/tv'
    else if (params.type === 'latest') url = 'https://api.themoviedb.org/3/tv/airing_today'
    if (params.scroll === 0) {
        params.dataMem = []
    }
    try {
      let j = 0
      let res = []
      if (params.dataMem.length > 0) {
        res = res.concat(params.dataMem)
        params.params['page'] = params.page + 1
      }
      if (j != 0) params.params['page']++
      j++
      let FinishResult = await new Promise((resolve, reject) => {
        HTTP.get(url, params, async (e, result) => {
          allResultTMDB = result.length
          if (e) resolve('Empty')
          else {
            if (timeOut) clearTimeout(timeOut)
            // for (let i = 0; i < result.data.results.length; i++) {
            //   if (result.data.results[i].original_language !== 'en' && result.data.results[i].original_language !== 'fr'
            //     && result.data.results[i].original_language !== 'it' && result.data.results[i].original_language !== 'es') {
            //     result.data.results.splice(i, 1)
            //     i--
            //   }
            // }
            let all = await new Promise((resolve, reject) => {
              resolve(Promise.all(result.data.results.map(async (val, key) => {
                let test = await new Promise((resolve, reject) => {
                  let url = mainTvUrl + `tv/${val.id}/external_ids?api_key=${TvApi}&language=${params.language}`
                  try {
                    HTTP.get(url, params, async (e, resultId) => {
                      if (e) resolve('Empty')
                      else {
                        if (resultId.data.imdb_id) {
                          if (resultId.data.imdb_id.length > 0) {
                            let imdbId = resultId.data.imdb_id
                            let ret = await new Promise(async (resolve, reject) => {
                              let resPopCorn = await getPopCornInfos(imdbId)
                              resolve(resPopCorn)
                            })
                            resolve(ret)
                          } else resolve('Empty')
                        } else resolve('Empty')
                      }
                    })
                  } catch (e) {
                    resolve('Empty')
                  }
                })
                if (test) test.tvdb = val
                return (test)
              })))
            }).catch(e => { })
            resolve(all)
          }
        })
      })
      for (let k = 0; k < FinishResult.length; k++) {
        if (!FinishResult[k] || FinishResult[k] === 'Empty' || FinishResult[k].pop.episodes.length === 0) {
          FinishResult.splice(k, 1)
          k--
        } else {
          if (k !== 0 && FinishResult !== 'Empty') {
            if (FinishResult[k].pop.images === undefined) {
              FinishResult.splice(k, 1)
              k--
            }
          }
        }
      }
      if (FinishResult !== 'Empty') res = res.concat(FinishResult)
      if (res.length < allResultTMDB) {
        dataMem = res.slice(allResultTMDB, res.length)
        res.splice(allResultTMDB, res.length - allResultTMDB)
      }
      return ({ res: res, mem: dataMem, page: params.params['page'] })
    } catch (e) {
      // console.log('Error: ', e)
      return false
    }
  },
  'get_tmdb_search': async (params) => {
    let url = 'https://api.themoviedb.org/3/search/tv'
    try {
      let j = 0
      let l = 0
      let res = []
      let exxit = false
      while (exxit === false) {
        if (j != 0) params.params['page']++
        j++
        let FinishResult = await new Promise((resolve, reject) => {
          HTTP.get(url, params, async (e, result) => {
            if (result.data['page'] === result.data['total_pages']) exxit = true
            if (e) {
              l++
              if (params.params['page'] > 1) params.params['page']--
              resolve('Empty')
            }
            else {
              if (l > 1) l--
              // for (let i = 0; i < result.data.results.length; i++) {
              //   if (result.data.results[i].original_language !== 'en' && result.data.results[i].original_language !== 'fr'
              //     && result.data.results[i].original_language !== 'it' && result.data.results[i].original_language !== 'es') {
              //     result.data.results.splice(i, 1)
              //     i--
              //   }
              // }
              let all = await new Promise((resolve, reject) => {
                resolve(Promise.all(result.data.results.map(async (val, key) => {
                  let test = await new Promise((resolve, reject) => {
                    let url = mainTvUrl + `tv/${val.id}/external_ids?api_key=${TvApi}&language=${params.language}`
                    try {
                      HTTP.get(url, params, async (e, resultId) => {
                        if (e) resolve('Empty')
                        else {
                          if (resultId.data.imdb_id) {
                            if (resultId.data.imdb_id.length > 0) {
                              let imdbId = resultId.data.imdb_id
                              let ret = await new Promise(async (resolve, reject) => {
                                let resPopCorn = await getPopCornInfos(imdbId)
                                resolve(resPopCorn)
                              })
                              resolve(ret)
                            } else resolve('Empty')
                          } else resolve('Empty')
                        }
                      })
                    } catch (e) {
                      resolve('Empty')
                    }
                  })
                  if (test) test.tvdb = val
                  return (test)
                })))
              }).catch(e => { /* console.log(e) */ })
              resolve(all)
            }
          })
        })
        for (let k = 0; k < FinishResult.length; k++) {
          if (!FinishResult[k] || FinishResult[k] === 'Empty' || FinishResult[k].pop.episodes.length === 0) {
            FinishResult.splice(k, 1)
            k--
          } else {
            if (k !== 0 && FinishResult !== 'Empty') {
              if (FinishResult[k].pop.images === undefined) {
                FinishResult.splice(k, 1)
                k--
              }
            }
          }
        }
        if (FinishResult !== 'Empty') res = res.concat(FinishResult)
      }
      return ({ res: res, page: params.params['page'] })
    } catch (e) {
      return false
    }
  },
  'get_infos_season': ({ tvdbId }) => {
    var url = mainTvUrl + `tv/${tvdbId}?api_key=${TvApi}&language=en-EN`
    try {
      const res = HTTP.get(url)
      return res.data
    } catch (e) {
      return false
    }
  },
  'get_trailer_tv': ({ tvdbId }) => {
    var url = mainTvUrl + `tv/${tvdbId}/videos?api_key=${TvApi}&language=en-EN`
    try {
      const res = HTTP.get(url)
      return res.data
    } catch (e) {
      return false
    }
  },
  'get_cast_tv': ({ id }) => {
    var url = mainTvUrl + `tv/${id}/credits?api_key=${TvApi}`
    try {
      const res = HTTP.get(url)
      return res.data
    } catch (e) {
      return false
    }
  },
  'get_infos_episodes': async ({ tvdbId, numSeason, allEpisodes }) => {
    try {
      let all = await new Promise((resolve, reject) => {
        resolve(Promise.all(allEpisodes.map(async (data) => {
          let test = await new Promise((resolve2, reject) => {
            let url = mainTvUrl + `tv/${tvdbId}/season/${numSeason}/episode/${data.value.episode}?api_key=${TvApi}&language=en-EN`
            try {
              HTTP.get(url, async (e, resultId) => {
                if (e) {
                  resolve2('https://www.cefri.fr/wp-content/uploads/2018/06/questions-to-ask1.png')
                }
                else {
                  if (resultId.data.still_path) {
                    let img = 'https://image.tmdb.org/t/p/original' + resultId.data.still_path
                    resolve2(img)
                  } else resolve2('https://www.cefri.fr/wp-content/uploads/2018/06/questions-to-ask1.png')
                }
              })
            } catch (e) {
              resolve2('https://www.cefri.fr/wp-content/uploads/2018/06/questions-to-ask1.png')
            }
          })
          return (test)
        })))
      }).catch(e => {})
      return(all)

    } catch (e) {
      return false
    }
  },
  'save_TvShow': ({ id, idtvdb, data }) => {
    SavedTvShow.upsert({ id, idtvdb }, { id, idtvdb, data })
  }
})
Meteor.publish('Get_all_WatchLater_Tv', (data) => {
  const {
    userId
  } = data
  return WatchLaterTv.find({
    userId,
    type: 'TV'
  })
})
Meteor.publish('Get_all_Avancement_Tv', (data) => {
  const {
    userId
  } = data
  return TvWatch.find({
    userId
  })
})
Meteor.publish('Get_all_Serie_Comments', (data) => {
  const { id, tvdb } = data
  return CommentDB.find({ id, tvdb, seasonID: { $exists: false } }, { sort: { 'date': -1 } })
})
Meteor.publish('Get_all_Serie_Episode_Comments', (data) => {
  const { id, tvdb, seasonID } = data
  return CommentDB.find({ id, tvdb, seasonID }, { sort: { 'date': -1 } })
})
Meteor.publish('Get_Tv_saved', ({ id, idtvdb }) => {
  idtvdb = parseInt(idtvdb, 10)
  return SavedTvShow.find({ id, idtvdb })
})
