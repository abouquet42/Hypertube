import React, { Component } from 'react'
import CardResume from './CardResume.jsx'
import CardResumeTv from './CardResumeTv.jsx'
import { MovieWatch } from '/common/Collections/Movie.jsx'
import { TvWatch } from '/common/Collections/Tv.jsx'
import { withTracker } from 'meteor/react-meteor-data'
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import CardMovie from '../Search/cardMovie.jsx'
import CardTvshow from '../Search/cardSerie.jsx'
const TvApi = 'a1df6b4f23ae0441f2e186ad1a1c2db6'

class IndexPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      newMovies: null,
      newTvs: null
    }
    this.slider = []
    this.Mounted = false
  };

  nextStep = (e, val) => {
    e.preventDefault()
    this.slider[val].slickNext()
  }

  prevStep = (e, val) => {
    e.preventDefault()
    this.slider[val].slickPrev()
  }

  componentWillUnmount() {
    this.Mounted = false
  }
  

  componentDidMount = () => {
    this.Mounted = true
    let params = {
      dateMax: "",
      dateMin: "",
      genre: "",
      limit: 20,
      minimum_rating: "",
      order_by: "desc",
      page: 1,
      query_term: "",
      sort_by: "date_added"
    }
    let self = this
    Meteor.call('get_yts', { params }, (err, result) => {
      if (result) {
        if (result.data.movie_count > 0) {
          if (self.Mounted) {
            self.setState({
              newMovies: result.data.movies,
            })
          }
        }
      }
    })
    params = {
      api_key: TvApi,
      language: 'en-US'
    }
    let dataMem = []
    Meteor.call('get_tmdb_popu', { type: 'latest', params, page: 1, dataMem, scroll: 0 }, (err, result) => {
      if (result) {
        if (result.res.length > 0) {
          if (self.Mounted) {
            self.setState({
              newTvs: result.res,
            })
          }
        }
      }
    })
  };
  

  render() {
    var settings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 4,
      responsive: [
        {
          breakpoint: 2000,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            // infinite: false,
            dots: false
          }
        },
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            // infinite: false,
            dots: false
          }
        },
        {
          breakpoint: 800,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            initialSlide: 1
          }
        }
      ]
    }
    var settings2 = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 5,
      slidesToScroll: 5,
      responsive: [
        {
          breakpoint: 2000,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 4,
            // infinite: false,
            dots: false
          }
        },
        {
          breakpoint: 1600,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            // infinite: false,
            dots: false
          }
        },
        {
          breakpoint: 1000,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 1
          }
        }
      ]
    }
    const { MovieReady, MovieWatched, TvWatched } = this.props
    let { newMovies, newTvs } = this.state
    if (MovieReady) {
      return (
        <div>
          {!!MovieWatched && MovieWatched.length > 0 &&
            <div className='Index-Movie-Resume-Container'>
              <div className='Index-Movie-Resume-Title-container Title-recom'>
                <span className='Index-Movie-Resume-Title'>Continue Watching Films</span>
                <div className='Index-Movie-Resume-chevrons'>
                  <i className="Icon-Pointer fas fa-chevron-left" onClick={e => this.prevStep(e, 'mw')}></i>
                  <i className="Icon-Pointer fas fa-chevron-right" onClick={e => this.nextStep(e, 'mw')}></i>
                </div>
              </div>
              <ul>
                <Slider ref={ref => this.slider['mw'] = ref} {...settings}>
                  {!!MovieWatched && MovieWatched.map((val, key) => (
                    <CardResume screenShot={val.screenshot} time={val.elapsed} display={this.props.display} key={val.data.id} data={val.data} history={this.props.history} />
                  ))}
                </Slider>
              </ul>
            </div>
          }
          {!!TvWatched && TvWatched.length > 0 &&
            <div className='Index-Movie-Resume-Container'>
              <div className='Index-Movie-Resume-Title-container Title-recom'>
                <span className='Index-Movie-Resume-Title'>Continue Watching Tv Shows</span>
                <div className='Index-Movie-Resume-chevrons'>
                  <i className="Icon-Pointer fas fa-chevron-left" onClick={e => this.prevStep(e, 'tw')}></i>
                  <i className="Icon-Pointer fas fa-chevron-right" onClick={e => this.nextStep(e, 'tw')}></i>
                </div>
              </div>
              <ul>
                <Slider ref={ref => this.slider['tw'] = ref} {...settings}>
                  {!!TvWatched && TvWatched.map((val, key) => (
                    <CardResumeTv image={val.image} current={{ season: val.SeasonNumber, episode: val.EpisodeNumber }} display={this.props.display} key={key} data={{ pop: val.pop, tvdb: val.tvdb, allEp: val.allEp }} history={this.props.history} />
                  ))}
                </Slider>
              </ul>
            </div>
          }
          <div className='Index-Movie-Resume-Container'>
            <div className='Index-Movie-Resume-Title-container Title-recom'>
              <span className='Index-Movie-Resume-Title'>Most recent movies</span>
              <div className='Index-Movie-Resume-chevrons'>
                <i className="Icon-Pointer fas fa-chevron-left" onClick={e => this.prevStep(e, 'nm')}></i>
                <i className="Icon-Pointer fas fa-chevron-right" onClick={e => this.nextStep(e, 'nm')}></i>
              </div>
            </div>
            {!!newMovies && newMovies.length > 0 ?
              <ul>
                <Slider ref={ref => this.slider['nm'] = ref} {...settings2}>
                  {!!newMovies && newMovies.map((val, key) => (
                    <CardMovie display={this.props.display} key={val.id} data={val} history={this.props.history} />
                  ))}
                </Slider>
              </ul>
              :
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '10rem' }}>
                <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
              </div>
            }
          </div>
          <div className='Index-Movie-Resume-Container'>
            <div className='Index-Movie-Resume-Title-container Title-recom'>
              <span className='Index-Movie-Resume-Title'>Most recent Tv Shows</span>
              <div className='Index-Movie-Resume-chevrons'>
                <i className="Icon-Pointer fas fa-chevron-left" onClick={e => this.prevStep(e, 'nt')}></i>
                <i className="Icon-Pointer fas fa-chevron-right" onClick={e => this.nextStep(e, 'nt')}></i>
              </div>
            </div>
            {!!newTvs && newTvs.length > 0 ?
              <ul>
                <Slider ref={ref => this.slider['nt'] = ref} {...settings2}>
                  {!!newTvs && newTvs.map((data, key) => (
                    <CardTvshow display={this.props.display} key={data.pop.id} data={data} history={this.props.history} />
                  ))}
                </Slider>
              </ul>
              :
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '10rem' }}>
                <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
              </div>
            }
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
  return {
    MovieReady: Meteor.subscribe('Get_all_Avancement', { userId }).ready(),
    MovieWatched: MovieWatch.find({ userId, finished: false }).fetch() || false,
    TvReady: Meteor.subscribe('Get_all_Avancement_Tv', { userId }).ready(),
    TvWatched: TvWatch.find({ userId }).fetch() || false
  }
})(IndexPage)
