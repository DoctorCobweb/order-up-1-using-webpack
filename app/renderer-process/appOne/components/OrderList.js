import React from 'react'
import { connect } from 'react-redux'
import OrderListItem from './OrderListItem'

export class OrderList extends React.Component {
  handleOrderClick = (order) => {
    this.props.handleOrderClick(order)
  }

  render() {
    return (
      <div>
        <p>order list</p>
        {
          this.props.orders.length === 0 ? (
            <p>no orders</p>
          ) : (
            this.props.orders.map(order => 
              <OrderListItem
                key={order.id} 
                order={order}
                handleOrderClick={this.handleOrderClick}
              />
            )
          )
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  orders: state
})

export default connect(mapStateToProps, null)(OrderList)