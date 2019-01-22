import React, {Component} from 'react'
import * as qs from 'query-string'
import { Meteor } from 'meteor/meteor';
let id42 = '860094033668281226f734b5c16d077ff4ce4f986fb3162db972a17dd2237cd9'
let secret42 = 'd55acd5229a09beb6737cfbab669248e442050b7eeb8a14ab0439f85261de91f'
const credentials = {
  client: {
    id: id42,
    secret: secret42
  },
  auth: {
    tokenHost: "https://api.intra.42.fr"
  }
}

const oauth2 = require('simple-oauth2').create(credentials)

export default class Login42 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      state: '',
      text: 'Please wait'
    }
  }
  
  componentDidMount = async () => {
    const parsed = qs.parse(location.search);
    if (parsed && parsed.code) {
      this.setState({
        code: parsed.code,
        state: parsed.state
      })
      const tokenConfig = {
        code: parsed.code,
        redirect_uri: 'https://localhost:5000/oatuh/42',
        scope: 'public', // also can be an array of multiple scopes, ex. ['<scope1>, '<scope2>', '...']
      }
      try {
        const result = await oauth2.authorizationCode.getToken(tokenConfig)
        const accessToken = oauth2.accessToken.create(result);
        if (accessToken.expired()) {
          try {
            accessToken = await accessToken.refresh();
          } catch (error) {
            this.setState({text: `Error refreshing access token: ${error.message}`});
          }
        }
        fetch('https://api.intra.42.fr/v2/me', {
          method: 'get', 
          headers: new Headers({
            'Authorization': `Bearer ${accessToken.token.access_token}`, 
            'Content-Type': 'application/x-www-form-urlencoded'
          })
        }).then((resp) => resp.json())
        .then((data) => {
          Meteor.call('User.Create42', data, (err, res) => {
            Meteor.loginWithPassword(data.login + '.42', data.id + data.login, (err) => {
              err && alert(err);
              window.close()
            })
          })
        })
      } catch (error) {
        this.setState({text: `Access Token Error ${error.message}`});
      }
    }
  }
  render() {
    return (
      <div>
        <span>{this.state.text}</span>
      </div>
    )
  }
}
