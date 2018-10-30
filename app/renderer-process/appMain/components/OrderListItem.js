import React from 'react'

export default class OrderListItem extends React.Component {

  handleOrderClick = () => {
    this.props.handleOrderClick(this.props.order)
  }

  render() {
    return (
      <div key={this.props.order._id} className="list-item">
        <button className="button" onClick={this.handleOrderClick}>
          <p>{this.props.order.location} Table: {this.props.order.tableNumber}</p>
          <p>Time: {this.props.order.orderSentAt}</p>
          <p>Covers: {this.props.order.covers}</p>
          <p>Booking Name: {this.props.order.customerName}</p>
        </button>
      </div>
    )
  }

}