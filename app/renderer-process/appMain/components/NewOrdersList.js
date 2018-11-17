import React from 'react'
import { connect } from 'react-redux'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import NewOrdersListItem from './NewOrdersListItem'

// SNAPSHOT STUFF
// example draggable snapshot obj
// const draggableSnapshot = {
//   isDragging: true,
//   draggingOver: 'column-1',
// }

// and droppable snapshot obj
// const droppableSnapshot = {
//   isDraggingOver: true,
//   draggingOverWith: 'task-1',
// }

export class NewOrdersList extends React.Component {

  componentDidMount() {
    // fetch all the orders on app startup.
    // get from mongodb, populate all orders, put in redux store
    // this.props.startSetOrders()
  }


  render() {
    return (
      <div className="new-orders-list-container">
        <h3>{ this.props.list.title } : { this.props.list.direction } </h3>
        <Droppable 
          droppableId={ this.props.list.nameId }
          direction={ this.props.list.direction }
        >
          { (provided, snapshot) => (
            <div
              ref={ provided.innerRef } //
              { ...provided.droppableProps }
              className="new-orders-list"
            >
              { this.props.orders
                  .map((order, index) => 
                    <NewOrdersListItem
                      key={ order.id }
                      order={ order.content }
                      index={ index }
                      handleOrderClick={ this.props.handleOrderClick }
                    />
                  )
              }
              { provided.placeholder }
            </div>
          )}
        </Droppable>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  // orders: state.orders,
  // lists: state.lists,
})

const mapDispatchToProps = (dispatch) => ({
  // startSetOrders: () => dispatch(startSetOrders())
})

export default connect(mapStateToProps, mapDispatchToProps)(NewOrdersList)

