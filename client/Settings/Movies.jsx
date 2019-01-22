import React, { Component } from 'react'
import CardMovie from '../Search/cardMovie.jsx'
// import CardResumeTv from './CardResumeTv.jsx'
import { MovieWatch } from '/common/Collections/Movie.jsx'
// import { TvWatch } from '/common/Collections/Tv.jsx'
import { withTracker } from 'meteor/react-meteor-data'
// import Slider from "react-slick"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

class ProfileMovies extends Component {

  render() {
    const { MovieReady, MovieWatched } = this.props
    if (MovieReady) {
      return (
        <div style={{ marginTop: '2rem' }}>
          <div className='Index-Movie-Resume-Container'>
            <div className='Index-Movie-Resume-Title-container Title-recom'>
              <span className='Index-Movie-Resume-Title'>{this.props.page === 'prof' ? `Movies ${this.props.name} has seen` : "Movies you've seen"}</span>
            </div>
            <ul className='Index-Movie-Resume-Cards'>
              {!!MovieWatched && MovieWatched.map((val, key) => (
                <CardMovie screenShot={val.screenshot} time={val.elapsed} display={this.props.display} key={val.data.id} data={val.data} history={this.props.history} />
              ))}
            </ul>
          </div>
        </div>
      )
    } else {
      return (<div></div>)
    }
  }
}
//https://github.com/akiran/react-slick

export default withTracker(props => {
  let userId = Meteor.userId()
  if (props.page === 'prof')
    userId = props.location.pathname.split('/')[2]
  return {
    MovieReady: Meteor.subscribe('Get_all_Avancement', { userId }).ready(),
    MovieWatched: MovieWatch.find({ userId, finished: true }).fetch() || false
  }
})(ProfileMovies)
