import React from 'react';
// import Meteor from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'
import { withTracker } from 'meteor/react-meteor-data'
import axios from 'axios';
let timer = null
// const imdb = require('imdb-api')
// const EztvApi = require('eztv-api-pt')

// // Create a new instance of the module.
// const eztv = new EztvApi()


const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  },
});

function TextButtons(props) {
  const { classes } = props;
  return (
    <div>
      <Button onClick={e => props.onClick(e)} className={classes.button}>{props.text}</Button>
    </div>
  );
}

TextButtons.propTypes = {
  classes: PropTypes.object.isRequired,
};

const NewButton = withStyles(styles)(TextButtons)
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      loged: true,
      ErrMessLog: '',
      ErrMessReg: '',
      showControls: false,
      ControlTimer: 0,
    }
  }
  
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  CreateUser = (e) => {
    e.preventDefault()
    let {email, password} = this.state
    Meteor.call('User.insert', {email, password}, (err) => {
      if (err) {
        this.setState({
          ErrMessReg: err.reason
        })
      }
    })
  }
  

  _LogOut = (e) => {
    e.preventDefault()
    Meteor.logout((err) => {
      if (!err) {
        this.setState({
          loged: false
        })
      }
    })
  }

  LogIn = (e) =>{
    e.preventDefault()
    let {email, password} = this.state
    Meteor.loginWithPassword(email, password, (err, data) => {
      if (!err) {
        this.setState({
          loged: Meteor.user()
        })
      } else {
        this.setState({
          ErrMessLog: err.reason
        })
      }
    })
  }

  ShowControls = (e) => {
    e.preventDefault()
    this.setState({showControls: true})
    if (timer)
      clearTimeout(timer)
    timer = setTimeout(() => {
      this.setState({showControls: false})
    }, 2000);
  }
  render() {
    return (
    <div>
    </div>
    )
  }
}

export default App

// https://www.npmjs.com/package/eztv-api
//https://www.npmjs.com/package/imdb-api
