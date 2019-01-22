import React, { Component } from 'react';
import { Input, Button } from 'mdbreact';

export default class Email extends Component {
  constructor(props) {
    super(props)
    this.state = {
      oldemail: '',
      email: '',
      userId: '',
      username: '',
      loged: true
    }
    this.eref = null
    this.eref2 = null
    this.handleClick = this.handleClick.bind(this)
    this._handleValue = this._handleValue.bind(this)
  }

  componentWillMount = () => {
    let self = this
    Meteor.call('User.loged', (err, res) => {
      if (!err) {
        self.setState({
          userId: res._id,
          oldemail: res.emails[0].address,
          username: res.username
        })
      }
    })
  }

  handleClick = (e) => {
    if (e) e.preventDefault()
    var isValid = ValidateForm.validate('#changeemail')
    if (isValid) {
      Meteor.call('Users.CheckMail', { email: this.state.email }, (err, res) => {
        if (err) throw err
        else if (res !== true) {
          this.eref.innerText = 'Email already used'
        }
        else if (!res !== true) {
          let { email, oldemail, userId, username } = this.state
          Meteor.call('Change.email', { email, oldemail, userId, username }, (err, res) => {
            if (err) throw err
            else if (!res !== true) {
              Meteor.logout((err) => {
                if (err) throw err
              })
            }
          })
          this.eref2.innerText = 'Email updated successfully'
        }
      })
    }
  }

  _handleValue = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  _HandleEnter = (e) => {
    if (e.key === 'Enter') {
      this.handleClick()
    }
  }

  render() {
    const { email } = this.state
    return (
      <div className="Form2" id="form2" onClick={e => e.stopPropagation()}>
        <div className="changeemail" id="changeemail">
          <div>
            <Input onKeyPress={this._HandleEnter} label="Email" group type="email" size="lg" onChange={this._handleValue} value={email} name='email' type='email' data-required data-email data-onblur />
          </div>
          <div className="btn-email">
            <Button onClick={this.handleClick} type="button" color="orange" className="edit">Save changes</Button>
          </div>
          <span ref={ref => this.eref = ref} className='err-msg'></span>
          <span ref={ref => this.eref2 = ref} className='err-msg'></span>
        </div>
      </div>
    )
  }
}
