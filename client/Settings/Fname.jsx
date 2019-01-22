import React, { Component } from 'react';
import { Input, Button } from 'mdbreact';

export default class Fname extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fname: '',
      username: '',
      userId: '',
    }
    this.fref = null
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
    var isValid = ValidateForm.validate('#changefname')
    if (isValid) {
      let { userId, username, fname } = this.state
      Meteor.call('Change.fname', { userId, username, fname }, (err, res) => {
        if (err) throw err
        else {
          this.setState({ fname: '' })
          self.props.new(fname, 'fname')
        }
      })
      this.fref.innerText = "First name updated successfully"
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
    const { fname } = this.state
    return (
      <div className="Form2" id="form2" onClick={e => e.stopPropagation()}>
        <div className="changefname" id="changefname">
          <div>
            <Input onKeyPress={this._HandleEnter} label="Change first name" group type="text" size="lg" onChange={this._handleValue} value={fname} name="fname" type="text" data-onlbur data-required />
          </div>
          <div className="btn-fname">
            <Button onClick={this.handleClick} type="button" color="orange" className="edit">Save changes</Button>
          </div>
          <span ref={ref => this.fref = ref} className='err-msg'></span>
        </div>
      </div>
    )
  }
}
