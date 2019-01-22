'use strict'
import React, { Component } from 'react'
import { Input } from 'mdbreact'
import { Meteor } from 'meteor/meteor'
import CardTvshow from './cardSerie.jsx'
import SelectGenreTv from '../Selector/selectorGenreTv';
import './main.css'
const TvApi = 'a1df6b4f23ae0441f2e186ad1a1c2db6'
let refresh = true
let BottomReach = false

class AnimePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tvshows: null,
      data: '',
      query: '',
      genre: '',
      minimum_rating: '',
      limit: 50,
      dateMin: '',
      dateMax: '',
      dataMem: [],
      page: 1,
      anime: true
    }
    this.Mounted = false
  }

  componentDidMount = async () => {
    this.Mounted = true
    let self = this
    let params = {
      api_key: TvApi,
      language: 'jpn-JPN',
      page: 1
    }
    let search = this.props.location.search.substring(1)
    let type = 'popu'
    if (search) {
      let newparam = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
      if (newparam.query) {
        params.query = decodeURI(newparam.query).replace('\+', '\ ')
        console.log('params', params);
        if (this.Mounted) this.setState({query: newparam.query})
        type = 'search'
        this.onClickTitle(params.query)
      }
      if (newparam.with_genres) {
        params.with_genres = newparam.with_genres
        if (this.Mounted) this.setState({genre: newparam.with_genres})
        type = 'disco'
      }
    }
    if (type !== 'search') self.getTvShow(type, params, 1, 0)
    let divScroll = document.getElementById('Tv-scrolling')
    divScroll.addEventListener('scroll', (e) => {
      if (divScroll && divScroll.scrollTop + window.innerHeight >= divScroll.scrollHeight && !BottomReach && refresh && this.Mounted) {
        BottomReach = true
        this.onClickRight()
      }
    })
  }

  componentWillUnmount = () => {
    this.Mounted = false
  }

  getTvShow = async (type, params, page, scroll) => {
    let self = this
    let { dataMem } = self.state
    let old = self.state.data
    params.page = page
    let divScroll = document.getElementsByClassName('lds-roller')
    if (divScroll.length > 0) divScroll[0].style.display = 'block'
    params.with_genres = '16'
    params.include_adult = true
    Meteor.call('Anime_get_tmdb_popu', { type: 'disco', params, page, dataMem, scroll, anime: true }, (err, result) => {
      if (result.res) {
        BottomReach = false
        if (scroll === 1) result.res = old.concat(result.res)
        if (result.res && old && old.length === result.res.length && old.length !== 0) result.page -= 1
        if (this.Mounted)
          self.setState({
            dataMem: result.mem,
            data: result.res,
            page: result.page
          })
        let divScroll = document.getElementById('Tv-scrolling')
        if (divScroll && divScroll.scrollTop + window.innerHeight >= divScroll.scrollHeight && !BottomReach && refresh && this.Mounted) {
          BottomReach = true
          this.onClickRight()
        }
      } else this.getTvShow(type, params, page, scroll)
    })
  }

  onChangeGenre = async (e) => {
    e.preventDefault()
    let self = this
    refresh = true
    var { genre } = self.state
    genre = e.target.value
    if (this.Mounted) self.setState({ [e.target.name]: e.target.value, genre: genre, data: [], query: '' })
    var params = {
      api_key: TvApi,
      language: 'en-EN',
      with_genres: genre
    }
    if (genre !== '') {
      let cur = new URL('https://localhost:5000/Tv/search')
      cur.searchParams.append('with_genres', params.with_genres)
      this.props.history.replace(cur.href.split('https://localhost:5000/Tv/search')[1])
      self.getTvShow('disco', params, 1, 0)
    } else {
      this.props.history.replace('search')
    }
  }

  onChangeTitle = async (e) => {
    e.preventDefault()
    let self = this
    var { query } = self.state
    query = e.target.value
    self.setState({ [e.target.name]: e.target.value, query: query })
  }

  onClickTitle = async (querytest) => {
    let self = this
    refresh = true
    let query = ''
    if (!querytest) {
      query = self.state.query
    }
    else {
      query = querytest
    }
    if (query !== '') {
      let params = {
        api_key: TvApi,
        language: 'en-EN',
        page: 1,
        query
      }
      let cur = new URL('https://localhost:5000/Tv/search')
      cur.searchParams.append('query', params.query)
      this.props.history.replace(cur.href.split('https://localhost:5000/Tv/search')[1])
      let divScroll = document.getElementsByClassName('lds-roller')
      if (divScroll.length > 0) divScroll[0].style.display = 'block'
      this.setState({data: null})
      Meteor.call('Anime_get_tmdb_search', { params }, (err, result) => {
        console.log('result', result)
        refresh = false
        if (result.res && result.res.length < 20) divScroll[0].style.display = 'none'
        self.setState({
          data: result.res,
          page: result.page,
          genre: ''
        })
      })
    } else {
      await this.props.history.push('search')
      self.componentDidMount()
    }
  }

  onClickRight = async () => {
    let self = this
    var { genre, query, page } = self.state
    page = page + 1
    if (genre !== '') {
      var params = {
        api_key: TvApi,
        language: 'en-EN',
        with_genres: genre,
        page: page
      }
    } else {
      var params = {
        api_key: TvApi,
        language: 'en-EN',
        page: page
      }
    }
    let type = ''
    if (genre === '' && query === '') type = 'popu'
    else type = 'disco'
    self.getTvShow(type, params, page, 1)
  }

  _handleKeyPress = (e) => {
    if (e.key === 'Enter') this.onClickTitle()
  }

  render() {
    const { data } = this.state
    return (
      <div className='Movie-Search-Page-content'>
        <ul className='Movie-selectors'>
          <li className='movie'><Input label='Title' onChange={this.onChangeTitle} onKeyPress={this._handleKeyPress} value={this.state.query}></Input></li>
        </ul>
        <div className='Movie-Search-Page-movies' id='Tv-scrolling'>
          <div className='listMovies'>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly' }} >
              {!!data && data.map((data) => (
                <CardTvshow display={this.props.display} key={data.pop.id} data={data} history={this.props.history} />
              ))}
            </div>
          </div>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '10rem' }}>
            <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
          </div>
        </div>
      </div>
    )
  }
}

export default AnimePage
