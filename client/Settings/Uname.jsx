import React, { Component } from 'react';
import { Input, Button } from 'mdbreact';

export default class Uname extends Component {
  constructor(props) {
    super(props)
    this.state = {
      oldusername: '',
      username: '',
      userId: '',
    }
    this.uref = null
    this.uref2 = null
    this.handleClick = this.handleClick.bind(this)
    this._handleValue = this._handleValue.bind(this)
  }

  componentWillMount = () => {
    let self = this
    Meteor.call('User.loged', (err, res) => {
      if (!err) {
        self.setState({
          userId: res._id,
          oldusername: res.username,
        })
      }
    })
  }

  handleClick = (e) => {
    if (e) e.preventDefault()
    let self = this
    var isValid = ValidateForm.validate('#changeuname')
    if (isValid) {
      Meteor.call('Users.CheckUsername', { username: this.state.username }, (err, res) => {
        if (err) {}
        else if (res !== true) {
          this.uref.innerText = 'Username already used'
        }
        else if (!res !== true) {
          let { username, oldusername, userId } = this.state
          Meteor.call('Change.username', { username, oldusername, userId }, (err, res) => {
            if (err) throw err
            else {
              self.setState({ oldusername: username })
              this.setState({ username: '' })
              self.props.new(username, 'username')
            }
          })
          this.uref2.innerText = "Username updated successfully"
        }
      })
    }
  }

  _HandleEnter = (e) => {
    if (e.key === 'Enter') {
      this.handleClick()
    }
  }

  _handleValue = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render() {
    const { username } = this.state
    return (
      <div className="Form2" id="form2" onClick={e => e.stopPropagation()}>
        <div className="changeuname" id="changeuname">
          <div>
            <Input onKeyPress={this._HandleEnter} label="New Username" group type="text" size="lg" onChange={this._handleValue} value={username} name="username" type="text" data-onlbur data-required />
          </div>
          <span ref={ref => this.uref = ref} className='err-msg'></span>
          <div className="btn-uname">
            <Button onClick={this.handleClick} type="button" color="orange" className="edit">Save changes</Button>
          </div>
          <span ref={ref => this.uref2 = ref} className='err-msg'></span>
        </div>
      </div>
    )
  }
}
