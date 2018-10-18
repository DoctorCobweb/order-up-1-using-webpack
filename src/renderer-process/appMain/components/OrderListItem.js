import React from 'react'

export default class OrderListItem extends React.Component {

  handleOrderClick = () => {
    // console.log(`in OrderListItem/handleOrderClick() called with order id: ${this.props.id}`)
    this.props.handleOrderClick(this.props.order)
  }

  render() {
    console.log(typeof this.props.handleOrderClick)
    return (
      <div className="list-item">
        <button className="button" onClick={this.handleOrderClick}>
          <p>{this.props.order.metaData.location} Table: {this.props.order.metaData.tableNumber}</p>
          <p>Time: {this.props.order.metaData.orderSentAt}</p>
          <p>Covers: {this.props.order.metaData.covers}</p>
          <p>Booking Name: {this.props.order.metaData.customerName}</p>
        </button>
      </div>
    )
  }

}