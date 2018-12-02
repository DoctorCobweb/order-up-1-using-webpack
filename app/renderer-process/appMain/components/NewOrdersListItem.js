import React from 'react'
import { Draggable } from 'react-beautiful-dnd'

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

const MAX_NUMBER_OF_NEW_ORDERS_DISPLAYED_ON_BOARD_C = 29

export default class NewOrdersListItem extends React.Component {

  render() {
    return (
      <Draggable
        draggableId={ this.props.order._id }
        index={ this.props.index }
      >
        {(provided, snapshot) => (
          <div
            className="new-orders-list-item-dnd"
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef} 
          >
            <div
              id={ this.props.order._id }
              className={
                this.props.index > MAX_NUMBER_OF_NEW_ORDERS_DISPLAYED_ON_BOARD_C
                ?
                "new-orders-list-item-dnd button--not-on-grid"
                :
                  this.props.order.location === 'RESTAURANT BAR'
                  ? 
                  "new-orders-list-item-dnd button--red" 
                  : 
                    this.props.order.location === 'GAMING BAR'
                    ?
                    "new-orders-list-item-dnd button--green"
                    :
                    "new-orders-list-item-dnd button--blue"
            }
              onClick={ () => { this.props.handleOrderClick(this.props.order._id) } }
            >
              { this.props.order.tableNumber }
            </div>
          </div>
        )}
      </Draggable>
    )
  }
}