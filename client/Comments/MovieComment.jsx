import React, { Component } from 'react'
import { MDBBtn, Input, MDBInput } from 'mdbreact'
import './main.css'
import { withTracker } from 'meteor/react-meteor-data'
import { CommentDB } from '/common/Collections/Comment.jsx'
import { clearLine } from 'readline';
class MovieComment extends Component {
  constructor(props) {
    super(props)
    this.state = {
      values: {},
      value: 0,
      textarea: '',
      currentTime: '',
      currPath: null
    }
    this.handleClick = this.handleClick.bind(this)
  }

  componentWillMount = () => {
    let self = this
    Meteor.call('User.loged', (err, res) => {
      if (!err) {
        self.setState({
          values: {
            userName: res.username,
            userImage: res.profile.userImage,
            userId: res._id,
          }
        })
      }
    })
  }

  handleClick = (e) => {
    let self = this
    e.preventDefault()
    let comment = this.state.textarea
    let userId = Meteor.userId()
    let { id } = this.props.data
    let imdb = this.props.data.imdb_code
    let { userName } = this.state.values
    let image = this.state.values.userImage
    Meteor.call('Send.comment_movie', { comment, userId, id, imdb, image, userName })
    this.setState({ textarea: '' })
  }

  GoTo = (e, val) => {
    e.preventDefault()
    this.props.browserHistory.push(`/profile/${val.userId}`)
  }

  render() {
    const { userImage, userName } = this.state.values
    const { textarea } = this.state
    const { Comments } = this.props
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="comment-container2">
          <div className="comment-profil">
            <div className='comment-picture'>
              <img src={userImage} alt='' id='imgmaggle' style={{ height: '45px' }} />
            </div>
            <div className="comment-username">
              <p>{userName}</p>
            </div>
          </div>
          <div className="comments-text">
            <MDBInput type="textarea" label="Your comment" rows="2" value={textarea} onChange={e => this.setState({ textarea: e.target.value })} />
          </div>
          <div className="send-button">
            <MDBBtn outline color='warning' size='sm' onClick={this.handleClick}>SEND</MDBBtn>
          </div>
        </div>
        <div>
          {!!Comments && Comments.map((val, key) => (
            <div className="comment-container" key={key}>
              <div className="comment-profil">
                <div className='comment-picture'>
                  <img src={val.image} alt='' id='imgmaggle' style={{ height: '45px' }} />
                </div>
                <div className="comment-username">
                  <p style={{cursor: 'pointer'}} onClick={e => {this.GoTo(e, val)}}>{val.userName}</p>
                </div>
              </div>
              <div className="comments-text2">
                <span className="text-com">{val.comment}</span>
              </div>
              <div className="comment-date">
                <span>{val.date}</span>
              </div> 
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default withTracker(props => {
  let { id } = props.data
  let imdb = props.data.imdb_code
  return {
    CommentReady: Meteor.subscribe('Get_all_Movie_Comments', { id, imdb }).ready(),
    Comments: CommentDB.find({ id, imdb }, {sort: {'date': -1}}).fetch() || false
  }
})(MovieComment)
