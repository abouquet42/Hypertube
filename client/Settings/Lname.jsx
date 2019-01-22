import React, { Component } from 'react';
import { Input, Button } from 'mdbreact';

export default class Lname extends Component {
  constructor(props) {
    super(props)
    this.state = {
      newname: '',
      username: '',
      userId: '',
    }
    this.lref = null
    this.handleClick = this.handleClick.bind(this)
    this._handleValue = this._handleValue.bind(this)
  }

  componentWillMount = () => {
    let self = this
    Meteor.call('User.loged', (err, res) => {
      if (!err) {
        self.setState({
          userId: res._id,
          username: res.username,
        })
      }
    })
  }

  handleClick = (e) => {
    if (e) e.preventDefault()
    let self = this
    var isValid = ValidateForm.validate('#changelname')
    if (isValid) {
      let { userId, username, newname } = this.state
      Meteor.call('Change.lname', { userId, username, newname }, (err, res) => {
        if (err) throw err
        else {
          this.setState({ newname: '' })
          self.props.new(newname, 'lname')
        }
      })
      this.lref.innerText = "Last name updated successfully"
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
    const { newname } = this.state
    return (
      <div className="Form2" id="form2" onClick={e => e.stopPropagation()}>
        <div className="changelname" id="changelname">
          <div>
            <Input onKeyPress={this._HandleEnter} label="Change last name" group type="text" size="lg" onChange={this._handleValue} value={newname} name="newname" type="text" data-onlbur data-required />
          </div>
          <div className="btn-fname">
            <Button onClick={this.handleClick} type="button" color="orange" className="edit">Save changes</Button>
          </div>
          <span ref={ref => this.lref = ref} className='err-msg'></span>
        </div>
      </div>
    )
  }
}
