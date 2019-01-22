import React, { Component } from 'react';
import { Container, Input, Button, Fa } from 'mdbreact';
import './main.css'
import moment from 'moment'
import CenteredTabs from './Nav.jsx'
import ProfileMovies from './Movies.jsx'
import ProfileTv from './Tv.jsx'
export default class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: '',
      values: {},
      value: 0,
			TabValue: 0
    }
  }
  componentWillMount = () => {
    let self = this
    let _id = this.props.location.pathname.split('/')[2]
    Meteor.call('User.get.info', { _id }, (err, res) => {
      if (!err && res) {
        let test = moment(res.createdAt).fromNow(true)
        let location = this.props.location.pathname.split('/')[3]
        if (location === 'movies') location = 1
        else if (location === 'tv') location  = 2
        else {
          location = 0
          this.props.history.replace(`/profile/${_id}`)
        }
        self.setState({
          values: {
            username: res.username,
            lname: res.profile.lname,
            fname: res.profile.fname,
            userImage: res.profile.userImage,
            userId: res._id,
            time: test
          },
          TabValue: location
        })
      } else this.props.history.replace('/index')
    })
  }

  handleTabs = (e, TabValue) => {
    let {userId} = this.state.values
		if (TabValue === 1) {
			this.props.history.replace(`/profile/${userId}/movies`)
		}
		else if (TabValue === 2) {
			this.props.history.replace(`/profile/${userId}/tv`)
		}
		else {
			this.props.history.replace(`/profile/${userId}`)
		}
		this.setState({ TabValue })
	}

  render() {
    let { TabValue } = this.state
    let { username } = this.state.values
    return (
      <div className="Container">
        <CenteredTabs page='prof' TabValue={TabValue} handleTabs={this.handleTabs} />
        {TabValue === 0 &&
        <div className="Account">
          {/* <div className="title">
            <span className="infospan">PROFILE</span>
          </div> */}
          <div className="userImage">
            <div className='pic-content p-2'>
              <div id='prof-img'>
                <img src={this.state.values.userImage} alt='' id="imgmaggle" />
              </div>
            </div>
          </div>
          <div className="userinfo">
            <div className="userinfor" style={{ cursor: 'auto' }}>
              <div className="fname" id='fname'>
                <span id='fname' className="info">FIRST NAME</span><br />
                <span className="infospan" id='fname'>{this.state.values.fname}</span>
              </div>
              <div className="lname" id='lname'>
                <span id='lname' className="info">LAST NAME</span><br />
                <span className="infospan" id='lname'>{this.state.values.lname}</span>
              </div>
              <div className="uname" id='uname'>
                <span id='uname' className="info">USERNAME</span><br />
                <span className="infospan" id='uname'>{this.state.values.username}</span>
              </div>
              <div className="uname" id='uname' style={{ borderBottom: '2px solid rgba(0, 0, 0, .3)' }}>
                <span id='uname' className="info">MEMBER SINCE</span><br />
                <span className="infospan" id='uname'>{this.state.values.time}</span>
              </div>
            </div>
          </div>
        </div>
        }
        {TabValue === 1 &&
					<div>
						<ProfileMovies name={username} location={this.props.location} page='prof'/>
					</div>
				}
				{TabValue === 2 &&
					<div>
						<ProfileTv name={username} location={this.props.location} page='prof'/>
					</div>
				}
      </div>
    )
  }
}
