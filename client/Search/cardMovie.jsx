import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { View, Mask } from 'mdbreact';
// import "font-awesome/css/font-awesome.min.css"
// import "bootstrap-css-only/css/bootstrap.min.css"
// import "mdbreact/dist/css/mdb.css"

// Task component - represents a single todo item
export default class CardMovie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      watchLater: false
    }
    this.infosMovie = this.infosMovie.bind(this)
    this.Mounted = false
  }
  onMouseEnterHandler = (e) => {
    if (this.Mounted) this.setState({
        hover: true
    })
  }
  onMouseLeaveHandler = (e) => {
    if (this.Mounted) this.setState({
        hover: false
    })
  }

  playMovie = (e, data) => {
    e.preventDefault()
    e.stopPropagation()
    this.props.display(e, data, 'movie')
  }

  infosMovie = (e, id) => {
    this.props.history.push(`/Movie/${id}`)
  }

  _HandleWatchLater = (e, data) => {
    e.preventDefault()
    e.stopPropagation()
    if (this.Mounted) this.setState({watchLater: !this.state.watchLater})
    let userId = Meteor.userId()
    let movieId = data.id
    let imdb = data.imdb_code
    if (!this.state.watchLater)
      Meteor.call('Set_WatchLater', {userId, movieId, imdb, data})
    else Meteor.call('Unset_WatchLater', {userId, movieId, imdb})
  }

  componentWillMount = () => {
    this.Mounted = true
    let userId = Meteor.userId()
    let movieId = this.props.data.id
    let imdb = this.props.data.imdb_code
    Meteor.call('Get_WatchLater', {userId, movieId, imdb}, (err, result) => {
      if (!err) {
        if (this.Mounted) this.setState({watchLater: result})
      }
    })
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.data !== this.props.data) {
      let userId = Meteor.userId()
      let movieId = this.props.data.id
      let imdb = this.props.data.imdb_code
      Meteor.call('Get_WatchLater', {userId, movieId, imdb}, (err, result) => {
        if (!err) {
          if (this.Mounted) this.setState({watchLater: result})
        }
      })
    }
  }
  
  componentWillUnmount = () => {
    this.Mounted = false
  };
  

  render() {
    var {hover, watchLater} = this.state
    return (
      <li className='movie testClassMovie'>
        <View style={{cursor: 'pointer'}} className={this.state.hover ? 'Movie-Resume-hover-full' : ''} onMouseEnter={this.onMouseEnterHandler} onMouseLeave={this.onMouseLeaveHandler} onClick={e => this.infosMovie(e, this.props.data.id)}>
          <img src={this.props.data.medium_cover_image} className="img-fluid" alt="" style={{cursor: 'pointer', maxWidth: '230px'}}/>
          {hover ?
          <Mask className="test" overlay="stylish-strong" style={{display: 'flex', flexDirection:'column', justifyContent:'center', alignItems: 'center', cursor: 'pointer'}} title='View details'>
            <i className="far fa-play-circle fa-5x cardPlayButton" onClick={e => this.playMovie(e, this.props.data)} title='View movie'></i>
            <p className="font-weight-bold yellow-text" style={{fontSize:'25px', position: 'absolute', bottom: '15px'}}>{this.props.data.rating}/10 ★</p>
            <p className="font-weight-bold white-text" style={{fontSize:'22px', position: 'absolute', bottom: '-13px'}}> {this.props.data.year}</p>
            <i className="far fa-clock WatchLater-Icon" style={watchLater ? {color: '#cc7b19'} : {}} onClick={e => this._HandleWatchLater(e, this.props.data)}></i>
          </Mask>
          : ''
          }
        </View>
        <div className='Movie-Resume-Title'>
          <p className="font-weight-bold white-text Movie-Resume-text">{this.props.data.title_english}</p>
        </div>
      </li>
    );
  }
}
