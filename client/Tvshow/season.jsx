import React, { Component } from 'react'
import { Input, Button, Mask } from 'mdbreact'
import './main.css'
import EpisodeComment from '../Comments/EpisodeComment.jsx'
const TvApi = 'a1df6b4f23ae0441f2e186ad1a1c2db6'
import { SavedTvShow } from '/common/Collections/Tv.jsx'
import { withTracker } from 'meteor/react-meteor-data'

class SeasonInfos extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: null,
      dataTvdb: null,
      dataImdb: null,
      episodes: null,
      numSeason: null,
      allEpisodes: null,
      test: 0
    }
    this.Mounted = false
  }

  componentDidUpdate = () => {
    this.Mounted = true
    if (this.props.TvSavedInfo.length > 0 && !this.state.data) {
      let tvdbId = window.location.pathname.split('/')[3]
      let numSeason = window.location.pathname.split('/')[4]
      Meteor.call('get_infos_season', { tvdbId }, (err, resultId) => {
        if (!this.state.episodes && this.Mounted) this.renderAllEpisodes(this.props.TvSavedInfo[0].data.pop.episodes, numSeason, resultId)
      })
    }
  }

  componentWillUnmount = () => {
    this.Mounted = false
  }

  renderAllEpisodes = async (data, numSeason, dataTvdb) => {
    if (data) {
      let allEpisodes = []
      data.map((data) => {
        if (parseInt(data.season, 10) === parseInt(numSeason, 10)) {
          allEpisodes.push({ value: data })
        }
      })
      this.renderEpisodes(numSeason, allEpisodes, dataTvdb)
    }
  }

  renderEpisodes = async (numSeason, allEpisodes, dataTvdb) => {
    let self = this
    let tvdbId = window.location.pathname.split('/')[3]
    let dataAll = { pop: this.props.TvSavedInfo[0].data.pop, tvdb: dataTvdb, allEp: this.props.TvSavedInfo[0].data.allEp }
    if (allEpisodes.length > 0) {
      function compNb(a, b) {
        return a.value.episode - b.value.episode
      }
      allEpisodes = allEpisodes.sort(compNb)
      Meteor.call('get_infos_episodes', { tvdbId, numSeason, allEpisodes }, async (err, result) => {
        let resultGeneral = await new Promise((resolve, reject) => {
          resolve(Promise.all(allEpisodes.map(async (data, key) => {
            return (
              <div key={data.value.id} className='TestEpisodeHover'>
                <div className='test' style={{ position: 'relative' }} >
                  <div className='test2' onClick={e => this.playMovie(e, dataAll, numSeason, key)}>
                    <img className='imgEpisode' src={result[key]} style={{ width: '150px', height: '85px', margin: '0px' }} ></img>
                    <div className='divI' >
                      <i className="far fa-play-circle fa-3x cardPlayEpisodeButton" title='View movie'></i>
                    </div>
                  </div>
                </div>
                <p className='font-weight-bold white-text' style={{ position: 'relative', top: '-11px', marginLeft: '20px', maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={data.value.title} >{data.value.title}</p>
                <p className='font-weight-bold' style={{ position: 'relative', top: '-20px', marginLeft: '20px', color: 'gray' }} >Episode {data.value.episode}</p>
              </div>
            )
          })))
        })
        self.setState({ episodes: resultGeneral, data: this.props.TvSavedInfo[0].data.pop, dataTvdb, numSeason })
      })
    }
  }

  playMovie = (e, data, numSeason, numEpisode) => {
    e.preventDefault()
    e.stopPropagation()
    data.allEp.map((val, key) => {
      if (parseInt(val.nb, 10) === parseInt(numSeason, 10)) {
        this.props.display(e, data, 'tv', { numSeason: key, numEpisode })
      
      }
    })
  }

  render() {
    const { data, dataTvdb, numSeason } = this.state
    let infos = false
    let nbEp = 0
    let summary = 0
    let nbSeason = -1
    let poster = null
    if (data && dataTvdb) {
      infos = true
      dataTvdb.seasons.forEach((element, index) => {
        if (parseInt(numSeason, 10) === parseInt(element.season_number, 10)) nbSeason = index
        if (nbSeason !== -1) {
          if (dataTvdb.seasons[nbSeason].overview !== '') summary = 1
          if (poster === null & dataTvdb.seasons[nbSeason].poster_path !== null) poster = 'https://image.tmdb.org/t/p/original' + dataTvdb.seasons[nbSeason].poster_path
          else if (poster === null & dataTvdb.seasons[nbSeason].poster_path === null) poster = data.images.poster
        }
      })
    }
    if (data) data.title = data.title.replace(/&amp;/g, '&')
    if (this.state.episodes) nbEp = this.state.episodes.length
    return (
      <div>
        {infos ?
          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '20px', marginTop: '20px' }}>
            <div className='divFlex'>
              <div style={{ minWidth: '150px', height: '225px' }}>
                <img src={poster} className='img-fluid' style={{ width: '150px' }} />
              </div>
              <div className='divCol'>
                <p className='font-weight-bold white-text' style={{ fontSize: '40px', marginLeft: '40px' }}>{data.title}</p>
                <p className='font-weight-bold white-text' style={{ fontSize: '16px', marginTop: '-10px', marginLeft: '40px' }}>Season {numSeason}</p>
                <hr style={{ color: 'gray', marginLeft: '20px', marginRight: '20px', height: '0px', borderBottom: '2px solid rgba(0,0,0,.3)' }}></hr>
                {summary ?
                  <div>
                    <p className='font-weight-bold white-text' style={{ fontSize: '16px', marginTop: '0px', marginLeft: '40px' }}>Summary</p>
                    <p className='font-weight white-text' style={{ fontSize: '14px', marginRight: '10px', marginLeft: '40px', marginTop: '-10px' }}>{dataTvdb.seasons[nbSeason].overview}</p>
                  </div> : ''}
                <p className='font-weight-bold white-text' style={{ fontSize: '16px', marginBottom: '2px', marginLeft: '40px', marginTop: '50px' }}>{nbEp} EPISODES</p>
                <div className='divFlex' style={{ flexWrap: 'wrap', marginLeft: '22px' }}>
                  {this.state.episodes}
                </div>
              </div>
            </div>
          </div>
          : ''}
        {!!this.state.data &&
          <EpisodeComment browserHistory={this.props.history} data={this.state.data} numSeason={this.state.numSeason}></EpisodeComment>
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
})(SeasonInfos)
