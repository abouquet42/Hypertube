import React, { Component } from 'react'
import 'rc-slider/assets/index.css'
let timer = null
import Slider, { Range } from 'rc-slider';
import { Button } from 'mdbreact'
import './buttonPlay.css'
import DropMenu from './component/menus'
import DropMenuTv from './component/menusTv'
import DropMenuSub from './component/menuSub'
let count = 0
const SubPath = '/sgoinfre/goinfre/Perso/llonger/hypertube/videos/public/sub/'
let VideoPromise = undefined
import { SubtitlesFiles } from '/common/Collections/Files'
let ErrorTimer = null

export default class MoviePlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: null,
      showControls: false,
      trackColor: 'transparent',
      fullScreen: false,
      playing: false,
      activeTracker: false,
      mute: false,
      volume: 50,
      trackVal: 0,
      currentTime: 0,
      elapsed: [0, 0, 0],
      fullTime: [0, 0, 0],
      large: true,
      waiting: true,
      chevronShow: false,
      activeSettings: false,
      currentQuality: '720p',
      currentTorrent: null,
      allSub: null,
      currSub: 'none',
      timeForQuality: null,
      SaveSize: true,
      ReadyToPlay: false,
      season: 0,
      episode: 0,
      restartPlaying: false
    }
    this.VideoRef = null
    this.intervalUpdate = null
    this.Mounted = false
  }

  componentWillUnmount = () => {
    this.Mounted = false
    window.onkeydown = null
    if (ErrorTimer) clearTimeout(ErrorTimer)
    const userId = Meteor.userId()
    if (this.props.type === 'movie' && this.VideoRef && !this.state.waiting) {
      const elapsed = this.VideoRef.currentTime
      const total = this.VideoRef.duration
      const quality = this.state.currentQuality
      const subtitle = this.state.currSub
      const movieId = this.props.data.id
      const imdb = this.props.data.imdb_code
      const magnet = 'magnet:?xt=urn:btih:' + this.state.currentTorrent.hash
      Meteor.call('Update_time', { elapsed, total, quality, subtitle, movieId, imdb, userId, data: this.props.data, magnet })
    } else if (this.props.type === 'tv' && this.VideoRef) {
      const quality = this.state.currentQuality
      const subtitle = this.state.currSub
      const { season, episode } = this.state
      let nbSeason = this.props.data.allEp.length - 1
      let nbEp = this.props.data.allEp[nbSeason].value.length - 1
      const { pop, tvdb, allEp } = this.props.data
      const { imdbID } = pop
      const tvdbID = tvdb.id
      const torrent = this.state.currentTorrent
      const SeasonNumber = this.props.data.allEp[season].value[episode].season
      const EpisodeNumber = this.props.data.allEp[season].value[episode].episode
      Meteor.call('Update_time_TV', { torrent, season, episode, nbSeason, nbEp, quality, subtitle, imdbID, tvdbID, userId, pop, tvdb, allEp, SeasonNumber, EpisodeNumber })
    }
    if (this.VideoRef) {
      this.VideoRef.src = null
      this.VideoRef = null
    }
  }

  componentWillMount = async () => {
    if (ErrorTimer) clearTimeout(ErrorTimer)
    ErrorTimer = setTimeout(() => {
      this.exitPlayer(null, true)
    }, 60000);
    this.Mounted = true
    let userId = Meteor.userId()
    if (this.props.type === 'movie') {
      let movieId = this.props.data.id
      let imdb = this.props.data.imdb_code
      let { currentQuality, currSub } = this.state
      let founded = false
      this.props.data.torrents.map((val, index) => {
        if (val.quality === currentQuality && !founded)
        if (this.Mounted) {
          founded = true
          this.setState({
            currentTorrent: val
          })
        }
      })
      // if (this.Mounted) this.GetSubtitles(this.props)
      let settings = await new Promise((resolve, reject) => {
        Meteor.call('User.get.info', {_id: userId}, (err, result) => {
          if (!err && result) resolve(result.profile)
          else resolve(null)
        })
      })
      let result = await new Promise((resolve, reject) => {
        Meteor.call('Get_Avancement', { movieId, imdb, userId }, (err, results) => {
          resolve(results)
        })
      })
      if (result !== false && this.Mounted) {
        this.VideoRef.currentTime = result.elapsed
        if (result.quality !== this.state.currentQuality) {
          currentQuality = result.quality
          let founded = false
          this.props.data.torrents.map((val, index) => {
            if (val.quality === currentQuality && !founded)
              if (this.Mounted) {
                founded = true
                this.setState({
                  currentTorrent: val
                })
              }
          })
        }
        if (result.subtitle !== this.state.currSub) {
          currSub = result.subtitle
        }
        let rest = result.total - result.elapsed
        let fullSec = Math.floor(rest % 60)
        let fullMin = Math.floor(((rest - fullSec) / 60) % 60)
        let fullHour = Math.floor(((rest) / 3600))
        let elSec = Math.floor(result.elapsed % 60)
        let elMin = Math.floor(((result.elapsed - elSec) / 60) % 60)
        let elHour = Math.floor(((result.elapsed) / 3600))
        result.time = {}
        result.time.elapsed = [elHour, elMin, elSec]
        result.time.rest = [fullHour, fullMin, fullSec]
        if (this.Mounted) {
          this.setState({
            restartPlaying: result,
            ReadyToPlay: false,
            currentTime: result.elapsed,
            currentQuality,
            currSub
          })
        }
      } else if (settings !== null && this.Mounted) {
        if (settings.quality !== '720p' && settings.quality !== '1080p')
          settings.quality = '720p'
        if (settings.quality !== this.state.currentQuality)
          currentQuality = settings.quality
        if (settings.subtitles !== this.state.currSub)
          currSub = settings.subtitles
        this.props.data.torrents.map((val, index) => {
          if (val.quality === currentQuality)
            if (this.Mounted) {
              this.setState({
                currentTorrent: val,
                currentQuality,
                currSub
              })
            }
        })
      }
    } else {
      let torrent = null
      let tvdbID = this.props.data.tvdb.id
      let userId = Meteor.userId()
      const { imdbID } = this.props.data.pop
      let result = null
      if (!this.props.data.valTv) {
        result = await new Promise((resolve, reject) => {
          Meteor.call('Get_Avancement_Tv', { tvdbID, imdbID, userId }, (err, results) => {
            resolve(results)
          })
        })
      }
      if (result) {
        this.setState({
          currentQuality: result.quality,
          currentTorrent: result.torrent,
          restartPlaying: result,
          ReadyToPlay: false,
          currSub: result.subtitle,
          season: result.season,
          episode: result.episode
        })
      } else {
        let {season, episode } = this.state
        if (this.props.data.valTv) {
          season = this.props.data.valTv.numSeason
          episode = this.props.data.valTv.numEpisode
        }
        let {currSub, currentQuality} = this.state
        Object.keys(this.props.data.allEp[season].value[episode].torrents).map((val, key) => {
          if (val === currentQuality)
            torrent = this.props.data.allEp[season].value[episode].torrents[val]
        })
        if (!torrent) {
          torrent = this.props.data.allEp[season].value[episode].torrents[0]
          let qual = this.props.data.allEp[season].value[episode].torrents[0].resolution
          currentQuality = qual
        }
        if (this.Mounted) this.setState({ currentTorrent: torrent, episode, season, currentQuality, currSub })
        let settings = await new Promise((resolve, reject) => {
          Meteor.call('User.get.info', {_id: userId}, (err, result) => {
            if (!err && result) resolve(result.profile)
            else resolve(null)
          })
        })
        if (settings) {
          if (settings.quality === '1080p')
            settings.quality = '720p'
          if (settings.quality !== this.state.currentQuality)
            currentQuality = settings.quality
          if (settings.subtitles !== this.state.currSub)
            currSub = settings.subtitles
            Object.keys(this.props.data.allEp[season].value[episode].torrents).map((val, key) => {
              if (val === currentQuality)
                torrent = this.props.data.allEp[season].value[episode].torrents[val]
            })
            if (!torrent) {
              torrent = this.props.data.allEp[season].value[episode].torrents[0]
              let qual = this.props.data.allEp[season].value[episode].torrents[0].resolution
              currentQuality = qual
            }
            if (this.Mounted) this.setState({ currentTorrent: torrent, currentQuality, currSub })
        }
      }
    }
    window.onkeydown = (key) => {
      if (key.keyCode === 32 && key.path[0].localName !== 'input' && key.path[0].localName !== 'textarea') {
        key.preventDefault()
        if (this.Mounted) this._handlePlay()
      }
    }
  }

  GetSubtitles = (props, qual) => {
    let hash = null
    let url = null
    let currQual = this.state.currentQuality
    if (qual) {
      currQual = qual
    }
    if (props.type === 'tv') {
      let currentEp = props.data.allEp[this.state.season].value[this.state.episode].torrents[currQual === '240p' ? '0' : currQual]
      if (!currentEp) {
        if (currQual === '1080p') currentEp = props.data.allEp[this.state.season].value[this.state.episode].torrents['720p']
        if (!currentEp) {
          if (currQual === '720p') currentEp = props.data.allEp[this.state.season].value[this.state.episode].torrents['480p']
        }
        if (!currentEp) {
          if (currQual === '480p') currentEp = props.data.allEp[this.state.season].value[this.state.episode].torrents['0']
        }
      }
      let season = props.data.allEp[this.state.season].value[this.state.episode].season
      let episode = props.data.allEp[this.state.season].value[this.state.episode].episode
      let id = props.data.pop.id
      Meteor.call('get_subtitles', { magnet: currentEp.url, season, episode, qual: currQual, id }, (err, res) => {
        if (this.Mounted) this.setState({ allSub: res })
      })
    } else {
      props.data.torrents.map((val, index) => {
        if (val.quality === currQual) {
          hash = val.hash
          url = val.url
        }
      })
      Meteor.call('get_subtitles', { id: props.data.imdb_code, hash, url }, (err, res) => {
        if (this.Mounted) this.setState({ allSub: res })
      })
    }
  }

  componentDidMount = () => {
    let sub = this.VideoRef.textTracks
    sub.onaddtrack = (ev) => {
      if (this.state.currSub !== 'none') {
        this.VideoRef.textTracks[0].mode = 'showing'
      }
    }
    this.VideoRef.onwaiting = () => {
      if (this.Mounted) this.setState({ waiting: true })
    }
    this.VideoRef.addEventListener('error', (err) => {
      if (this.Mounted && err && this.props.type === 'movie') this.exitPlayer(null, true)
    })
    this.VideoRef.oncanplay = () => {
      if (this.Mounted) {
        if (this.Mounted) this.setState({ waiting: false, ReadyToPlay: true })
        if (!this.state.allSub)
          this.GetSubtitles(this.props)
        if (this.VideoRef.currentTime !== this.state.currentTime)
          this.VideoRef.currentTime = this.state.currentTime
        if (this.state.playing && this.VideoRef.paused)
          if (this.Mounted) this.setState({playing : false})
          // if (this.Mounted) this.VideoRef.play()
      }
    }
    this.intervalUpdate = setInterval(() => {
      if (VideoPromise !== undefined) {
        VideoPromise.then(_ => {
          // Automatic playback started!
          // Show playing UI.
        })
        .catch(error => {
          // Auto-play was prevented
          // Show paused UI.
        });
      }
      if (this.VideoRef && this.VideoRef.duration) {
        if (ErrorTimer) clearTimeout(ErrorTimer)
        if (!this.VideoRef.paused && this.state.waiting)
          if (this.Mounted) this.setState({ waiting: false, ReadyToPlay: true })
        let cur = (100 / this.VideoRef.duration) * this.VideoRef.currentTime
        let fullSec = Math.floor(this.VideoRef.duration % 60)
        let fullMin = Math.floor(((this.VideoRef.duration - fullSec) / 60) % 60)
        let fullHour = Math.floor(((this.VideoRef.duration) / 3600))
        let elSec = Math.floor(this.VideoRef.currentTime % 60)
        let elMin = Math.floor(((this.VideoRef.currentTime - elSec) / 60) % 60)
        let elHour = Math.floor(((this.VideoRef.currentTime) / 3600))
        if (!this.state.ChangingTrack) {
          if (this.Mounted) this.setState({
            trackVal: cur,
            currentTime: this.VideoRef.currentTime,
            fullTime: [fullHour, fullMin, fullSec],
            elapsed: [elHour, elMin, elSec]
          })
        }
      }
    }, 1000);
  };

  ShowControls = (e) => {
    e.preventDefault()
    if (e.target.className === 'Video-Page') {
      if (this.Mounted) this.setState({ showControls: true })
      if (timer)
        clearTimeout(timer)
      timer = setTimeout(() => {
        if (this.Mounted) this.setState({ showControls: false })
      }, 2000);
    }
  }

  _handleEnterControls = (e) => {
    e.preventDefault()
    if (timer)
      clearTimeout(timer)
  }

  goFullscreen = (e, id) => {
    e.preventDefault()
    if (this.state.fullScreen) {
      this.exitFullscreen(e, id)
    } else {
      var element = document.getElementById(id);
      if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
      }
      this.setState({ fullScreen: true, SaveSize: this.state.large, large: true })
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.data !== prevProps.data && this.Mounted) {
      const userId = Meteor.userId()
      if (this.props.type === 'movie' && this.VideoRef) {
        const elapsed = this.VideoRef.currentTime
        const total = this.VideoRef.duration
        const quality = prevState.currentQuality
        const subtitle = prevState.currSub
        const movieId = prevProps.data.id
        const imdb = prevProps.data.imdb_code
        const magnet = 'magnet:?xt=urn:btih:' + prevState.currentTorrent.hash
        Meteor.call('Update_time', { elapsed, total, quality, subtitle, movieId, imdb, userId, data: prevProps.data, magnet })
      } else if (prevProps.type === 'tv' && this.VideoRef) {
        const quality = prevState.currentQuality
        const subtitle = prevState.currSub
        const { season, episode } = prevState
        let nbSeason = prevProps.data.allEp.length - 1
        let nbEp = prevProps.data.allEp[nbSeason].value.length - 1
        const { pop, tvdb, allEp } = prevProps.data
        const { imdbID } = pop
        const tvdbID = tvdb.id
        const torrent = prevState.currentTorrent
        const SeasonNumber = prevProps.data.allEp[season].value[episode].season
        const EpisodeNumber = prevProps.data.allEp[season].value[episode].episode
        Meteor.call('Update_time_TV', { torrent, season, episode, nbSeason, nbEp, quality, subtitle, imdbID, tvdbID, userId, pop, tvdb, allEp, SeasonNumber, EpisodeNumber })
      }
      if (!this.VideoRef.paused)
        this.VideoRef.pause()
      if (this.Mounted) this.setState({
        trackVal: 0,
        currentTorrent: null,
        season: 0,
        episode: 0,
        playing: false,
        currentTime: 0,
        elapsed: [0, 0, 0],
        fullTime: [0, 0, 0],
        large: true,
        allSub: null,
        waiting: true,
        ReadyToPlay: false
      })
      this.componentWillMount()
      this.componentDidMount()
    }
  }

  exitFullscreen = (e, id) => {
    e.preventDefault()
    document.webkitExitFullscreen()
    this.setState({ fullScreen: false, large: this.state.SaveSize })
  }

  _handlePlay = (e) => {
    if (e) {
      e.preventDefault()
    }
    if (!this.state.waiting && this.state.ReadyToPlay && !this.state.restartPlaying) {
      if (this.VideoRef.paused) {
        VideoPromise = this.VideoRef.play()
      } else {
        this.VideoRef.pause()
      }
      this.setState({ playing: !this.VideoRef.paused })
    }
  }

  _handleVolume = (volume) => {
    this.VideoRef.volume = volume
    this.setState({ volume })
  }

  _handleMute = (e) => {
    e.preventDefault()
    this.VideoRef.muted = !this.state.mute
    this.setState({ mute: !this.state.mute })
  }

  _handleTrackChange = (val) => {
    if (this.state.ReadyToPlay) {
      let time = this.VideoRef.duration * (val / 100)
      this.setState({ waiting: true, ChangingTrack: false, currentTime: time })
      this.VideoRef.currentTime = time
    }
  }

  _handleChangingTrack = (val) => {
    if (this.state.ReadyToPlay) {
      let time = this.VideoRef.duration * (val / 100)
      let elSec = Math.floor(time % 60)
      let elMin = Math.floor(((time - elSec) / 60) % 60)
      let elHour = Math.floor(((time) / 3600))
      this.setState({
        trackVal: val,
        elapsed: [elHour, elMin, elSec]
      })
    }
  }

  _handleTrackBack = (e, val) => {
    e.preventDefault()
    if (this.state.ReadyToPlay) {
      let newTime = this.VideoRef.currentTime + val
      if (newTime <= 0) newTime = 0
      if (newTime >= this.VideoRef.duration) newTime = this.VideoRef.duration - 1
      this.setState({ currentTime: newTime })
      this.VideoRef.currentTime = newTime
    }
  }

  ChangeQuality = (quality) => {
    if (quality !== this.state.currentQuality) {
      ErrorTimer = setTimeout(() => {
        this.exitPlayer(null, true)
      }, 60000);
      if (this.props.type === 'movie') {
        let playing = !this.VideoRef.paused
        let elapsed = this.VideoRef.currentTime
        this.props.data.torrents.map((val, index) => {
          if (val.quality === quality)
            this.setState({
              waiting: true,
              currentTorrent: val,
              currentQuality: quality,
              timeForQuality: elapsed,
              ReadyToPlay: false
            })
          this.GetSubtitles(this.props, quality)
        })
      } else {
        let val = this.props.data.allEp[this.state.season].value[this.state.episode].torrents[quality]
        this.setState({
          waiting: true,
          currentTorrent: val,
          currentQuality: quality,
          ReadyToPlay: false
        })
        this.GetSubtitles(this.props, quality)
      }
    }
  }

  ChangeSubtitles = (sub) => {
    this.setState({ currSub: sub })
    if (sub === 'none') this.VideoRef.textTracks[0].mode = 'hidden'
    else this.VideoRef.textTracks[0].mode = 'showing'
  }

  _ChangeEpisode = (e, val) => {
    e.preventDefault()
    ErrorTimer = setTimeout(() => {
      this.exitPlayer(null, true)
    }, 60000);
    let { currentQuality, season, episode } = this.state
    let show = this.props.data.allEp
    if (val === 'back') {
      if (!(season === 0 && episode === 0)) {
        if (episode === 0) {
          season -= 1
          episode = show[season].value.length - 1
        } else {
          episode -= 1
        }
        let curr = show[season].value[episode].torrents[currentQuality]
        if (!curr) {
          curr = show[season].value[episode].torrents[0]
          currentQuality = show[season].value[episode].torrents[0].resolution
        }
        this.VideoRef.currentTime = 0
        this.setState({ episode, season, currentQuality, currentTorrent: curr, waiting: true, ReadyToPlay: false, allSub: null })
      }
    } else {
      if (episode < show[season].value.length - 1) {
        episode += 1
        let curr = show[season].value[episode].torrents[currentQuality]
        if (!curr) {
          curr = show[season].value[episode].torrents[0]
          currentQuality = show[season].value[episode].torrents[0].resolution
        }
        this.setState({ episode, currentQuality, currentTorrent: curr, waiting: true, ReadyToPlay: false, allSub: null })
      } else if (season < show.length - 1) {
        episode = 0
        season += 1
        let curr = show[season].value[episode].torrents[currentQuality]
        if (!curr) {
          curr = show[season].value[episode].torrents[0]
          currentQuality = show[season].value[episode].torrents[0].resolution
        }
        this.setState({ episode, season, currentQuality, currentTorrent: curr, waiting: true, ReadyToPlay: false, allSub: null })
      }

    }
  }

  ChangePath = (e, path) => {
    e.preventDefault()
    if (this.props.browserHistory.location.pathname !== path) {
      this.props.browserHistory.push(path)
    }
    this.setState({ large: false })
  }

  exitPlayer = (e, res) => {
    if (e) e.preventDefault()
    clearInterval(this.intervalUpdate)
    if (ErrorTimer) clearTimeout(ErrorTimer)
    this.props.exit(res)
  }

  NoResume = (e) => {
    e.preventDefault()
    this.VideoRef.currentTime = 0
    if (this.props.type === 'movie') {
      this.setState({ restartPlaying: false, currentTime: 0, ReadyToPlay: true, playing: true })
      VideoPromise = this.VideoRef.play()
    }
    else {
      let show = this.props.data.allEp
      let { currentQuality } = this.state
      let curr = show[0].value[0].torrents[currentQuality]
      if (!curr) {
        curr = show[0].value[0].torrents[0]
        currentQuality = show[0].value[0].torrents[0].resolution
      }
      this.setState({ restartPlaying: false, episode: 0, season: 0, currentQuality, currentTorrent: curr, waiting: true, ReadyToPlay: false, allSub: null })
    }
  }

  ResumeMovie = (e) => {
    e.preventDefault()
    this.setState({ restartPlaying: false, ReadyToPlay: true, playing: true })
    VideoPromise = this.VideoRef.play()
  }

  render() {
    let { currentQuality, season, episode, restartPlaying } = this.state
    let show = this.props.data.allEp
    if (this.state.currSub !== 'none' && this.VideoRef.textTracks.length > 0 && this.VideoRef.textTracks[0].mode === 'hidden') {
      this.VideoRef.textTracks[0].mode = 'showing'
    }
    const link = (this.state.allSub && this.state.currSub && SubtitlesFiles.findOne({ _id: this.state.allSub[this.state.currSub] }) && SubtitlesFiles.findOne({ _id: this.state.allSub[this.state.currSub] }).link()) || ''
    return (
      <div id='player' className={this.state.large ? 'Video-Page' : 'Video-Page small-video'} onMouseMove={this.ShowControls} >
        {this.state.waiting &&
          <div style={{ position: 'absolute', top: 0, left: 0, display: 'flex', justifyContent: 'center', width: '100%', height: '100%', alignItems: 'center' }} onMouseEnter={e => { e.preventDefault(); this.setState({ chevronShow: true }) }}>
            <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
          </div>
        }
        {!this.state.waiting && !this.state.playing && this.state.large ?
          <div style={{ position: 'absolute', top: 0, left: 0, display: 'flex', justifyContent: 'center', width: '100%', height: '100%', alignItems: 'center' }}>
            <Button onClick={this._handlePlay} color='transparent' className="max-play-btn">
              <i className="fas fa-play" style={{ marginLeft: '-3px' }}></i>
            </Button>
          </div> : ''
        }
        {!this.state.large ?
          <div style={{ position: 'absolute', top: 0, left: 0, display: 'flex', justifyContent: 'center', width: '100%', height: '100%', alignItems: 'center' }} >
            <Button onClick={e => { e.preventDefault(); this.setState({ large: !this.state.large }) }} color='transparent' className="button-container" style={this.state.chevronShow ? { zIndex: 5, display: 'block' } : { display: 'none' }} onMouseEnter={e => { e.preventDefault(); this.setState({ chevronShow: true }) }}>
              <i className="fas fa-chevron-up"></i>
            </Button>
          </div>
          : ''
        }
        {this.props.type === 'movie' ?
          <video onDoubleClick={e => { this.goFullscreen(e, 'player') }} onClick={this._handlePlay} src={"/stream/" + this.state.currentTorrent.hash} ref={ref => this.VideoRef = ref} controls={false} className={this.state.large ? 'Video-Page' : 'Video-Page small-video'} preload="auto" onMouseEnter={e => { e.preventDefault(); this.setState({ chevronShow: true }) }} onMouseLeave={e => { e.preventDefault(); this.setState({ chevronShow: false }) }}>
            {this.state.allSub ?
              <track
                src={link}
                kind="subtitles"
                srcLang={this.state.currSub}
                label={this.state.currSub === 'fr' ? 'French' : 'English'}
              /> : ''
            }
          </video>
          : <video onDoubleClick={e => { this.goFullscreen(e, 'player') }} onClick={this._handlePlay} src={this.state.currentTorrent ? "/stream/" + this.state.currentTorrent.url + '/' + this.state.currentQuality : ''} ref={ref => this.VideoRef = ref} controls={false} className={this.state.large ? 'Video-Page' : 'Video-Page small-video'} preload="auto" onMouseEnter={e => { e.preventDefault(); this.setState({ chevronShow: true }) }} onMouseLeave={e => { e.preventDefault(); this.setState({ chevronShow: false }) }}>
            {this.state.allSub ?
              <track
                src={link}
                kind="subtitles"
                srcLang={this.state.currSub}
                label={this.state.currSub === 'fr' ? 'French' : 'English'}
              /> : ''
            }
          </video>
        }
        <div onMouseEnter={this._handleEnterControls} onMouseMove={this._handleEnterControls} className={(this.state.showControls || this.state.waiting || !this.state.playing || this.state.activeSettings) && this.state.large ? "controls-container-top controls-show-top " : "controls-container-top"} style={{ position: "fixed", top: 0, left: 0, zIndex: 500 }}>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={e => { e.preventDefault(); if (this.state.fullScreen) { this.exitFullscreen(e, 'player') } this.setState({ large: !this.state.large }) }} color='transparent' className="button-container" style={{ alignSelf: 'flex-start' }}>
              <i className="fas fa-chevron-down"></i>
            </Button>
            {this.props.type === 'movie' ?
              <div className='Player-Title-Show'>
                <span className='Player-Title-Span' onClick={e => this.ChangePath(e, `/Movie/${this.props.data.id}`)}>{this.props.data.title_long}</span>
                {/* <span>{`Season ${show[season].nb} Episode ${show[season].value[episode].episode} - ${show[season].value[episode].title}`}</span> */}
              </div>
              :
              <div className='Player-Title-Show'>
                <span className='Player-Title-Span' onClick={e => this.ChangePath(e, `/Tv/${this.props.data.pop.imdbID}/${this.props.data.tvdb.id}`)}>{this.props.data.tvdb.name}</span>
                <span>{`Season ${show[season].nb} Episode ${show[season].value[episode].episode} - ${show[season].value[episode].title}`}</span>
              </div>
            }
            {!this.state.fullScreen ?
              <Button onClick={e => this.goFullscreen(e, 'player')} color='transparent' className="button-container">
                <i className="fas fa-expand"></i>
              </Button> :
              <Button onClick={e => this.exitFullscreen(e, 'player')} color='transparent' className="button-container">
                <i className="fas fa-compress"></i>
              </Button>
            }
          </div>
        </div>
        {this.state.activeSettings &&
          <div className='menu-player-container' style={!this.state.large ? { position: 'fixed', marginLeft: '240px', width: '-webkit-fill-available' } : {}}>
            <div className='menu-player-title'>Video settings</div>
            <div style={{ padding: '0 20px', width: '100%' }}>
              <div className='menu-player-line'>
                <div className='menu-player-line-left'>quality</div>
                <div className='menu-player-line-right'>
                  {this.props.type === 'movie' ?
                    <DropMenu data={this.props.data.torrents} current={this.state.currentQuality} changeQual={this.ChangeQuality} />
                    : <DropMenuTv data={this.props.data.allEp[this.state.season].value[this.state.episode].torrents} current={this.state.currentQuality} changeQual={this.ChangeQuality} />
                  }
                </div>
              </div>
              {this.state.allSub &&
                <div className='menu-player-line'>
                  <div className='menu-player-line-left'>subtitles</div>
                  <div className='menu-player-line-right'>
                    <DropMenuSub data={this.state.allSub} current={this.state.currSub} changeSub={this.ChangeSubtitles} />
                  </div>
                </div>
              }
            </div>
          </div>
        }
        <div onMouseEnter={this._handleEnterControls} onMouseMove={this._handleEnterControls} className={this.state.showControls || !this.state.large || this.state.waiting || !this.state.playing || this.state.activeSettings ? "controls-container controls-show" : "controls-container"} style={!this.state.large ? { marginLeft: '240px', width: '-webkit-fill-available' } : {}} >
          <div onMouseEnter={e => { e.preventDefault(); if (this.props.type === 'movie') this.setState({ trackColor: 'rgba(30,31,32,.8)', activeTracker: true }) }} onMouseLeave={e => { e.preventDefault(); this.setState({ trackColor: 'transparent', activeTracker: false }) }}>
            <Slider
              onBeforeChange={e => { this.setState({ ChangingTrack: true }) }}
              onChange={val => this._handleChangingTrack(val)}
              onAfterChange={val => this._handleTrackChange(val)}
              disabled={this.props.type === 'tv' ? true : false}
              handleStyle={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: '#ddd',
                borderColor: 'none',
                boxShadow: '0 0 2px rgba(0,0,0,.35)',
                cursor: 'pointer',
                display: this.state.activeTracker || this.state.ChangingTrack ? 'block' : 'none',
              }}
              step={0.01} style={{ position: 'absolute', top: this.state.activeTracker ? '-9px' : '-7px', left: 0, cursor: 'pointer' }} trackStyle={{ height: this.state.activeTracker ? '4px' : '2px', backgroundColor: '#cc7b19', cursor: 'pointer' }} railStyle={{ backgroundColor: this.state.trackColor, cursor: 'pointer' }} min={0} max={100} value={this.state.trackVal} />
          </div>
          <div className='ControlsCont'>
            <div style={{ fontFamily: 'monospace' }}>
              <span>{this.state.elapsed[0] > 0 ? this.state.elapsed[0] + ':' : ''}{this.state.elapsed[1] > 0 ? (this.state.elapsed[1] < 10 ? '0' : '') + this.state.elapsed[1] + ':' : '0:'}{this.state.elapsed[2] > 0 ? (this.state.elapsed[2] < 10 ? '0' : '') + this.state.elapsed[2] : '00'}</span>
              <span>{' / '}</span>
              <span>{this.state.fullTime[0] > 0 ? this.state.fullTime[0] + ':' : ''}{this.state.fullTime[1] > 0 ? (this.state.fullTime[1] < 10 ? '0' : '') + this.state.fullTime[1] + ':' : '00:'}{this.state.fullTime[2] > 0 ? this.state.fullTime[2] : '00'}</span>
            </div>
          </div>
          <div className='ControlsCont'>
            {this.props.type === 'movie' ?
              <Button disabled={!this.state.ReadyToPlay} onClick={e => this._handleTrackBack(e, -10)} color='transparent' className="button-container">
                <i className="fas fa-undo-alt"><span style={{ position: 'absolute', left: '2px', fontSize: '10px', top: '13px' }}>10</span></i>
              </Button> :
              <Button disabled={!this.state.ReadyToPlay || (this.state.season === 0 && this.state.episode === 0)} onClick={e => this._ChangeEpisode(e, 'back')} color='transparent' className="button-container">
                <i className="fas fa-backward"></i>
              </Button>
            }

            {!this.state.playing || this.state.waiting ?
              <Button disabled={!this.state.ReadyToPlay} onClick={this._handlePlay} color='transparent' className="button-container">
                <i className="fas fa-play"></i>
              </Button> :
              <Button disabled={!this.state.ReadyToPlay} onClick={this._handlePlay} color='transparent' className="button-container">
                <i className="fas fa-pause"></i>
              </Button>
            }
            {this.props.type === 'movie' ?
              <Button disabled={!this.state.ReadyToPlay} onClick={e => this._handleTrackBack(e, 30)} color='transparent' className="button-container">
                <i className="fas fa-redo-alt"><span style={{ position: 'absolute', right: '2px', fontSize: '10px', top: '13px' }}>30</span></i>
              </Button> :
              <Button disabled={!this.state.ReadyToPlay || (episode === show[season].value.length - 1 && season === show.length - 1)} onClick={e => this._ChangeEpisode(e, 'next')} color='transparent' className="button-container">
                <i className="fas fa-forward"></i>
              </Button>
            }
          </div>
          <div className='ControlsCont ControlsCont2'>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <button onClick={e => { e.preventDefault(); this.setState({ activeSettings: !this.state.activeSettings }) }} style={this.state.activeSettings ? { color: '#cc7b19' } : {}} className='button-nostyle'>
                <i className="fas fa-sliders-h"></i>
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Button onClick={this._handleMute} color='transparent' className="button-container">
                {this.state.mute || this.state.volume === 0 ?
                  <i className="fas fa-volume-off"></i>
                  :
                  <i className={this.state.volume >= 0.5 ? "fas fa-volume-up" : "fas fa-volume-down"}></i>
                }
              </Button>
              <div style={{ cursor: 'pointer' }} onMouseEnter={e => { e.preventDefault(); this.setState({ activeVolume: true }) }} onMouseLeave={e => { e.preventDefault(); this.setState({ activeVolume: false }) }}>
                <Slider
                  onBeforeChange={e => { this.setState({ mute: false, ChangingVol: true }) }}
                  onChange={val => this._handleVolume(val)}
                  onAfterChange={val => this.setState({ ChangingVol: false })}
                  handleStyle={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: '#ddd',
                    borderColor: 'none',
                    boxShadow: '0 0 2px rgba(0,0,0,.35)',
                    display: this.state.activeVolume || this.state.ChangingVol ? 'block' : 'none',
                    cursor: 'pointer'
                  }}
                  style={{ width: '120px' }} trackStyle={{ height: '2px', backgroundColor: '#cc7b19', cursor: 'pointer' }} railStyle={{ backgroundColor: 'black', cursor: 'pointer', height: '2px' }} min={0} max={1} step={0.01} value={this.state.mute ? 0 : this.state.volume} />
              </div>
              <Button onClick={e => this.exitPlayer(e)} color='transparent' className="button-container">
                <i className="far fa-times-circle"></i>
              </Button>
            </div>
          </div>
        </div>
        {restartPlaying && this.props.type === 'movie' &&
          <div className='Player-Restart'>
            <div className='Player-Restart-Container'>
              <div className='Player-Restart-Content'>
                <button type='button' role='button' className='Player-Restart-Close' onClick={e => this.NoResume(e)} ><i className="fas fa-times"></i></button>
                <div className='Player-Restart-Head'>Resume Playback</div>
                <div className='Player-Restart-Body'>
                  <div className='Player-Restart-Body-List'>
                    <button type='button' role='button' className='Player-Restart-Btn-Resume' onClick={e => this.ResumeMovie(e)}>{`Resume from ${restartPlaying.time.elapsed[0]}:${(restartPlaying.time.elapsed[1] < 10 ? '0' : '') + restartPlaying.time.elapsed[1]}:${(restartPlaying.time.elapsed[2] < 10 ? '0' : '') + restartPlaying.time.elapsed[2]} -- ${restartPlaying.time.rest[0] > 0 ? restartPlaying.time.rest[0] + 'Hrs  ' : ''}${(restartPlaying.time.rest[1] < 10 ? '0' : '') + restartPlaying.time.rest[1]}mins  ${(restartPlaying.time.rest[2] < 10 ? '0' : '') + restartPlaying.time.rest[2]}sec  left`}</button>
                    <button type='button' role='button' className='Player-Restart-Btn-Resume' onClick={e => this.NoResume(e)} >Start from the Begining</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        {restartPlaying && this.props.type === 'tv' &&
          <div className='Player-Restart'>
            <div className='Player-Restart-Container'>
              <div className='Player-Restart-Content'>
                <button type='button' role='button' className='Player-Restart-Close' onClick={e => this.NoResume(e)} ><i className="fas fa-times"></i></button>
                <div className='Player-Restart-Head'>Resume Playback</div>
                <div className='Player-Restart-Body'>
                  <div className='Player-Restart-Body-List'>
                    <button type='button' role='button' className='Player-Restart-Btn-Resume' onClick={e => this.ResumeMovie(e)}>{`Resume from Season ${restartPlaying.SeasonNumber} Episode ${restartPlaying.EpisodeNumber}`}</button>
                    <button type='button' role='button' className='Player-Restart-Btn-Resume' onClick={e => this.NoResume(e)} >Start from the Begining</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}
//https://blog.teamtreehouse.com/building-custom-controls-for-html5-videos
