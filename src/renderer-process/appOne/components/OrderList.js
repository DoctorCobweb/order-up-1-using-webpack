import React from 'react'
import { connect } from 'react-redux'
import OrderListItem from './OrderListItem'

export const OrderList = (props) => (
  <div>
    <p>order list</p>
    {
      props.orders.length === 0 ? (
        <p>no orders</p>
      ) : (
        props.orders.map(order => <OrderListItem key={order.id} {...order} />)
      )
    }
  </div>
)

const mapStateToProps = (state) => ({
  orders: state
})

export default connect(mapStateToProps, null)(OrderList)