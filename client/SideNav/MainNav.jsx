import React, {Component} from 'react'
import { Button } from 'mdbreact'

export default class SideNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currPath: null
    }
    this.Mounted = false
    this.props.browserHistory.listen( location => {
      if (!!this.Mounted) {
        this.setState({
          currPath: location.pathname
        })
      }
    })
  }

  componentWillUnmount () {
    this.Mounted = false
  }

  componentWillMount = () => {
    this.Mounted = true
    this.setState({
      currPath: this.props.browserHistory.location.pathname
    })
  }

  GoTo = (e, link) => {
    e.preventDefault()
    this.props.browserHistory.push(link)
  }
  
  render() {
    const {currPath} = this.state
    return (
      <div className='Main-Side'>
          <div className='Main-Side-title-content'>
          <span style={{fontSize: '2rem', backgroundColor: 'transparent', alignItems: 'center', lineHeight: '1.7'}}>Hyper<span style={{color: 'orange'}}>tube</span></span>            
          </div>
        <div className='Side-Main-Content'>
          <div className='Side-Content'>
            <div>
              {/* LIBRARIE */}
              <div role='navigation'>
                <div className='Side-Content-title' style={{marginTop: 0}}>
                  <div className='Side-Title'>Libraries</div>
                </div>
                <div className={currPath === '/Movie/search' ? 'Side-Content-Link-Selected' : 'Side-Content-Link'}>
                  <a role='link' className='Side-content-a' onClick={e => this.GoTo(e, '/Movie/search')}>
                    <div style={{display: 'flex'}}>
                      <div className='Side-link-icon'>
                        <i className="fas fa-film" style={{fontSize: '15px'}}></i>
                      </div>
                      <div className='Side-Link-title'>Films</div>
                    </div>
                  </a>
                </div>
                <div className={currPath === '/Tv/search' ? 'Side-Content-Link-Selected' : 'Side-Content-Link'}>
                  <a  role='link' className='Side-content-a' onClick={e => this.GoTo(e, '/Tv/search')}>
                    <div style={{display: 'flex'}}>
                      <div className='Side-link-icon'>
                        <i className="fas fa-tv" style={{fontSize: '13px'}}></i>
                      </div>
                      <div className='Side-Link-title'>TV Shows</div>
                    </div>
                  </a>
                </div>
                <div className={currPath === '/Anime/search' ? 'Side-Content-Link-Selected' : 'Side-Content-Link'}>
                  <a  role='link' className='Side-content-a' onClick={e => this.GoTo(e, '/Anime/search')}>
                    <div style={{display: 'flex'}}>
                      <div className='Side-link-icon'>
                        <i className="fas fa-tv" style={{fontSize: '13px'}}></i>
                      </div>
                      <div className='Side-Link-title'>Anime</div>
                    </div>
                  </a>
                </div>
              </div>
              {/* END LIBRARIE */}
              {/* ACCOUNT */}
              <div role='navigation'>
                <div className='Side-Content-title'>
                  <div className='Side-Title'>Personal Content</div>
                </div>
                <div className={currPath === '/Movie/Watch_later' ? 'Side-Content-Link-Selected' : 'Side-Content-Link'}>
                  <a role='link' className='Side-content-a' onClick={e => this.GoTo(e, '/Movie/Watch_later')}>
                    <div style={{display: 'flex'}}>
                      <div className='Side-link-icon'>
                        <i className="far fa-clock" style={{fontSize: '15px'}}></i>
                      </div>
                      <div className='Side-Link-title'>Watch later</div>
                    </div>
                  </a>
                </div>
                <div className={currPath === '/Recommanded' ? 'Side-Content-Link-Selected' : 'Side-Content-Link'}>
                  <a role='link' className='Side-content-a' onClick={e => this.GoTo(e, '/Recommanded')}>
                    <div style={{display: 'flex'}}>
                      <div className='Side-link-icon'>
                        <i className="fab fa-medapps" style={{fontSize: '15px'}}></i>
                      </div>
                      <div className='Side-Link-title'>Recommended</div>
                    </div>
                  </a>
                </div>
              </div>
              {/* END ACCOUNT */}
              {/* SETTINGS */}
              {/* {this.state.currPath === '/Settings' && */}
              <div role='navigation'>
                <div className='Side-Content-title'>
                  <div className='Side-Title'>Account</div>
                </div>
                <div className={currPath === '/Settings' ? 'Side-Content-Link-Selected' : 'Side-Content-Link'}>
                  <a role='link' className='Side-content-a' onClick={e => this.GoTo(e, '/Settings')}>
                    <div style={{display: 'flex'}}>
                      <div className='Side-link-icon'>
                        <i className="fas fa-cogs" style={{fontSize: '15px'}}></i>
                        {/* <i className="far fa-clock" style={{fontSize: '15px'}}></i> */}
                      </div>
                      <div className='Side-Link-title'>Settings</div>
                    </div>
                  </a>
                </div>
                <div className={currPath === '/Settings/movies' ? 'Side-Content-Link-Selected' : 'Side-Content-Link'}>
                  <a role='link' className='Side-content-a' onClick={e => this.GoTo(e, '/Settings/movies')}>
                    <div style={{display: 'flex'}}>
                      <div className='Side-link-icon'>
                        <i className="far fa-check-circle" style={{fontSize: '15px'}}></i>
                      </div>
                      <div className='Side-Link-title'>Movies watched</div>
                    </div>
                  </a>
                </div>
                <div className={currPath === '/Settings/tv' ? 'Side-Content-Link-Selected' : 'Side-Content-Link'}>
                  <a role='link' className='Side-content-a' onClick={e => this.GoTo(e, '/Settings/tv')}>
                    <div style={{display: 'flex'}}>
                      <div className='Side-link-icon'>
                        <i className="far fa-eye" style={{fontSize: '15px'}}></i>
                      </div>
                      <div className='Side-Link-title'>TV Shows in progress</div>
                    </div>
                  </a>
                </div>
                <div className={currPath.search('/Api/examples') === 0 ? 'Side-Content-Link-Selected' : 'Side-Content-Link'}>
                  <a role='link' className='Side-content-a' onClick={e => this.GoTo(e, '/Api/examples')}>
                    <div style={{display: 'flex'}}>
                      <div className='Side-link-icon'>
                        <i className="fab fa-elementor" style={{fontSize: '15px'}}></i>
                      </div>
                      <div className='Side-Link-title'>API examples</div>
                    </div>
                  </a>
                </div>
              </div>
              {/* } */}
              {/* END SETTINGS */}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
