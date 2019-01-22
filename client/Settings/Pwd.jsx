import React, { Component } from 'react';
import { Input, Button } from 'mdbreact';

export default class Pwd extends Component {
  constructor(props) {
    super(props)
    this.state = {
      password: '',
      passwordConf: '',
      oldpassword: '',
      userId: '',
      username: ''
    }
    this.Passref = null
    this.PassRef2 = null
    this.handleClick = this.handleClick.bind(this)
    this._handleValue = this._handleValue.bind(this)
  }

  componentWillMount = () => {
    let self = this
    Meteor.call('User.loged', (err, res) => {
      if (!err) {
        self.setState({
          oldpassword: res.services.password.bcrypt,
          userId: res._id,
          username: res.username
        })
      }
    })
  }

  handleClick = (e) => {
    if (e) e.preventDefault()
    var isValid = ValidateForm.validate('#changepwd')
    if (isValid) {
      if (this.state.password === this.state.passwordConf) {
        let { password, passwordConf, userId, username } = this.state
        Meteor.call('Change.password', { userId, passwordConf, username }, (err, res) => {
          if (err) throw err
          else {
            this.PassRef2.innerText = "Password updated successfully"
            this.setState({ password: '', passwordConf: '' })
          }
        })
      }
      else {
        this.PassRef.innerText = "Password doesn't match"
      }
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
    const { password, passwordConf } = this.state
    return (
      <div className="Form2" id="form2" onClick={e => e.stopPropagation()}>
        <div className="changepwd" id="changepwd">
          <div>
            <Input onKeyPress={this._HandleEnter} label="New Password" group type="password" size="lg" onChange={this._handleValue} value={password} name="password" data-onblur data-min={6} data-required />
          </div>
          <div>
            <Input onKeyPress={this._HandleEnter} label="Confirmation Password" group type="password" size="lg" onChange={this._handleValue} value={passwordConf} name="passwordConf" data-onblur data-min={6} data-required />
          </div>
          <span ref={ref => this.PassRef = ref} className='err-msg'></span>
          <div className="btn-pwd">
            <Button onClick={this.handleClick} type="button" color="orange" className="edit">Save changes</Button>
          </div>
          <span ref={ref => this.PassRef2 = ref} className='err-msg'></span>
        </div>
      </div>
    )
  }
}
