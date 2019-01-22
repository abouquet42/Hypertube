import React, { Component } from 'react'
import { Input, Button } from 'mdbreact'
import { Meteor } from 'meteor/meteor'
import CardMovie from './cardMovie.jsx'
import SelectGenre from '../Selector/selectorGenre';
import SelectType from '../Selector/selectorType';
import SelectSort from '../Selector/selectorSort';
import SelectRating from '../Selector/selectorRating';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css'
import './main.css'
import moment from 'moment'
let BottomReach = false
let refresh = true
import SwitchDate from './checkBox'

class SearchPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      movies: null,
      data: '',
      dataYear: null,
      triYear: true,
      query_term: '',
      genre: '',
      minimum_rating: '',
      limit: 50,
      dateMin: '',
      dateMax: '',
      order_by: 'desc',
      sort_by: 'download_count',
      page: 1,
      year: [1908, 2018]
    }
    this.Mounted = false
    this.timer = null
    this.timer2 = null
    this.yearNew = null
  }

  componentDidMount = (e) => {
    let self = this
    self.Mounted = true
    var { genre, query_term, minimum_rating, limit, sort_by, order_by, dateMin, dateMax, page, year, triYear } = self.state
    var params = {
      genre,
      query_term,
      minimum_rating,
      limit,
      dateMin,
      dateMax,
      sort_by,
      order_by,
      page: 1
    }
    let search = this.props.location.search.substring(1)
    if (search) {
      params = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
      if (this.Mounted) this.setState(params)
    }
    Meteor.call('get_yts', { params }, (err, result) => {
      if (result) {
        if (self.Mounted) self.setState({ data: result.data.movies })
      }
    })
    let divScroll = document.getElementById('Movie-scrolling')
    divScroll.addEventListener('scroll', (e) => {
      if (divScroll.scrollTop + window.innerHeight >= divScroll.scrollHeight && !BottomReach && refresh && self.Mounted) {
        BottomReach = true
        self.onClickRight()
        if (triYear) self.onChangeYear(year)
      }
    })
  }

  componentWillUnmount = () => {
    this.Mounted = false
  }

  onChangeGenre = (e) => {
    e.preventDefault()
    let self = this
    var { genre, query_term, minimum_rating, limit, sort_by, order_by, dateMin, dateMax, page, year, triYear } = self.state
    genre = e.target.value
    refresh = true
    var params = {
      genre,
      query_term,
      minimum_rating,
      limit,
      dateMin,
      dateMax,
      sort_by,
      order_by,
      page: 1
    }
    let divScroll = document.getElementsByClassName('lds-roller')
    if (divScroll.length > 0) divScroll[0].style.display = 'block'
    Meteor.call('get_yts', { params }, (err, result) => {
      if (result) {
        if (result.data.movie_count > 0) {
          if (result.data.movies.length < 50 || result.data.movie_count <= 50) {
            refresh = false
            divScroll[0].style.display = 'none'
          }
          if (self.Mounted) {
            self.setState({
              data: result.data.movies,
              [e.target.name]: e.target.value,
              page: 1,
              genre
            })
            let cur = new URL('https://localhost:5000/Movie/search')
            Object.keys(params).forEach(key => cur.searchParams.append(key, params[key]))
            this.props.history.replace(cur.href.split('https://localhost:5000/Movie/search')[1])
            if (triYear) self.onChangeYear(year)
          }
        } else {
          refresh = false
          divScroll[0].style.display = 'none'
        }
      }
    })
  }

  onChangeSort = (e) => {
    e.preventDefault()
    let self = this
    var { genre, query_term, minimum_rating, limit, sort_by, order_by, dateMin, dateMax, page, year, triYear } = self.state
    sort_by = e.target.value
    refresh = true
    var params = {
      genre,
      query_term,
      minimum_rating,
      limit,
      dateMin,
      dateMax,
      sort_by,
      order_by,
      page: 1
    }
    let divScroll = document.getElementsByClassName('lds-roller')
    divScroll[0].style.display = 'block'
    Meteor.call('get_yts', { params }, (err, result) => {
      if (result) {
        if (result.data.movie_count > 0) {
          if (result.data.movies.length < 50 || result.data.movie_count <= 50) {
            refresh = false
            divScroll[0].style.display = 'none'
          }
          if (self.Mounted) {
            self.setState({
              data: result.data.movies,
              [e.target.name]: e.target.value,
              page: 1,
              sort_by
            })
            let cur = new URL('https://localhost:5000/Movie/search')
            Object.keys(params).forEach(key => cur.searchParams.append(key, params[key]))
            this.props.history.replace(cur.href.split('https://localhost:5000/Movie/search')[1])
            if (triYear) self.onChangeYear(year)
          }
        } else {
          refresh = false
          divScroll[0].style.display = 'none'
        }
      }
    })
  }

  onChangeType = (e) => {
    e.preventDefault()
    let self = this
    var { genre, query_term, minimum_rating, limit, sort_by, order_by, dateMin, dateMax, page, year, triYear } = self.state
    order_by = e.target.value
    refresh = true
    var params = {
      genre,
      query_term,
      minimum_rating,
      limit,
      dateMin,
      dateMax,
      sort_by,
      order_by,
      page: 1
    }
    let divScroll = document.getElementsByClassName('lds-roller')
    divScroll[0].style.display = 'block'
    Meteor.call('get_yts', { params }, (err, result) => {
      if (result) {
        if (result.data.movie_count > 0) {
          if (result.data.movies.length < 50 || result.data.movie_count <= 50) {
            refresh = false
            divScroll[0].style.display = 'none'
          }
          if (self.Mounted) {
            self.setState({
              data: result.data.movies,
              [e.target.name]: e.target.value,
              page: 1,
              order_by
            })
            let cur = new URL('https://localhost:5000/Movie/search')
            Object.keys(params).forEach(key => cur.searchParams.append(key, params[key]))
            this.props.history.replace(cur.href.split('https://localhost:5000/Movie/search')[1])
            if (triYear) self.onChangeYear(year)
          }
        } else {
          refresh = false
          divScroll[0].style.display = 'none'
        }
      }
    })
  }

  onChangeTitle = (e) => {
    e.preventDefault()
    let self = this
    var { query_term } = self.state
    query_term = e.target.value
    self.setState({ query_term: query_term })
  }

  onSearchTitle = () => {
    let self = this
    var { genre, query_term, minimum_rating, limit, sort_by, order_by, dateMin, dateMax, page, year, triYear } = self.state
    refresh = true
    var params = {
      genre,
      query_term,
      minimum_rating,
      limit,
      dateMin,
      dateMax,
      sort_by,
      order_by,
      page: 1
    }
    let divScroll = document.getElementsByClassName('lds-roller')
    divScroll[0].style.display = 'block'
    Meteor.call('get_yts', { params }, (err, result) => {
      if (result) {
        if (result.data.movie_count > 0) {
          if (result.data.movies.length < 50 || result.data.movie_count <= 50) {
            refresh = false
            divScroll[0].style.display = 'none'
          }
          if (self.Mounted) {
            self.setState({
              data: result.data.movies,
              page: 1,
              query_term
            })
            let cur = new URL('https://localhost:5000/Movie/search')
            Object.keys(params).forEach(key => cur.searchParams.append(key, params[key]))
            this.props.history.replace(cur.href.split('https://localhost:5000/Movie/search')[1])
            if (triYear) self.onChangeYear(year)
          }
        } else {
          refresh = false
          divScroll[0].style.display = 'none'
          if (self.Mounted) {
            self.setState({
              data: null,
              page: 1
            })
          }
        }
      }
    })
  }

  onChangeRating = (e) => {
    e.preventDefault()
    let self = this
    var { genre, query_term, minimum_rating, limit, sort_by, order_by, dateMin, dateMax, page, year, triYear } = self.state
    minimum_rating = e.target.value
    refresh = true
    var params = {
      genre,
      query_term,
      minimum_rating,
      limit,
      dateMin,
      dateMax,
      sort_by,
      order_by,
      page: 1
    }
    let divScroll = document.getElementsByClassName('lds-roller')
    divScroll[0].style.display = 'block'
    Meteor.call('get_yts', { params }, (err, result) => {
      if (result) {
        if (result.data.movie_count > 0) {
          if (result.data.movies.length < 50 || result.data.movie_count <= 50) {
            refresh = false
            divScroll[0].style.display = 'none'
          }
          if (self.Mounted) {
            self.setState({
              data: result.data.movies,
              [e.target.name]: e.target.value,
              page: 1,
              minimum_rating
            })
            let cur = new URL('https://localhost:5000/Movie/search')
            Object.keys(params).forEach(key => cur.searchParams.append(key, params[key]))
            this.props.history.replace(cur.href.split('https://localhost:5000/Movie/search')[1])
            if (triYear) self.onChangeYear(year)
          }
        } else {
          refresh = false
          divScroll[0].style.display = 'none'
        }
      }
    })
  }

  onClickRight = () => {
    let self = this
    self.Mounted = true
    var { genre, query_term, minimum_rating, limit, sort_by, order_by, dateMin, dateMax, page, year, triYear } = self.state
    page = page + 1
    var params = {
      genre,
      query_term,
      minimum_rating,
      limit,
      dateMin,
      dateMax,
      sort_by,
      order_by,
      page
    }
    let divScroll = document.getElementsByClassName('lds-roller')
    divScroll[0].style.display = 'block'
    Meteor.call('get_yts', { params }, (err, result) => {
      if (result) {
        let old = self.state.data
        let newData = old.concat(result.data.movies)
        if (result.data.movie_count > 0) {
          if (result.data.movies.length < 50 || result.data.movie_count <= 50) {
            refresh = false
            divScroll[0].style.display = 'none'
          }
          if (self.Mounted) {
            self.setState({
              data: newData,
              page: page
            })
            if (triYear) {
              if (this.yearNew) self.onChangeYear(this.yearNew)
              else self.onChangeYear(year)
            }
          }
          if (result.data.movies.length === 50) BottomReach = false
        } else {
          refresh = false
          divScroll[0].style.display = 'none'
        }
      }
    })
  }

  _handleKeyPress = (e) => {
    if (this.timer) clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.onSearchTitle()
    }, 1000)
  }

  onChangeYear = (year) => {
    const { data } = this.state
    let res = []
    let i = 0
    let thisYear = moment().format('YYYY')
    this.yearNew = year
    if (year[1] > 1900 && year[0] > 1900) {
      if (year[1] > thisYear) year[1] = thisYear
      if (year[0] >= year[1] && year[1] > 1900) year[0] = year[1]
      data.map((data) => {
        i++
        if (data.year >= year[0] && data.year <= year[1]) {
          res.push(data)
        }
      })
      if (data.length === i) {
        if (this.timer) clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          if (res.length === 0) this.onClickRight()
        }, 1000)
      }
      this.setState({ dataYear: res, year: year })
    }
  }

  render() {
    const { data, dataYear, triYear, year } = this.state
    return (
      <div className='Movie-Search-Page-content'>
        <div className='Movie-selectors'>
          <div className='movie-li'><SelectGenre onChange={this.onChangeGenre} value={this.state.genre} /></div>
          <div className='movie-li'><SelectSort onChange={this.onChangeSort} value={this.state.sort_by} /></div>
          <div className='movie-li'><SelectType onChange={this.onChangeType} value={this.state.order_by} /></div>
          <div className='movie-li'><SelectRating onChange={this.onChangeRating} value={this.state.minimum_rating} /></div>
          <div className='movie-li'><Input label='Title' onChange={this.onChangeTitle} value={this.state.query_term} onKeyPress={this._handleKeyPress}></Input></div>
          <div className='movie-li date-container'>
            <div className='date-main-container'>
              <SwitchDate onChange={val => this.setState({ triYear: val })} />
              <span className='span-date-search' style={{ marginLeft: '-17px' }}>Date between </span>
              <input type='number' className='input-date-search' value={year[0]} onChange={e => { this.onChangeYear([e.target.value, year[1]]) }} />
              <span className='span-date-search'> and </span>
              <input type='number' className='input-date-search' value={year[1]} onChange={e => { this.onChangeYear([year[0], e.target.value]) }} />
            </div>
          </div>
        </div>
        <div className='Movie-Search-Page-movies' id='Movie-scrolling'>
          <div className='listMovies'>
            {data ?
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
                {dataYear && triYear ?
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
                    {!!dataYear && dataYear.map((data) => (
                      <CardMovie display={this.props.display} key={data.id} data={data} history={this.props.history} />
                    ))} </div> : <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
                    {!!data && data.map((data) => (
                      <CardMovie display={this.props.display} key={data.id} data={data} history={this.props.history} />
                    ))}
                  </div>
                }
              </div> : 'Aucun film disponible'}
          </div>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '10rem' }}>
            <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
          </div>
        </div>
      </div>
    )
  }
}

export default SearchPage
