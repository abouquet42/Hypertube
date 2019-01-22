import React, { Component } from 'react';
// import { Container, Input, Button, Fa } from 'mdbreact'
import { Fa, Container, Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'mdbreact'

export default class ModalDelete extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modal: false,
      allImg: null,
      current: '',
      dataUrl: null
    }

    this.toggle = this.toggle.bind(this)
  }

  toggle(e) {
    if (e)
      e.preventDefault()
    this.setState({
      modal: !this.state.modal,
    })
  }

  handleDelete = (e) => {
    e.preventDefault()
    let userId = Meteor.userId()
		Meteor.call('Remove.user', { userId }, (err, res) => {
			if (err) throw err
			else {
				Meteor.logout((err) => {
					if (err) throw err
				})
			}
		})
	}

  render() {
    const modalStyle = {
      maxWidth: '340px'
    }
    const modalBodyStyle = {
      display: 'flex',
      justifyContent: 'center'
    }
    return (
    <div>
      <Button onClick={this.toggle} type="button" color="red" >Delete your account</Button>
      <Modal style={modalStyle} isOpen={this.state.modal} toggle={this.toggle} centered>
        <ModalHeader className='modalHeader' toggle={this.toggle}>Are you sure ?</ModalHeader>
        <ModalBody style={modalBodyStyle}>
          <i className="fas fa-times fa-4x animated rotateIn" style={{color: 'red'}}></i>
        </ModalBody>
        <ModalFooter style={modalBodyStyle}>
          <div className="modal-footer flex-center">
              <Button color="primary" onClick={this.handleDelete}>Yes</Button>
            <Button color="danger" className="btn  btn-danger waves-effect" onClick={this.toggle}>No</Button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
    )
  }
}
