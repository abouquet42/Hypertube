import React, { Component } from 'react'

export default class Movies extends Component {
  HandleChange = (e) => {
    this.props.OnChange(e.target.name, e.target.value)
  }

  render () {
    const {placeHolder, name, inputVal, required} = this.props
    return (
      <div className='api-singleQuery-content'>
        <span className='api-singleQuery-name'>{name}</span>
        <input placeholder={placeHolder} value={inputVal} name={name} onChange={this.HandleChange} className='api-singleQyery-input' />
        <span className={required ? 'api-singleQuery-required' : 'api-singleQuery-optional'}>{required ? 'required' : 'optional'}</span>
      </div>
    )
  }
}
