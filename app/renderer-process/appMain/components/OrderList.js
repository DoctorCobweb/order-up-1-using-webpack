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
        {
          this.props.orders.length === 0 ? (
            ""
          ) : (
            this.props.orders.map(order => 
              <OrderListItem
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