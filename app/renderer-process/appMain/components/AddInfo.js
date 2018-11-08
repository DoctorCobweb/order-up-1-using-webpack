import React from 'react'

export default class AddInfo extends React.Component {
  state = {
    quantity: '',
    info: '' 
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
      // console.log(this.state)
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
      // console.log(this.state)
    })
  }

  handleSaveAddInfoClick = (e) => {
    if (!this.state.quantity && !this.state.info) {
      console.log('warning: empty quantity field. not saving info')
      this.setState(() => ({
        quantity: "required",
        info: "required"
      }))
      return
    } else if (!this.state.quantity) {
      this.setState(() => ({
        quantity: "required"
      }))
      return
    } else if (!this.state.info) {
      console.log('warning: empty info field. not saving info')
      this.setState(() => ({
        info: "required"
      }))
      return
    } else if (this.state.quantity === "required" || this.state.info === "required") {
      return
    } else if (isNaN(parseInt(this.state.quantity))) {
      this.setState(() => ({
        quantity: "needs to be a number"
      }))
      return
    } else {
      // finally OK to progress
      this.props.handleSaveAddInfoClick(
        this.state.quantity,
        this.state.info,
        this.props.itemId
      )
    }
  }

  render = () => (
    <div className="item-info-new__container">
      <div>
        <div className="item-info-new__input-stack">
          <div className="item-info-new__quantity">
            <div className="item-info-new__heading">
              <div>Quantity</div>
              <div>*required</div>
            </div>
            <input
              onChange={ this.handleQuantityClick }
              onFocus={ this.handleQuantityClick }
              onKeyDown={ this.handleQuantityKeyDown }
              value={ this.state.quantity }
            />
          </div>
          <div className="item-info-new__info">
            <div className="item-info-new__heading">
              <div>Info</div>
              <div>*required</div>
            </div>
            <input
              onChange={ this.handleInfoClick }
              onFocus={ this.handleInfoClick }
              onKeyDown={ this.handleInfoKeyDown }
              value={ this.state.info }
            />
          </div>
        </div>
      </div>
      <div>
        <button
          className="button--info"
          onClick={ () =>
            this.props.handleCancelAddInfoClick(
              this.state.quantity,
              this.state.info
            )
          }
        >
          X
        </button>
        <button
          className="button--info"
          onClick={ this.handleSaveAddInfoClick }
        >
          Save
        </button>
      </div>
    </div>
  )
}