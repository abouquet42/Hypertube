import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { View, Mask } from 'mdbreact';
// import "font-awesome/css/font-awesome.min.css"
// import "bootstrap-css-only/css/bootstrap.min.css"
// import "mdbreact/dist/css/mdb.css"

// Task component - represents a single todo item
export default class CardResume extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      elapsed: [0,0,0]
    }
    this.infosMovie = this.infosMovie.bind(this)
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

  playMovie = (e, hash, data) => {
    e.preventDefault()
    e.stopPropagation()
    this.props.display(e, data, 'movie')
  }

  infosMovie = (e, id) => {
    this.props.history.push(`/Movie/${id}`)
  }

  componentDidMount() {
    let elapsed = this.props.time
    let elSec = Math.floor(elapsed % 60)
    let elMin = Math.floor(((elapsed - elSec) / 60) % 60)
    let elHour = Math.floor(((elapsed) / 3600))
    if (elMin < 10) elMin = '0' + elMin
    if (elSec < 10) elSec = '0' + elSec
    this.setState({elapsed: [elHour, elMin, elSec]})
  }
  

  render() {
    var {hover, elapsed} = this.state
    return (
      <li className='Movie-Resume-li'>
        <View style={{cursor: 'pointer'}} className={this.state.hover ? 'Movie-Resume-hover' : ''} onMouseEnter={this.onMouseEnterHandler} onMouseLeave={this.onMouseLeaveHandler} onClick={e => this.infosMovie(e, this.props.data.id)}>
          <img src={this.props.screenShot} className="img-fluid" alt="" style={{cursor: 'pointer'}}/>
          {hover ?
          <Mask className="Movie-Resume-mask" overlay="stylish-strong" title='View details'>
            <i className="far fa-play-circle fa-5x cardPlayButton" onClick={e => this.playMovie(e, this.props.data.torrents[1].hash, this.props.data)} title='View movie'></i>
            <p className="font-weight-bold yellow-text" style={{fontSize:'25px', position: 'absolute', bottom: '-13px', left: '10px'}}>{this.props.data.rating}/10 ★</p>
            <p className="font-weight-bold white-text" style={{fontSize:'22px', position: 'absolute', bottom: '-13px', right: '10px'}}> {this.props.data.year}</p>
          </Mask>
          : ''
          }
        </View>
        <div className='Movie-Resume-Title' >
          <p className="font-weight-bold white-text Movie-Resume-text" >{`${this.props.data.title_english} - ${elapsed[0] > 0 ? elapsed[0] + ':' : ''}${elapsed[1]}:${elapsed[2]}`}</p>
        </div>
      </li>
    );
  }
}
