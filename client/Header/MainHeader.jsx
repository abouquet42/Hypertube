import React, { Component } from 'react'
import { Button, DropdownMenu, DropdownItem, DropdownToggle, Dropdown } from 'mdbreact'
// import createBrowserHistory from 'history/createBrowserHistory';
// const browserHistory = createBrowserHistory();
const TvApi = 'a1df6b4f23ae0441f2e186ad1a1c2db6'
const mainTvUrl = 'https://api.themoviedb.org/3/'
const PopCorn = require('popcorn-api')
import Profilheader from './Profilheader.jsx'
import { withTracker } from 'meteor/react-meteor-data'

class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currPath: null,
      data: null,
      dataTv: null,
      query_term: '',
      limit: 50,
      pageTv: 1,
    }
    this.Mounted = false
    this.props.browserHistory.listen(location => {
      if (!!this.Mounted) {
        this.setState({
          currPath: location.pathname
        })
      }
    })
    this.timer = null
  }

  componentWillUnmount() {
    this.Mounted = false
  }


  componentWillMount = () => {
    this.Mounted = true
    this.setState({
      currPath: this.props.browserHistory.location.pathname
    })
  }

  GoBack = (e) => {
    e.preventDefault()
    this.props.browserHistory.goBack()
  }

  GoTo = (e, link) => {
    e.preventDefault()
    if (this.props.browserHistory.location.pathname !== link) {
      this.props.browserHistory.replace(link)
    }
  }

  GoTo2 = (e, link) => {
    e.preventDefault()
    if (this.props.browserHistory.location.pathname !== link) {
      this.props.browserHistory.push(link)
    }
  }

  clear = () => {
    let self = this
    let { query_term } = self.state
    self.setState({ query_term: '', data: null, dataTv: null })
  }

  onChangeTitle = async (e) => {
    e.preventDefault()
    let self = this
    var { query_term } = self.state
    self.setState({ [e.target.name]: e.target.value })
    query_term = e.target.value
    self.setState({ query_term: query_term })
  }

  onPressEnterSearch = () => {
    let self = this
    var { query_term, limit } = self.state
    var params = {
      query_term,
      limit,
      page: 1
    }
    if (query_term !== '') {
      Meteor.call('get_yts', { params }, (err, result) => {
        if (result) {
          if (result.data.movie_count > 0) {
            self.setState({
              data: result.data.movies
            })
          } else {
            self.setState({
              data: []
            })
          }
        }
      })
      params = {
        api_key: TvApi,
        language: 'en-EN',
        page: 1,
        query: query_term
      }
      Meteor.call('get_tmdb_search', { params }, (err, result) => {
        self.setState({
          dataTv: result.res
        })
      })
    } else {
      self.setState({
        data: null,
        dataTv: null
      })
    }
  }

  _handleKeyPress = (e) => {
    if (this.timer) clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.onPressEnterSearch()
    }, 1000)
  }

  render() {
    const { data, dataTv, userImage } = this.state
    let { userInfo } = this.props
    return (
      <div className='Main-Header'>
        <div className='Header-Container'>
          <div className='Header-Left'>
            <Button disabled={this.state.currPath === '/index' ? true : false} color='transparent' className="button-container" onClick={e => { this.GoTo(e, '/index') }}>
              <i className="fas fa-home"></i>
            </Button>
            <Button disabled={this.props.browserHistory.length === 2 ? true : false} color='transparent' className="button-container" onClick={this.GoBack}>
              <i className="fas fa-arrow-left"></i>
            </Button>
            <div className='Search-Container'>
              <div className='Search-Content'>
                <Dropdown className='dropSearch' style={{ width: '360px' }}>
                  <DropdownToggle color="none" className='dropToggleSearch'>
                    <i className="fas fa-search Search-item"></i>
                    <input className='Search-Input' onChange={this.onChangeTitle} value={this.state.query_term} onKeyDown={this._handleKeyPress} />
                    <i className="fas fa-times-circle Search-btn-item" onClick={this.clear}></i>
                  </DropdownToggle>
                  {data || dataTv ?
                    <div>
                      <DropdownMenu style={{overflowY: 'auto', maxHeight: '400px'}}>
                        <DropdownItem header>Movies</DropdownItem>
                        {data ? <div>
                          {!!data && data.map((data) => (
                            <DropdownItem href="#" key={data.id} onClick={e => this.GoTo2(e, '/Movie/' + data.id)}>{data.title.replace(/&amp;/g, '&')}</DropdownItem>
                          ))}
                        </div> : ''}
                        <DropdownItem divider />
                        {dataTv ? <div>
                          <DropdownItem header>Tv Show</DropdownItem>
                          {!!dataTv && dataTv.map((data) => (
                            <DropdownItem href="#" key={data.pop.id} onClick={e => this.GoTo2(e, '/Tv/' + data.pop.id + '/' + data.tvdb.id)}>{data.pop.title.replace(/&amp;/g, '&')}</DropdownItem>
                          ))}
                        </div> : ''}
                      </DropdownMenu>
                    </div> : ''}
                </Dropdown>
              </div>
            </div>
          </div>
          <div className='Header-Right' style={{ cursor: 'pointer' }}>
            {!!userInfo &&
              <Profilheader browserHistory={this.props.browserHistory} image={userInfo.profile.userImage}></Profilheader>
            }
          </div>
        </div>
      </div>
    )
  }
}

export default withTracker(props => {
  // let userId = Meteor.userId()
  return {
    userInfo: Meteor.user(),
    // MovieWatched: MovieWatch.find({ userId }).fetch() || false
  }
})(Header)
