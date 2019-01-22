import React, { Component } from 'react';
import { Container, Input, Button, Fa } from 'mdbreact'

import './main.css';
import Uname from './Uname.jsx'
import Pwd from './Pwd.jsx'
import Token from './Token.jsx'
import Email from './Email.jsx'
import Fname from './Fname.jsx'
import Lname from './Lname.jsx'
import Quality from './Quality.jsx'
import Picture from './Picture.jsx'
import Subtitle from './Subtitle.jsx'
import CenteredTabs from './Nav.jsx'
import ProfileMovies from './Movies.jsx'
import ProfileTv from './Tv.jsx'
import ModalDelete from './ModalDelete'

export default class Settings extends Component {
	constructor(props) {
		super(props)
		this.state = {
			data: '',
			values: {},
			value: 0,
			open: null,
			TabValue: 0
		}
		this.handleShowTab = this.handleShowTab.bind(this)
		this.Mounted = false
	}

	componentWillUnmount = () => {
		this.Mounted = false
	};


	componentWillMount = () => {
		let self = this
		this.Mounted = true
		let location = this.props.location.pathname.split('/')[2]
		if (location === 'movies') location = 1
		else if (location === 'tv') location = 2
		else {
			location = 0
			this.props.history.replace('/Settings')
		}
		this.setState({
			TabValue: location
		})
		Meteor.call('User.loged', (err, res) => {
			if (!err) {
				self.setState({
					values: {
						username: res.username,
						email: res.emails[0].address,
						lname: res.profile.lname,
						fname: res.profile.fname,
						userImage: res.profile.userImage,
						userId: res._id,
						quality: res.profile.quality,
						subtitles: res.profile.subtitles,
						api_token: res.profile.api_token,
						token_exp: res.profile.token_exp,
						serv: res.profile.serv
					}
				})
			}
		})
		this.props.history.listen(location => {
			if (!!this.Mounted) {
				let TabValue = 0
				if (location.pathname === '/Settings/movies') TabValue = 1
				else if (location.pathname === '/Settings/tv') TabValue = 2
				else if (location.pathname === '/Settings') TabValue = 0
				else TabValue = null
				if (TabValue !== null) this.setState({ TabValue })
			}
		})
	}

	handleShowTab = (e) => {
		// e.preventDefault()
		let newopen = e.target.id
		if (this.state.open !== newopen) {
			this.setState({ open: newopen })
		} else {
			this.setState({ open: null })
		}
	}

	handleTabs = (e, TabValue) => {
		if (TabValue === 1) {
			this.props.history.replace('/Settings/movies')
		}
		else if (TabValue === 2) {
			this.props.history.replace('/Settings/tv')
		}
		else {
			this.props.history.replace('/Settings')
		}
		this.setState({ TabValue })
	}

	ChangeVal = (val, name) => {
		this.setState({ values: { ...this.state.values, [name]: val } })
	}

	GenToken = (val) => {
		this.setState({ values: { ...this.state.values, ['api_token']: val.token, ['token_exp']: val.now } })
	}
	render() {
		let { TabValue } = this.state
		return (
			<div className="Container">
				<CenteredTabs TabValue={TabValue} handleTabs={this.handleTabs} />
				{/* <div className="title">
					<span className="infospan">ACCOUNT</span>
				</div> */}
				{TabValue === 0 &&
					<div className="Account">
						<div className="userImage">
							<Picture></Picture>
						</div>
						<div className="userinfo">
							<div className="userinfor">
								<div className="fname" id='fname' onClick={e => this.handleShowTab(e)}>
									<span id='fname' onClick={e => this.handleShowTab(e)} className="info">FIRST NAME</span><br />
									<span className="infospan" id='fname' onClick={e => this.handleShowTab(e)}>{this.state.values.fname}</span>
									{this.state.open === 'fname' &&
										<Fname new={this.ChangeVal}></Fname>
									}
								</div>
								<div className="lname" id='lname' onClick={e => this.handleShowTab(e)}>
									<span id='lname' onClick={e => this.handleShowTab(e)} className="info">LAST NAME</span><br />
									<span className="infospan" id='lname' onClick={e => this.handleShowTab(e)}>{this.state.values.lname}</span>
									{this.state.open === 'lname' &&
										<Lname new={this.ChangeVal}></Lname>
									}
								</div>
								<div className="email" id='email' onClick={e => this.handleShowTab(e)}>
									<span id='email' onClick={e => this.handleShowTab(e)} className="info" name='email' type='email'>EMAIL ADDRESS</span><br />
									<span className="infospan" id='email' onClick={e => this.handleShowTab(e)}>{this.state.values.email}</span>
									{this.state.open === 'email' &&
										<Email></Email>
									}
								</div>
								<div className="uname" id='uname' onClick={e => this.handleShowTab(e)}>
									<span id='uname' onClick={e => this.handleShowTab(e)} className="info">USERNAME</span><br />
									<span className="infospan" id='uname' onClick={e => this.handleShowTab(e)}>{this.state.values.username}</span>
									{this.state.open === 'uname' &&
										<Uname new={this.ChangeVal}></Uname>
									}
								</div>
								{!this.state.values.serv &&
									<div className="pwd" id='pwd' onClick={e => this.handleShowTab(e)}>
										<span id='pwd' onClick={e => this.handleShowTab(e)} className="info">PASSWORD</span><br />
										<span className="infospan" id='pwd' onClick={e => this.handleShowTab(e)}>**********</span>
										{this.state.open === 'pwd' &&
											<Pwd></Pwd>
										}
									</div>
								}
								<div className="pwd" id='Token' onClick={e => this.handleShowTab(e)}>
									<span id='Token' onClick={e => this.handleShowTab(e)} className="info">API TOKEN</span><br />
									<span className="infospan" id='Token' onClick={e => this.handleShowTab(e)}>{this.state.values.api_token}</span>
									{this.state.open === 'Token' &&
										<Token new={this.GenToken} value={this.state.values.api_token} expiration={this.state.values.token_exp}></Token>
									}
								</div>
								<div className="audio-settings" id='videos' onClick={e => this.handleShowTab(e)}>
									<span id='videos' onClick={e => this.handleShowTab(e)} className="info">VIDEO SETTINGS</span><br />
									<span className="infospan" id='videos' onClick={e => this.handleShowTab(e)}>These settings determine how Hypertube will try to select quality and subtitle tracks when playing media.</span>
									{this.state.open === 'videos' &&
										<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap' }}>
											<Quality></Quality>
											<Subtitle></Subtitle>
										</div>
									}
								</div>
							</div>
							<div className="privacy">
								<span id='18+' className="info">PRIVACY</span><br />
								<span className="infospan">We are RGPD proof. None of your data will be used instead you decide to share it with us.</span>
							</div>
							<div className="delete-account">
								<ModalDelete />
							</div>
						</div>
					</div>
				}
				{TabValue === 1 &&
					<div>
						<ProfileMovies display={this.props.displayPlayer} location={this.props.location} history={this.props.history}/>
					</div>
				}
				{TabValue === 2 &&
					<div>
						<ProfileTv display={this.props.displayPlayer} location={this.props.location} history={this.props.history}/>
					</div>
				}
			</div>
		)
	}
}
