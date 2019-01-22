import React, { Component } from 'react'
import { Mask } from 'mdbreact'
import './main.css'
import ReactPlayer from 'react-player'
import TvComment from '../Comments/TvShowComment.jsx'
let userImage = 'data:image/png;base64,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'
import { SavedTvShow } from '/common/Collections/Tv.jsx'
import { withTracker } from 'meteor/react-meteor-data'

class TvshowInfos extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hover: false,
      data: null,
      dataTvdb: null,
      dataImdb: null,
      allActors: null,
      director: null,
      prod: null,
      seasons: null,
      allEpisodes: null,
      currPath: null,
      code: null
    }
    this.props.history.listen(location => {
      if (this.state.currPath && location.pathname !== this.state.currPath && location.pathname.split('/')[1] === 'Tv' && location.pathname.split('/')[2] !== 'search')
        this.componentDidUpdate()
    })
    this.Mounted = false
  }

  componentDidUpdate = () => {
    this.Mounted = true
    let self = this
    let tvdbId = window.location.pathname.split('/')[3]
    if (this.props.TvSavedInfo.length > 0 && !this.state.data) {
      Meteor.call('get_infos_season', { tvdbId }, (err, resultId) => {
        if (resultId) {
          let genres = ''
          resultId.genres.forEach(element => {
            genres = genres + ' / ' + element['name']
          })
          resultId.genres = genres.substring(3)
          if ((!this.state.allActors) && this.Mounted)
            this.renderActors(resultId)
          if ((!this.state.seasons || !this.state.allEpisodes) && this.Mounted && !this.state.prod) {
            let prod = this.renderProd(resultId)
            if (!prod) {
              prod = []
              prod.prod = null
            }
            let pop = this.props.TvSavedInfo[0].data.pop
            let imdbId = this.props.TvSavedInfo[0].data.pop.imdbID
            let seasons = this.renderSeasons(pop, resultId, imdbId)
            self.setState({
              data: pop,
              dataTvdb: resultId,
              currPath: this.props.history.location.pathname,
              seasons: seasons.seasons,
              allEpisodes: seasons.allEpisodes,
              prod: prod.prod
            })
          }
        } else this.componentDidUpdate()
      })
      Meteor.call('get_trailer_tv', { tvdbId }, (err, result) => {
        if (result) {
          if (result.results.length > 0) {
            let code = result.results[0].key
            if (this.Mounted) self.setState({ code: code })
          }
        }
      })
    }
  }

  componentWillUnmount = () => {
    this.Mounted = false
  }

  onMouseEnterHandler = (e) => {
    this.setState({
      hover: true
    })
  }
  onMouseLeaveHandler = (e) => {
    this.setState({
      hover: false
    })
  }

  renderActors = async (data) => {
    if (data) {
      let id = data.id
      Meteor.call('get_cast_tv', { id }, (err, all) => {
        let casting = null
        if (all.cast && all.cast.length !== 0) {
          casting = all.cast.map((data, key) => (
            <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div >
                {data.profile_path === null ?
                  <img src={userImage} id='imgmaggle'></img> :
                  <img src={`https://image.tmdb.org/t/p/original${data.profile_path}`} id='imgmaggle'></img>}
              </div>
              <p className='font-weight-bold white-text' style={{ fontSize: '13px', marginRight: '2px', width: '100px', alignContent: 'center', textAlign: 'center', marginTop: 'auto' }} >{data.name}</p>
            </div>
          ))
        } else casting = 'Empty'
        let director = null
        let ok = 0
        if (all.crew && all.crew.length !== 0) {
          all.crew.forEach(element => {
            if (element.job === 'Director') ok = 1
          })
          if (ok) {
            director = all.crew.map((data, key) => (
              <div key={key}>
                {data.job === 'Director' ?
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div >
                      {data.profile_path === null ?
                        <img src={userImage} id='imgmaggle'></img> :
                        <img src={`https://image.tmdb.org/t/p/original${data.profile_path}`} id='imgmaggle'></img>}
                    </div>
                    <p className='font-weight-bold white-text' style={{ fontSize: '13px', marginRight: '2px', width: '100px', alignContent: 'center', textAlign: 'center', marginTop: 'auto' }} >{data.name}</p>
                  </div> : ''
                }
              </div>
            ))
          } else director = 'Empty'
        } else director = 'Empty'
        if (this.Mounted) this.setState({ allActors: casting, director: director })
      })
    }
  }

  renderProd = (data) => {
    if (data) {
      if (data.production_companies.length > 0) {
        let prod = data.production_companies.map((data, key) => (
          <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div>
              {data.logo_path === null ?
                <i className="fas fa-question fa-3x"></i> :
                <img src={`https://image.tmdb.org/t/p/original${data.logo_path}`} id='imgmaggle' style={{ width: '80px', height: 'auto', borderRadius: '0%' }}></img>}
            </div>
            <p className='font-weight-bold white-text' style={{ fontSize: '13px', marginRight: '2px', width: '100px', alignContent: 'center', textAlign: 'center', marginTop: 'auto' }} >{data.name}</p>
          </div>
        ))
        return ({ prod: prod })
      } else return (null)
    }
  }

  renderSeasons = (datas, dataTvdb, imdbID) => {
    if (datas) {
      let nbSeasons = []
      let imgSeason = null
      datas.episodes.map((data) => {
        let flag = 0
        nbSeasons.forEach(key => {
          if (parseInt(key['nb'], 16) === parseInt(data.season, 16)) flag = 1
        })
        if (flag === 0) {
          dataTvdb.seasons.forEach((k, i) => {
            if (k['season_number'] === data.season) {
              if (dataTvdb.seasons[i].poster_path) {
                imgSeason = 'https://image.tmdb.org/t/p/original' + dataTvdb.seasons[i].poster_path
              } else imgSeason = datas.images.poster
            }
          })
          if (!imgSeason) imgSeason = datas.images.poster
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
      let seasons = nbSeasons.map((data) => {
        if (data.img === 'https://image.tmdb.org/t/p/originalnull' || data.img === null) data.img = imgSeason
        return (
          <div key={data.nb}>
            <img className='imgSeason' src={data.img} style={{ width: '100px', height: '150px', margin: '10px' }} onClick={e => this.infosSeason(imdbID, dataTvdb.id, data.nb)} ></img>
            <p className='font-weight-bold white-text' style={{ position: 'relative', top: '-9px', marginLeft: '15px' }} >Season {data.nb}</p>
          </div>
        )
      })
      return ({
        seasons: seasons,
        allEpisodes: nbSeasons
      })
    }
  }

  playMovie = (e, data) => {
    e.preventDefault()
    e.stopPropagation()
    this.props.display(e, data, 'tv')
  }

  infosSeason = (id, idTvdb, numSeason) => {
    this.props.history.push({ pathname: `/Tv/${id}/${idTvdb}/${numSeason}` })
  }

  render() {
    const { hover, data, dataTvdb, director, allActors, code } = this.state
    let infos = false
    if (data && dataTvdb) infos = true
    if (data) data.title = data.title.replace(/&amp;/g, '&')
    return (
      <div style={{ paddingBottom: '5rem' }}>
        {infos ?
          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '20px', marginTop: '20px' }}>
            <div className='divFlex'>
              <div style={{ minWidth: '350px' }}>
                <div onMouseEnter={this.onMouseEnterHandler} onMouseLeave={this.onMouseLeaveHandler}>
                  {!hover ? <img src={data.images.poster.replace('http://', 'https://')} className='img-fluid imgDetails' alt='' style={{ width: '350px' }} /> : ''}
                  {hover ?
                    <Mask overlay="stylish-strong" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }} title='View details'>
                      <img src={data.images.poster.replace('http://', 'https://')} className='img-fluid' alt='' style={{ minWidth: '350px', maxWidth: '350px', backgroundColor: 'gray', opacity: '0.5' }} />
                      <i className="far fa-play-circle fa-7x cardPlayButton" style={{ position: 'absolute' }} title='View tv show' onClick={e => this.playMovie(e, this.props.TvSavedInfo[0].data)}></i>
                    </Mask>
                    : ''
                  }
                </div>
              </div>
              <div className='divCol'>
                <p className='font-weight-bold white-text' style={{ fontSize: '40px' }}>{data.title}</p>
                <p className='font-weight-bold white-text' style={{ fontSize: '20px' }}>{data.year}</p>
                <p className='font-weight-bold white-text' style={{ fontSize: '20px' }}>{dataTvdb.genres}</p>
                <p className="font-weight-bold yellow-text" style={{ fontSize: '20px' }}>{data.rating.percentage} %</p>
                <p className='font-weight-bold white-text' style={{ fontSize: '16px', marginBottom: '-5px' }}>Summary</p>
                <p className='font-weight white-text' style={{ fontSize: '14px', marginRight: '10px' }}>{data.synopsis}</p>
                <p className='font-weight-bold white-text' style={{ fontSize: '16px' }}>{data.runtime} min</p>
                <p className='font-weight-bold white-text' style={{ fontSize: '16px', marginBottom: '2px' }}>Available seasons ({data.numSeasons})</p>
                <div className='divFlex2' >
                  {this.state.seasons}
                </div>
                {director !== 'Empty' ?
                  <div><p className='font-weight-bold white-text' style={{ fontSize: '16px', marginBottom: '2px' }}>Director</p>
                    <div className='divFlex2' >
                      {director}
                    </div></div> : ''}
                {allActors !== 'Empty' ? <div>
                  <p className='font-weight-bold white-text' style={{ fontSize: '16px', marginBottom: '2px' }}>Cast</p>
                  <div className='divFlex2' >
                    {allActors}
                  </div></div> : ''}
                {this.state.prod ? <div>
                  <p className='font-weight-bold white-text' style={{ fontSize: '16px', marginBottom: '2px' }}>Productors</p>
                  <div className='divFlex2' >
                    {this.state.prod}
                  </div></div> : ''}
              </div>
            </div>
            {code ?
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                <iframe width="560" height="315" src={`https://www.youtube.com/embed/${code}`} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              </div>
              : ''}
          </div>
          : ''}
        {!!this.state.data &&
          <TvComment browserHistory={this.props.history} data={this.state.data}></TvComment>
        }
      </div>
    )
  }
}

export default withTracker(props => {
  let id = window.location.pathname.split('/')[2]
  let idtvdb = window.location.pathname.split('/')[3]
  idtvdb = parseInt(idtvdb, 10)
  return {
    SavedTvReady: Meteor.subscribe('Get_Tv_saved', { id, idtvdb }).ready(),
    TvSavedInfo: SavedTvShow.find({ id, idtvdb }).fetch() || false
  }
})(TvshowInfos)
