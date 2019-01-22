import './main.css'
import React, { Component } from 'react'
// import FacebookLogin from 'react-facebook-login'
import GoogleLogin from 'react-google-login'
import SignIn from './signin'
import { Button } from 'mdbreact'
// import Meteor from 'meteor/meteor'
import Forgot from './forgot.jsx'

const id42 = '860094033668281226f734b5c16d077ff4ce4f986fb3162db972a17dd2237cd9'
const secret42 = 'd55acd5229a09beb6737cfbab669248e442050b7eeb8a14ab0439f85261de91f'
const credentials = {
  client: {
    id: id42,
    secret: secret42
  },
  auth: {
    tokenHost: "https://api.intra.42.fr"
  }
}

const oauth2 = require('simple-oauth2').create(credentials)

class LogPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      register: false,
      schoolUri: null,
      isLoging: false,
      isSigning: false,
      Forgot: false,
      email: '',
      password: '',
      connecting: false
    }
    this.refInfo = null
  }

  componentDidMount = async () => {
    const schoolUri = oauth2.authorizationCode.authorizeURL({
      redirect_uri: 'https://localhost:5000/oatuh/42',
      scope: 'public', // also can be an array of multiple scopes, ex. ['<scope1>, '<scope2>', '...']
      state: 'test'
    })
    this.setState({
      schoolUri
    })
    this.props.browserHistory.replace('')
  }


  responseFacebook = (e) => {
    this.setState({ connecting: true })
    Meteor.loginWithFacebook(
      { requestPermissions: ["public_profile", "email"] },
      function (err) {
        if (err) {
          alert("error: ", err)
          this.setState({ connecting: false })
        }
      }
    );
  }
  responseGoogle = (e) => {
    this.setState({ connecting: true })
    Meteor.loginWithGoogle({
      requestPermissions: ['email', 'profile']
    }, function (err) {
      if (err) {
        //error handling
        alert('error : ' + err);
        this.setState({ connecting: false })
        throw new Meteor.Error(Accounts.LoginCancelledError.numericError, 'Error');
      } else {
        //show an alert
        // alert('logged in');
      }
    })
  }

  ConnectSchool = (e) => {
    e.preventDefault()
    this.setState({connecting: true})
    window.open(this.state.schoolUri)
  }

  _handleLogin = (e) => {
    this.setState({ isLoging: !this.state.isLoging })
  }

  _handleSigning = (e) => {
    if (this.state.Forgot) this.setState({ Forgot: false })
    else this.setState({ isSigning: !this.state.isSigning })
  }

  _handleForgot = (e) => {
    this.setState({
      Forgot: !this.state.Forgot,
    })
  }

  _Signin = (e) => {
    e.preventDefault()
    let { email, password } = this.state
    Meteor.loginWithPassword(email, password, (err) => {
      if (err) {
        this.refInfo.innerText = err.reason
        if (err.reason === 'Login forbidden') {
          this.refInfo.innerText = `Can't log in, please be sure you have validated your account`
        }
      }
    })
  }

  _HandleInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render() {
    return (
      <div className='MainLog'>
        <div className='CenterLog'>
          <span style={{ height: '100px', fontSize: '4rem', backgroundColor: 'transparent', alignItems: 'center', lineHeight: '1.7' }}>Hyper<span style={{ color: 'orange' }}>tube</span></span>
          <div className='LogContent'>
            <div style={{ width: '100%' }}>
              <div className='InfoLog'>
                <span>Log in or create an account to use Hypertube</span>
              </div>
            </div>
            {this.state.isSigning || this.state.Forgot &&
              <button className='needButton backBtn' role='button' onClick={this._handleSigning}>{'<'} back</button>
            }
            {this.state.Forgot &&
              <Forgot></Forgot>
            }
            {!this.state.isSigning && !this.state.Forgot &&
              <div className='ActionsLog'>
                <button className='goo-btn' onClick={this.responseGoogle}>CONTINUE WITH GOOGLE</button>
                <button className='kep-login-facebook' onClick={this.responseFacebook}>CONTINUE WITH FACEBOOK</button>
                <button type='button' onClick={this.ConnectSchool} className='btn-42'>CONTINUE WITH 42</button>
                {/* FORM SIGNIN */}
                {this.state.isLoging ?
                  <div>
                    <div className='separator'>
                      <span className='halfHr'></span>
                      OR
                    <span className='halfHr'></span>
                    </div>
                    <form className='signForm'>
                      <div className='inputSign'>
                        <label className='inputLabel' htmlFor='email'>Email or username</label>
                        <input onChange={this._HandleInput} className='mailInput' tabIndex={1} autoComplete='username email' id='email' name='email' type='email' />
                      </div>
                      <div className='inputSign'>
                        <label className='inputLabel' htmlFor='password'>Password</label>
                        <input onChange={this._HandleInput} className='passInput' tabIndex={2} autoComplete='current-password' id='password' name='password' type='password' />
                        <button className='buttonForm' tabIndex={3} role='button' type='button' onClick={this._handleForgot} >Forgot?</button>
                      </div>
                      <span ref={ref => this.refInfo = ref}></span>
                      <button type='button' className='newAcc-btn' onClick={this._Signin}>SIGN IN</button>
                    </form>
                    <span className='needAccount'>Need an account? <button className='needButton' role='button' onClick={this._handleSigning}>Sign up</button></span>
                  </div>
                  :
                  <button type='button' className='newAcc-btn newAcc-img' onClick={this._handleLogin}>CONTINUE WITH EMAIL</button>
                }
                {/* <FacebookLoginButton onClick={() => alert("Hello")} /> */}
              </div>}
            {this.state.isSigning && !this.state.Forgot &&
              <div className='ActionsLog'>
                <SignIn />
                {/* <button className='needButton backBtn' role='button' onClick={this._handleSigning}>{'<'} back</button> */}
              </div>
            }
          </div>
        </div>
        {!!this.state.connecting &&
          <div style={{ position: 'absolute', top: 0, left: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', height: '100%', alignItems: 'center', backgroundColor: 'rgba(20,20,20, 0.8)' }}>
            <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            <span style={{fontSize: '20px', fontWeight: '600',}}>Connecting, please Wait!</span>
            <span style={{fontSize: '10px', fontWeight: '400',}}>If something goes wrong, refresh this page!</span>
          </div>
        }
      </div>
    )
  }
}

export default LogPage
