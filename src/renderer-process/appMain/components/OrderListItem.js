import React from 'react'

export default class OrderListItem extends React.Component {
  constructor(props) {
    super(props)
  }

  handleOrderClick = () => {
    console.log(`in OrderListItem/handleOrderClick() called with order id: ${this.props.id}`)
    this.props.handleOrderClick(this.props.id)
  }

  render() {
    console.log(typeof this.props.handleOrderClick)
    return (
      <div className="list-item">
        <button className="button" onClick={this.handleOrderClick}>
          <p>{this.props.metaData.location} Table: {this.props.metaData.tableNumber}</p>
          <p>Time: {this.props.metaData.orderSentAt}</p>
          <p>Covers: {this.props.metaData.covers}</p>
          <p>Booking Name: {this.props.metaData.customerName}</p>
        </button>
      </div>
    )
  }

}