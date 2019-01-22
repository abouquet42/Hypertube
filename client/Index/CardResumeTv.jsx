import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { View, Mask } from 'mdbreact';
import "font-awesome/css/font-awesome.min.css"
import "bootstrap-css-only/css/bootstrap.min.css"
import "mdbreact/dist/css/mdb.css"

// Task component - represents a single todo item
export default class CardResumeTv extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false
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

  playMovie = (e, data) => {
    e.preventDefault()
    e.stopPropagation()
    this.props.display(e, data, 'tv')
  }

  infosTvshow = (e, id, idtvdb) => {
    this.props.history.push(`/Tv/${id}/${idtvdb}`)
  }

  render() {
    var { hover } = this.state
    this.props.data.pop.title = this.props.data.pop.title.replace(/&amp;/g, '&')
    let { current } = this.props
    return (
      <li className='Movie-Resume-li'>
        <View style={{ cursor: 'pointer' }} className={this.state.hover ? 'Movie-Resume-hover' : ''} onMouseEnter={this.onMouseEnterHandler} onMouseLeave={this.onMouseLeaveHandler} onClick={e => this.infosTvshow(e, this.props.data.pop.id, this.props.data.tvdb.id)}>
          <img src={this.props.image} className="img-fluid" alt="" style={{ cursor: 'pointer' }} />
          {hover ?
            <Mask className="Movie-Resume-mask" overlay="stylish-strong" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }} title='View details'>
              <i className="far fa-play-circle fa-5x cardPlayButton" onClick={e => this.playMovie(e, this.props.data)} title='View movie'></i>
              <p className="font-weight-bold yellow-text" style={{ fontSize: '25px', position: 'absolute', bottom: '15px' }}>{this.props.data.pop.rating.percentage} %</p>
              <p className="font-weight-bold white-text" style={{ fontSize: '22px', position: 'absolute', bottom: '-13px' }}> {this.props.data.pop.year}</p>
            </Mask>
            : ''
          }
        </View>
        <div className='Movie-Resume-Title' >
          <p className="font-weight-bold white-text Movie-Resume-text" >{`${this.props.data.pop.title} - S${(current.season < 10 ? '0' : '') + current.season}E${(current.episode < 10 ? '0' : '') + current.episode}`}</p>
        </div>
      </li>
    )
  }
}
