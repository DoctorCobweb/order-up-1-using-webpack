import React from 'react'
import uuidv1 from 'uuid/v1' // timestamp (UTC) version of uuid

export default class AddInfo extends React.Component {
  state = {
    quantity: undefined,
    info: undefined
  }

  handleQuantityClick = (e) => {
    e.persist()
    this.setState(() => ({
      quantity: e.target.value
    }))
  }

  handleQuantityKeyDown = (e) => {
    e.persist()
    this.setState(() => ({
      quantity: e.target.value
    }), () => {
      console.log(this.state)
    })
  }

  handleInfoClick = (e) => {
    e.persist()
    this.setState(() => ({
      info: e.target.value
    }))
  }

  handleInfoKeyDown = (e) => {
    e.persist()
    this.setState(() => ({
      info: e.target.value
    }), () => {
      console.log(this.state)
    })
  }

  render = () => (
    <div>
      <p>Quantity *</p>
      <input
        onChange={ this.handleQuantityClick }
        onFocus={ this.handleQuantityClick }
        onKeyDown={ this.handleQuantityKeyDown }
      />
      <p>Info *</p>
      <input
        onChange={ this.handleInfoClick }
        onFocus={ this.handleInfoClick }
        onKeyDown={ this.handleInfoKeyDown }
      />
      <button
        className="button--info"
        onClick={ () => this.props.handleCancelAddInfoClick(this.state.quantity, this.state.info) }>Cancel</button>
      <button
        className="button--info-save"
        onClick={ () => this.props.handleSaveAddInfoClick(this.state.quantity, this.state.info, this.props.itemId) }>Save</button>
    </div>
  )
}