import React, { Component } from 'react'
import Fade from 'react-reveal/Fade';
import { Fa, Button } from 'mdbreact'
import './main.css'

export default class Forgot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
    }
    this.errMail = null
    this.goodRef = null
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick = (e) => {
    e.preventDefault()
    var isValid = ValidateForm.validate('#first-form')
    if (isValid) {
      Meteor.call('User.forgot.email', { email: this.state.email }, (err, res) => {
        if (err) throw err
        else if (res === false) {
          this.errMail.innerText = 'Email or Username does not exist'
        }
        else if (res !== false) {
          this.goodRef.innerText = 'An email has been sent to reset your password'
        }
      })
    }
  }

  _handleValue = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render() {
    const { email } = this.state
    return (
      <div style={{ position: 'relative' }}>
        <div className='contentSignin'>
          <form className='signForm validate' id='first-form'>
            <div className='inputSign form-group'>
              <label className='inputLabel' htmlFor='email'>Email or username</label>
              <input className='mailInput' id='email' onChange={this._handleValue} value={email} name='email' type='email' data-required data-onblur />
              <span ref={ref => this.errMail = ref}></span>
            </div>
            <Button type='button' color='#cc7b19' className='newAcc-btn' onClick={this.handleClick}>Reset Password</Button>
            <span ref={ref => this.goodRef = ref}></span>
          </form>
        </div>
      </div>
    )
  }
}
