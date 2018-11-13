import React from 'react'
import { connect } from 'react-redux'
import { Droppable } from 'react-beautiful-dnd'
import OrderListItem from './OrderListItem'

export class OrderList extends React.Component {
  handleOrderClick = (orderId) => {
    this.props.handleOrderClick(orderId)
  }

  render = () => (
    <div className="item-new-orders">
      <div className="order-list">
        <h3 className="list__heading">NEW ORDERS</h3>
        <Droppable droppableId="new-orders-list" >
          {(provided, snapshot) => (
              <div
                ref={ provided.innerRef }
                { ...provided.droppableProps }
              >
                { this.props.orders.map((order, index) => 
                  <OrderListItem
                    key={ order._id }
                    order={ order }
                    handleOrderClick={ this.handleOrderClick }
                    index={ index }
                  />
                )}
                { provided.placeholder }
             </div>
          )}
        </Droppable>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  orders: state.orders
})

export default connect(mapStateToProps, null)(OrderList)