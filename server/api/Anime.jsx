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
      // console.log('id', PopCorn.animes);
      let ret = await PopCorn.shows.get(id).then(datas => {
        // console.log('datas', datas)
        if (datas && datas.episodes) {
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
        } else return ({pop: datas, allEp: null})
      }).catch(e => { })
      // console.log('ret', ret)
      resolve(ret)
    } catch (e) {
      resolve(false)
    }
  })
  return res
}

let i = 0

getPopCornInfos2 = async (id, query) => {
  console.log('query', query)
  let res = await new Promise(async (resolve, reject) => {
    try {
      // console.log('id', PopCorn.animes);
      let ret = await PopCorn.animes.search({query}).then(([show]) => show.fetch()).then(datas => {
        if (datas && datas.episodes) {
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
        } else return false
      }).catch(e => { })
      // console.log('ret', ret)
      resolve(ret)
    } catch (e) {
      console.log(e)
      resolve(false)
    }
  })
  return res
}

Meteor.methods({
  // 'Get_Recommanded_Tv': async (params) => {
  //   let url = `https://api.themoviedb.org/3/tv/${params.imdbID}/recommendations`
  //   try {
  //     let j = 0
  //     let res = []
  //     let dataMem = []
  //     if (j != 0) params.params['page']++
  //     j++
  //     let FinishResult = await new Promise((resolve, reject) => {
  //       HTTP.get(url, params, async (e, result) => {
  //         if (e) {
  //           params.params['page']--
  //           resolve('Empty')
  //         }
  //         else {
  //           // for (let i = 0; i < result.data.results.length; i++) {
  //           //   if (result.data.results[i].original_language !== 'en' && result.data.results[i].original_language !== 'fr'
  //           //     && result.data.results[i].original_language !== 'it' && result.data.results[i].original_language !== 'es') {
  //           //     result.data.results.splice(i, 1)
  //           //     i--
  //           //   }
  //           // }
  //           let all = await new Promise((resolve, reject) => {
  //             resolve(Promise.all(result.data.results.map(async (val, key) => {
  //               let test = await new Promise((resolve, reject) => {
  //                 let url = mainTvUrl + `tv/${val.id}/external_ids?api_key=${TvApi}&language=${params.language}`
  //                 try {
  //                   HTTP.get(url, params, async (e, resultId) => {
  //                     if (e) resolve('Empty')
  //                     else {
  //                       if (resultId.data.imdb_id) {
  //                         if (resultId.data.imdb_id.length > 0) {
  //                           let imdbId = resultId.data.imdb_id
  //                           let ret = await new Promise(async (resolve, reject) => {
  //                             let resPopCorn = await getPopCornInfos(imdbId)
  //                             resolve(resPopCorn)
  //                           })
  //                           resolve(ret)
  //                         } else resolve('Empty')
  //                       } else resolve('Empty')
  //                     }
  //                   })
  //                 } catch (e) {
  //                   resolve('Empty')
  //                 }
  //               })
  //               if (test) test.tvdb = val
  //               return (test)
  //             })))
  //           }).catch(e => { })
  //           resolve(all)
  //         }
  //       })
  //     })
  //     for (let k = 0; k < FinishResult.length; k++) {
  //       if (!FinishResult[k] || FinishResult[k] === 'Empty' || FinishResult[k].pop.episodes.length === 0) {
  //         FinishResult.splice(k, 1)
  //         k--
  //       }
  //     }
  //     if (FinishResult !== 'Empty') res = res.concat(FinishResult)
  //     return ({ res: res, mem: dataMem, page: params.params['page'] })
  //   } catch (e) {
  //     return false
  //   }
  // },
  // 'get_imdb_infos': (id) => {
  //   try {
  //     let ret = imdb.get({ id: id['id'] }, { apiKey: '3d2792f' }).then((resImdb) => {
  //       resImdb.actors = resImdb.actors.split(', ')
  //       return resImdb
  //     })
  //     return (ret)
  //   } catch (e) {
  //     // console.log('Error: ', e)
  //     return false
  //   }
  // },
  'Anime_get_tmdb_popu': async (params) => {
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
  'Anime_get_tmdb_search': async (params) => {
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
                    if (val.genre_ids.includes(16)) {
                      let url = mainTvUrl + `tv/${val.id}/external_ids?api_key=${TvApi}&language=${params.language}`
                      try {
                        HTTP.get(url, params, async (e, resultId) => {
                          if (e) resolve('Empty')
                          else {
                            if (resultId.data.imdb_id) {
                              if (resultId.data.imdb_id.length > 0) {
                                let imdbId = resultId.data.imdb_id
                                let ret = await new Promise(async (resolve, reject) => {
                                  let resPopCorn = await getPopCornInfos2(imdbId, params.params.query)
                                  // console.log('resPopCorn', resPopCorn);
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
                    } else {
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
        // return FinishResult
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
      console.log('e', e);
      return false
    }
  }
})
