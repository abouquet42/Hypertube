import React, { Component } from 'react'
import SingleQuery from './SingleQuery'
const MovieUrl = 'https://localhost:5000/api/v1/user_infos'
import {Button} from 'mdbreact'

export default class Movies extends Component {
  constructor(props) {
    super(props)
    this.state = {
      input: {
        api_key: ''
      },
      ReqRes: null
    }
  }

  onChange = (name, val) => {
    if (name === 'api_key') this.props.ChangeApi(val)
    this.setState({input: {...this.state.input, [name]: val}})
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.api_key !== prevProps.api_key)
      this.setState({input: {...this.state.input, ['api_key']: this.props.api_key}})
  }

  SendRequest = () => {
    if (this.state.input.api_key.length > 0) {
      let params = this.state.input
      let currUrl = new URL(MovieUrl)
      Object.keys(params).forEach(key => currUrl.searchParams.append(key, params[key]))
      fetch(currUrl).then((resp) => resp.json()).then((res) => {
        res = JSON.stringify(res, null, 2)
        this.setState({ReqRes: res})
      }).catch(e => {
        let ReqRes = JSON.stringify({
          Status: 'NOT OK',
          Error: 'Something went wrong, please try again later.'
        }, null, 2)
        this.setState({ReqRes})
      })
    } else {
      let ReqRes = JSON.stringify({
        Status: 'NOT OK',
        Error: 'Please provide a valid api_key'
      }, null, 2)
      this.setState({ReqRes})
    }
  }
  
  render () {
    let currUrl = new URL(MovieUrl)
    let { input, ReqRes } = this.state
    Object.keys(input).forEach(key => {
      if (input[key].length > 0 || (key === 'page' && input[key]))
        currUrl.searchParams.append(key, input[key])
    })
    return (
      <div>
        <div className='Index-Movie-Resume-Title-container Title-recom'>
          <span className='Index-Movie-Resume-Title'>Your infos</span>
        </div>
        <div className='api-ContentExample-definition'>
          <span style={{fontSize: '15px', fontWeight: 500}}>Get your Hypertube's account informations</span>
        </div>
        <div className='Main-query-Content'>
          <h2>Query</h2>
          <div className='api-query-content'>
            <SingleQuery placeHolder='Your API key' name='api_key' inputVal={this.props.api_key} OnChange={this.onChange} required={true} />
          </div>
          <div className='Send-request-container'>
            <Button style={{minWidth: '144px', maxHeight: '60px'}} outline color="warning" onClick={this.SendRequest}>SEND REQUEST</Button>
            <span style={{wordBreak: 'break-all'}}>{currUrl.href}</span>
          </div>
          {ReqRes &&
            <div>
              <pre className='Api-request-res'>{ReqRes}</pre>
            </div>
          }
        </div>
      </div>
    )
  }
}
