import React, { Component } from 'react'

export default class RedirectPage extends Component {
    componentDidMount () {
        this.props.browserHistory.push('/index')
    }

    render () {
        return (<div></div>)
    }    
}
