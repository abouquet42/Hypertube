import React, { Component } from 'react'
import CardMovie from '../Search/cardMovie.jsx'
import CardTvshow from '../Search/cardSerie.jsx'
import { Meteor } from 'meteor/meteor'
import { Button, Collapse } from 'mdbreact'
import { withTracker } from 'meteor/react-meteor-data'
import { MovieWatch } from '/common/Collections/Movie.jsx'
import { TvWatch } from '/common/Collections/Tv.jsx'
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

let Occuped = false

class RecomPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataMovies: null,
      show: null,
      Movies: true,
      Tv: true,
      dataTv: null
    }
    this.slider = {}
    this.Mounted = false
  }

  nextStep = (e, from) => {
    e.preventDefault()
    this.slider[from].slickNext()
  }

  prevStep = (e, from) => {
    e.preventDefault()
    this.slider[from].slickPrev()
  }

  componentDidMount() {
    this.Mounted = true
  }

  componentWillUnmount() {
    this.Mounted = false
  }


  componentDidUpdate = async (prevProps, prevState) => {
    let self = this
    if (prevProps !== this.props && !Occuped && this.props.TvReady) {
      Occuped = true
      let results = this.props.MovieWatched
      let all = await new Promise((resolve, reject) => {
        resolve(Promise.all(results.map(async (val, index) => {
          return await new Promise((resolve, reject) => {
            Meteor.call('Get_Recommanded_Movie', { MovieId: val.movieId }, (err, res) => {
              res.data.movies.from = val.data.title
              resolve(res.data.movies)
            })

          })
        })))
      })
      let tvRes = this.props.TvWatched
      let allTv = await new Promise((resolve, reject) => {
        resolve(Promise.all(tvRes.map(async (val, index) => {
          return await new Promise((resolve, reject) => {
            let params = {
              params: {
                page: 1,
                language: 'en-EN',
                api_key: 'a1df6b4f23ae0441f2e186ad1a1c2db6',
              },
              page: 1,
              imdbID: val.tvdbID,
              dataMem: []
            }
            Meteor.call('Get_Recommanded_Tv', params, (err, res) => {
              res.res.from = val.pop.title
              resolve(res.res)
            })
          })
        })))
      })
      if (this.Mounted)
        self.setState({
          dataMovies: all,
          dataTv: allTv
        })
      Occuped = false
    }
  }


  HandleShow = (e, from) => {
    e.preventDefault()
    if (from === this.state.show) from = null
    this.setState({ show: from })
  }

  HandleShowMovie = (e) => {
    e.preventDefault()
    this.setState({ Movies: !this.state.Movies })
  }

  HandleShowTV = (e) => {
    e.preventDefault()
    this.setState({ Tv: !this.state.Tv })
  }

  render() {
    const { dataMovies, show, Movies, Tv, dataTv } = this.state
    var settings = {
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
          breakpoint: 1200,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            // infinite: false,
            dots: false
          }
        },
        {
          breakpoint: 880,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            initialSlide: 1
          }
        }
      ]
    }
    return (
      <div>
        {/* MOVIES */}
        <div className='Index-Movie-Resume-Container'>
          <div className='Index-Movie-Resume-Title-container Title-recom' style={{ border: 'none', backgroundColor: 'rgba(97,97,97,0.2)', padding: '1rem' }}><span className='Index-Movie-Resume-Title'>{`Movies`}</span>
            <Button onClick={this.HandleShowMovie} color='transparent' className="button-container" style={{ minWidth: '38px' }}>
              {!!Movies ?
                <i className="fas fa-chevron-up"></i> : <i className="fas fa-chevron-down"></i>
              }
            </Button>
          </div>
        </div>
        <Collapse isOpen={Movies} style={{ paddingLeft: '2rem' }}>
          {!dataMovies &&
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            </div>
          }
          {!!dataMovies && dataMovies.map((dataMovies, index) => (
            <div key={index} className='Index-Movie-Resume-Container'>
              <div className='Index-Movie-Resume-Title-container Title-recom'><span className='Index-Movie-Resume-Title2'>{`Because you've watched ${dataMovies.from}`}</span>
                <Button onClick={e => this.HandleShow(e, dataMovies.from)} color='transparent' className="button-container" style={{ minWidth: '38px' }}>
                  {show === dataMovies.from ?
                    <i className="fas fa-chevron-up"></i> : <i className="fas fa-chevron-down"></i>
                  }
                </Button>
              </div>
              <Collapse isOpen={show === dataMovies.from}>
                <ul className='show-Index-Recom-Resume-Cards'>
                  {!!dataMovies && !!dataMovies.length && dataMovies.map((val, key) => (
                    <CardMovie display={this.props.display} key={val.id} data={val} history={this.props.history} />
                  ))}
                </ul>
              </Collapse>
            </div>
          ))}
        </Collapse>
        {/* TV */}
        <div className='Index-Movie-Resume-Container'>
          <div className='Index-Movie-Resume-Title-container Title-recom' style={{ border: 'none', backgroundColor: 'rgba(97,97,97,0.2)', padding: '1rem' }}><span className='Index-Movie-Resume-Title'>{`Tv Shows`}</span>
            <Button onClick={this.HandleShowTV} color='transparent' className="button-container" style={{ minWidth: '38px' }}>
              {!!Tv ?
                <i className="fas fa-chevron-up"></i> : <i className="fas fa-chevron-down"></i>
              }
            </Button>
          </div>
        </div>
        <Collapse isOpen={Tv} style={{ paddingLeft: '2rem' }}>
          {!dataTv &&
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            </div>
          }
          {!!dataTv && dataTv.map((data, index) => (
            <div key={index}>
              {data.length > 0 &&
                <div key={index} className='Index-Movie-Resume-Container'>
                  <div className='Index-Movie-Resume-Title-container Title-recom'><span className='Index-Movie-Resume-Title2'>{`Because you've watched ${data.from}`}</span>
                    <Button onClick={e => this.HandleShow(e, data.from)} color='transparent' className="button-container" style={{ minWidth: '38px' }}>
                      {show === data.from ?
                        <i className="fas fa-chevron-up"></i> : <i className="fas fa-chevron-down"></i>
                      }
                    </Button>
                  </div>
                  <Collapse isOpen={show === data.from}>
                    <ul className='show-Index-Recom-Resume-Cards'>
                      <div className='Index-Movie-Resume-chevrons'>
                        <i className="Icon-Pointer fas fa-chevron-left" onClick={e => this.prevStep(e, data.from)}></i>
                        <i className="Icon-Pointer fas fa-chevron-right" onClick={e => this.nextStep(e, data.from)}></i>
                      </div>
                      <Slider ref={ref => this.slider[data.from] = ref} {...settings}>
                        {!!data && !!data.length && data.map((val, key) => (
                          <CardTvshow display={this.props.display} key={val.pop.id} data={val} history={this.props.history} />
                        ))}
                      </Slider>
                    </ul>
                  </Collapse>
                </div>
              }
            </div>
          ))}
        </Collapse>
      </div>
    )
  }
}

export default withTracker(props => {
  let userId = Meteor.userId()
  return {
    MovieReady: Meteor.subscribe('Get_all_Avancement', { userId }).ready(),
    MovieWatched: MovieWatch.find({ userId }).fetch() || false,
    TvReady: Meteor.subscribe('Get_all_Avancement_Tv', { userId }).ready(),
    TvWatched: TvWatch.find({ userId }).fetch() || false
  }
})(RecomPage)
