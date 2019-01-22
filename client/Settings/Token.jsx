import React, { Component } from 'react';
import { Input, Button } from 'mdbreact';

export default class Token extends Component {
  constructor(props) {
    super(props)
    this.state = {
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
          userId: res._id
        })
      }
    })
  }

  handleClick = (e) => {
    if (e) e.preventDefault()
    let self = this
    let { userId } = this.state
    Meteor.call('Gen.Token', { userId }, (err, res) => {
      if (err) throw err
      else {
        this.props.new(res)
      }
    })
    this.fref.innerText = "API Token updated successfully"
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
    return (
      <div className="Form2" id="form2" onClick={e => e.stopPropagation()}>
        <div className="changefname" id="changefname">
          <div>
            <Input onKeyPress={this._HandleEnter} disabled label="Your API token" group type="text" size="lg" value={this.props.value} name="Token" type="text" data-onlbur data-required />
          </div>
          <div className="btn-fname">
            <Button onClick={this.handleClick} type="button" color="orange" className="edit">Generate new token</Button>
          </div>
          <span ref={ref => this.fref = ref} className='err-msg'></span>
        </div>
      </div>
    )
  }
}
