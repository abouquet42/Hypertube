import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { View, Mask } from 'mdbreact';
import "font-awesome/css/font-awesome.min.css"
import "bootstrap-css-only/css/bootstrap.min.css"
import "mdbreact/dist/css/mdb.css"

// Task component - represents a single todo item
export default class CardTvshow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      watchLater: false
    }
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

  playMovie = (e, data, id, idtvdb) => {
    e.preventDefault()
    e.stopPropagation()
    Meteor.call('save_TvShow', { id, idtvdb, data })
    this.props.display(e, data, 'tv')
  }

  infosTvshow = (e, id, idtvdb) => {
    let { data } = this.props
    Meteor.call('save_TvShow', { id, idtvdb, data })
    this.props.history.push(`/Tv/${id}/${idtvdb}`)
  }

  _HandleWatchLater = (e, data) => {
    e.preventDefault()
    e.stopPropagation()
    this.setState({ watchLater: !this.state.watchLater })
    let userId = Meteor.userId()
    const { imdbID } = data.pop
    const tvdbID = data.tvdb.id
    if (!this.state.watchLater)
      Meteor.call('Set_WatchLater_Tv', { userId, imdbID, tvdbID, data })
    else Meteor.call('Unset_WatchLater_Tv', { userId, imdbID, tvdbID })
  }

  componentWillMount = () => {
    let userId = Meteor.userId()
    let tvdbID = this.props.data.tvdb.id
    let { imdbID } = this.props.data.pop
    Meteor.call('Get_WatchLater_Tv', { userId, tvdbID, imdbID }, (err, result) => {
      if (!err) {
        this.setState({ watchLater: result })
      }
    })
  }

  render() {
    var { hover, watchLater } = this.state
    if (this.props.data.pop.images.poster.indexOf('walter') !== -1) this.props.data.pop.images.poster = 'https://media.istockphoto.com/photos/35mm-movie-film-with-metal-reels-picture-id475113128?k=6&m=475113128&s=612x612&w=0&h=gtzstjbNbQ2l63RdKmJXvlVs3-dsiTFEJVmovrkAwZY='
    this.props.data.pop.title = this.props.data.pop.title.replace(/&amp;/g, '&')
    return (
      <li className='movie testClassMovie'>
        <View style={{ cursor: 'pointer' }} className={this.state.hover ? 'Movie-Resume-hover-full' : ''} onMouseEnter={this.onMouseEnterHandler} onMouseLeave={this.onMouseLeaveHandler} onClick={e => this.infosTvshow(e, this.props.data.pop.id, this.props.data.tvdb.id)}>
          {this.props.data.pop.images ?
            <img src={this.props.data.pop.images.poster.replace('http://', 'https://')} className="img-fluid" alt="" style={{ cursor: 'pointer', width: '230px', height: '345px' }} />
            : ''}
          {hover ?
            <Mask className="test" overlay="stylish-strong" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
              <i className="far fa-play-circle fa-5x cardPlayButton" onClick={e => this.playMovie(e, this.props.data, this.props.data.pop.id, this.props.data.tvdb.id)} title='View movie'></i>
              <p className="font-weight-bold yellow-text" style={{ fontSize: '25px', position: 'absolute', bottom: '15px' }}>{this.props.data.pop.rating.percentage} %</p>
              <p className="font-weight-bold white-text" style={{ fontSize: '22px', position: 'absolute', bottom: '-13px' }}> {this.props.data.pop.year}</p>
              <i className="far fa-clock WatchLater-Icon" style={watchLater ? { color: '#cc7b19' } : {}} onClick={e => this._HandleWatchLater(e, this.props.data)}></i>
            </Mask>
            : ''
          }
        </View>
        <div className='Movie-Resume-Title'>
          <p className="font-weight-bold white-text Movie-Resume-text">{this.props.data.pop.title}</p>
          {!!this.props.seen &&
            <p className="font-weight-bold white-text Movie-Resume-text">{this.props.seen}</p>
          }
        </div>
      </li>
    );
  }
}
