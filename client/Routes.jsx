import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';
import { withTracker } from 'meteor/react-meteor-data'

// route components
import IndexPage from './Index/main.jsx';
import Login42 from './MainLogin/42log'
import LogPage from './MainLogin/main.jsx'
import SearchPage from './Search/main.jsx'
import MovieInfos from './Movie/main.jsx'
import TvshowInfos from './Tvshow/main.jsx'
import SeasonInfos from './Tvshow/season.jsx'
import MoviePlayer from './Player/main.jsx'
import Header from './Header/MainHeader.jsx'
import SideNav from './SideNav/MainNav.jsx'
import TvPage from './Search/mainTv.jsx'
import AnimePage from './Search/mainAnime.jsx'
import Settings from './Settings/main.jsx'
import WatchLater from './WatchLater/main.jsx'
import RecomPage from './Recommanded/main.jsx'
import RedirectPage from './Ressources/redirect.jsx'
import Profile from './Settings/Profile.jsx'
import ApiExamples from './API/main.jsx'
import SnackBarError from './Ressources/snackBar'

const browserHistory = createBrowserHistory()

class SuperMegaRoute extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Switch>
          <Route path='/index' render={props => <IndexPage display={this.props.displayPlayer} location={props.location} history={props.history} />} />
          <Route exact path='/Movie/search' render={props => <SearchPage display={this.props.displayPlayer} location={props.location} history={props.history} />} />
          <Route exact path='/Movie/Watch_later' render={props => <WatchLater display={this.props.displayPlayer} location={props.location} history={props.history} />} />
          <Route exact path='/Recommanded' render={props => <RecomPage display={this.props.displayPlayer} location={props.location} history={props.history} />} />
          <Route exact path='/Movie/:id' render={props => <MovieInfos display={this.props.displayPlayer} location={props.location} history={props.history} />} />
          <Route exact path='/Tv/search' render={props => <TvPage display={this.props.displayPlayer} location={props.location} history={props.history} />} />
          <Route exact path='/Anime/search' render={props => <AnimePage display={this.props.displayPlayer} location={props.location} history={props.history} />} />
          <Route exact path='/Tv/:id/:idtvdb' render={props => <TvshowInfos display={this.props.displayPlayer} location={props.location} history={props.history} />} />
          <Route exact path='/Tv/:id/:idtvdb/:numSeason' render={props => <SeasonInfos display={this.props.displayPlayer} location={props.location} history={props.history} />} />
          <Route path='/Settings' render={props => <Settings display={this.props.displayPlayer} location={props.location} history={props.history} />} />
          <Route path='/Profile/:id' render={props => <Profile display={this.props.displayPlayer} location={props.location} history={props.history} />} />
          <Route path='/Api/examples' render={props => <ApiExamples location={props.location} history={props.history} />} />
          <Route render={props => <RedirectPage location={props.location} browserHistory={browserHistory} />} />
        </Switch>
      </Router>
    )
  }
}

class RenderRoutes extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentUser: null,
      PlayRequest: false,
      data: null,
      dataTvshow: null,
      type: null,
      snackBar: false
    }
  }

  componentWillMount = () => {
    let params = {
      api_key: 'a412ab81a0f966c5bc8c275ced5d9b70',
      userId: "tEpYpEnHtyep3MPPL",
      movie_id: 8462,
      sort_by: 'download_count',
      comment: 'this is good',
      limit: 10,
    }
    var url = new URL('https://localhost:5000/api/v1/user_post_movie_comment')
  };

  componentWillReceiveProps = (nextProps) => {
    if (Meteor.userId() !== this.state.currentUser) {
      this.setState({
        currentUser: Meteor.userId()
      })
    }
  };

  displayPlayer = (e, data, type, valTv) => {
    e.preventDefault()
    if (!!valTv)
      data.valTv = valTv
    if (data) {
      this.setState({
        PlayRequest: true,
        data,
        type
      })
    }
  }

  exitPlayer = (res) => {
    if (res) this.setState({snackBar: true})
    this.setState({
      PlayRequest: false,
      data: null
    })
  }
  shouldComponentUpdate(nextProps, nextState) {
    return true
  }

  _handleCloseSnack = () => {
    this.setState({snackBar: false})
  }

  render() {
    if (this.props.currentUser || this.state.currentUser) {
      return (
        <div style={{ width: '100%', paddingTop: '60px' }}>
          <Header browserHistory={browserHistory} />
          <SnackBarError handleClose={this._handleCloseSnack} open={this.state.snackBar} />
          <div className='Main-Content-NonScroll'>
            <div>
              <div className='Main-Content-Scrollable'>
                <SideNav browserHistory={browserHistory} />
                <div className='Page-Content-Main' id='Scrolling-div'>
                  <SuperMegaRoute displayPlayer={this.displayPlayer} />
                </div>
              </div>
            </div>
          </div>
          {this.state.PlayRequest &&
            <MoviePlayer data={this.state.data} exit={this.exitPlayer} type={this.state.type} browserHistory={browserHistory} />
          }
        </div>
      )
    } else {
      return (
        <Router history={browserHistory}>
          <Switch>
            <Route exact path='/oatuh/42' component={Login42} />
            <Route render={props => <LogPage browserHistory={browserHistory} location={props.location} />} />
          </Switch>
        </Router>
      )
    }
  }
}

export default withTracker(props => {
  return {
    currentUser: Meteor.userId()
  }
})(RenderRoutes)
