import React, { Component } from 'react'
import CardTvshow from '../Search/cardSerie.jsx'
import { TvWatch } from '/common/Collections/Tv.jsx'
import { withTracker } from 'meteor/react-meteor-data'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

class ProfileTv extends Component {
  constructor(props) {
    super(props)
    this.state = {
      TvWatched: null
    }
    this.slider = null
    this.sliderTv = null
  };

  nextStep = (e) => {
    e.preventDefault()
    this.slider.slickNext()
  }

  prevStep = (e) => {
    e.preventDefault()
    this.slider.slickPrev()
  }

  nextStepTV = (e) => {
    e.preventDefault()
    this.sliderTv.slickNext()
  }

  prevStepTV = (e) => {
    e.preventDefault()
    this.sliderTv.slickPrev()
  }

  render() {
    const { TvReady, TvWatched } = this.props
    if (TvReady) {
      return (
        <div style={{ marginTop: '2rem' }}>
          <div className='Index-Movie-Resume-Container'>
            <div className='Index-Movie-Resume-Title-container Title-recom'>
              <span className='Index-Movie-Resume-Title'>{this.props.page === 'prof' ? `Tv Shows ${this.props.name} is watching` : "Tv Shows you're watching"}</span>
            </div>
            <ul className='Index-Movie-Resume-Cards'>
              {!!TvWatched && TvWatched.map((val, key) => (
                <CardTvshow image={val.image} seen={`seen: ${val.episodeSeen}/${val.totalEpisode}`} current={{ season: val.SeasonNumber, episode: val.EpisodeNumber }} display={this.props.display} key={key} data={{ pop: val.pop, tvdb: val.tvdb, allEp: val.allEp }} history={this.props.history} />
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
    TvReady: Meteor.subscribe('Get_all_Avancement_Tv', { userId }).ready(),
    TvWatched: TvWatch.find({ userId, episodeSeen: {$gt: 0}}).fetch() || false
  }
})(ProfileTv)
