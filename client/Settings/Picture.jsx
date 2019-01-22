import React, { Component } from 'react';
import { Fa, Input, Button } from 'mdbreact';

export default class Picture extends Component {
  constructor(props) {
    super(props)
    this.state = {
      imageChanged: false,
      userImage: '',
    }
    this.imgref = null
    this.imageInput = null
    this.outImage = null
  }

  componentWillMount = () => {
    let self = this
    Meteor.call('User.loged', (err, res) => {
      if (!err) {
        self.setState({
          userImage: res.profile.userImage,
          userId: res._id,
          username: res.username
        })
      }
    })
  }


  openFile = (e) => {
    e.preventDefault()
    let input = e.target
    let reader = new FileReader()
    reader.onload = (e) => {
      let dataURL = reader.result
      this.outImage.src = dataURL
      this.setState({ userImage: dataURL })
      const { userId, username } = this.state
      Meteor.call('Change.picture', { userId, username, userImage: dataURL }, (err, res) => {
        if (err) throw err
      })
    }
    reader.readAsDataURL(input.files[0])
  }
  render() {
    const { userImage } = this.state
    return (
      <div className="Form" id="form">
        <div className='pic-content p-2'>
          <div id='prof-img'>
            <img ref={ref => this.outImage = ref} src={userImage} alt='' id='imgmaggle' style={{ width: '100%' }} />
            <input ref={elem => this.imageInput = elem} type="file" id="" onChange={this.openFile} name="newpic" style={{ display: 'none' }} accept="image/*" data-required data-onblur />
            <div className='cam-icon' onClick={e => { e.preventDefault(); this.imageInput.click() }}>
              {/* <Fa icon='camera'/> */}
              <i className="fas fa-camera" style={{ fontSize: '14px', height: '25px', width: '25px', marginLeft: '1px' }} ></i>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
