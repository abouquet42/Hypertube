import React, { Component } from 'react'
import Movies from './Componnents/Movies'
import MoviesSug from './Componnents/MovieSug'
import MoviesInfo from './Componnents/MoviesInfo'
import User from './Componnents/User'
import UserMovies from './Componnents/UserMovies'
import Comment from './Componnents/Comment'
import { Meteor } from 'meteor/meteor';

export default class ApiExamples extends Component {
  constructor(props) {
    super(props)
    this.state = {
       tab: 1,
       queryRes: '',
       api_key: ''
    }
  }

  HandleTab = (e, tab) => {
    e.preventDefault()
    let path = '/Api/examples'
    if (tab === 2) path += '/movie_sug'
    else if (tab === 3) path += '/movie_infos'
    else if (tab === 4) path += '/user_info'
    else if (tab === 5) path += '/user_movies'
    else if (tab === 6) path += '/send_comment'
    this.props.history.push(path)
    this.setState({tab})
    }

  componentDidMount() {
    let path = this.props.history.location.pathname.split('/')[3]
    let tab = 1
    if (path) {
      if (path === 'movie_sug') tab = 2
      else if (path === 'movie_infos') tab = 3
      else if (path === 'user_info') tab = 4
      else if (path === 'user_movies') tab = 5
      else if (path === 'send_comment') tab = 6
      else this.props.history.replace('/Api/examples')
    }
    this.setState({tab})
    Meteor.call('User.loged', (err, res) => {
      if (!err) {
        let api_key = res.profile.api_token
        if (api_key)
          this.setState({api_key})
      }
    })
  }

  HandleApi = (api_key) => {
    this.setState({api_key})
  }
  
  render () {
    const { tab, queryRes } = this.state
    return (
      <div>
        <div style={{position: 'fixed', left: '238px'}} className='Index-Movie-Resume-Title-container Title-recom'>
          <span className='Index-Movie-Resume-Title'>Api Examples</span>
        </div>
        <div className='Main-api-content'>
          <div className='Api-side'>
            <span className={tab === 1 ? 'Api-side-titles-selected' : 'Api-side-titles'} onClick={e => this.HandleTab(e, 1)}>Movies</span>
            <span className={tab === 2 ? 'Api-side-titles-selected' : 'Api-side-titles'} onClick={e => this.HandleTab(e, 2)}>Movie suggestions</span>
            <span className={tab === 3 ? 'Api-side-titles-selected' : 'Api-side-titles'} onClick={e => this.HandleTab(e, 3)}>Movie infos</span>
            <span className={tab === 4 ? 'Api-side-titles-selected' : 'Api-side-titles'} onClick={e => this.HandleTab(e, 4)}>Your infos</span>
            <span className={tab === 5 ? 'Api-side-titles-selected' : 'Api-side-titles'} onClick={e => this.HandleTab(e, 5)}>Your movies</span>
            <span className={tab === 6 ? 'Api-side-titles-selected' : 'Api-side-titles'} onClick={e => this.HandleTab(e, 6)}>Post movie comment</span>
          </div>
          <div className='Api-test-content'>
            <div className={tab === 1 ? 'Api-full-show' : 'Api-full-hide'}>
              <Movies api_key={this.state.api_key} ChangeApi={this.HandleApi}/>
            </div>
            
            <div className={tab === 2 ? 'Api-full-show' : 'Api-full-hide'}>
              <MoviesSug api_key={this.state.api_key} ChangeApi={this.HandleApi}/>
            </div>
            
            <div className={tab === 3 ? 'Api-full-show' : 'Api-full-hide'}>
              <MoviesInfo api_key={this.state.api_key} ChangeApi={this.HandleApi}/>
            </div>
            
            <div className={tab === 4 ? 'Api-full-show' : 'Api-full-hide'}>
              <User api_key={this.state.api_key} ChangeApi={this.HandleApi}/>
            </div>
            
            <div className={tab === 5 ? 'Api-full-show' : 'Api-full-hide'}>
              <UserMovies api_key={this.state.api_key} ChangeApi={this.HandleApi}/>
            </div>
            
            <div className={tab === 6 ? 'Api-full-show' : 'Api-full-hide'}>
              <Comment api_key={this.state.api_key} ChangeApi={this.HandleApi}/>
            </div>
            
          </div>
        </div>
      </div>
    )
  }
}
