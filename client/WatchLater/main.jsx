import React, { Component } from 'react'
import CardMovie from '../Search/cardMovie.jsx'
import CardTvshow from '../Search/cardSerie.jsx'
import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import { WatchDb } from '/common/Collections/Movie.jsx'
import { WatchLaterTv } from '/common/Collections/Tv.jsx'

class WatchLater extends Component {
  render () {
    const { allMovies, allTv } = this.props
    return (
      <div>
        <div className='Index-Movie-Resume-Container'>
          <div className='Index-Movie-Resume-Title-container'><span className='Index-Movie-Resume-Title'>Movies to watch later</span></div>
          <ul className='Index-Movie-Resume-Cards'>
            {!!allMovies && !!allMovies.length
              ? allMovies.map((val, key) => (
                <CardMovie display={this.props.display} key={key} data={val.data} history={this.props.history} />
              ))
              : <div>No movies to watch later</div>
            }
          </ul>
        </div>
        <div className='Index-Movie-Resume-Container'>
          <div className='Index-Movie-Resume-Title-container'><span className='Index-Movie-Resume-Title'>Tv Shows to watch later</span></div>
          <ul className='Index-Movie-Resume-Cards'>
            {!!allTv && !!allTv.length
              ? allTv.map((data, key) => (
                <CardTvshow display={this.props.display} key={key} data={data.data} history={this.props.history} />
              ))
              : <div>No TV Shows to watch later</div>
            }
          </ul>
        </div>
      </div>
    )
  }
}

export default withTracker(props => {
  let userId = Meteor.userId()
  return {
    MovieReady: Meteor.subscribe('Get_all_WatchLater', { userId }).ready(),
    allMovies: WatchDb.find({ userId }).fetch() || false,
    TvReady: Meteor.subscribe('Get_all_WatchLater_Tv', { userId }).ready(),
    allTv: WatchLaterTv.find({ userId }).fetch() || false
  }
})(WatchLater)
