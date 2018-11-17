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

export default class NewOrdersListItem extends React.Component {

  render() {
    return (
      <Draggable
        draggableId={this.props.order._id}
        index={this.props.index}
      >
        {(provided, snapshot) => (
          <div
            className="new-orders-list-item-dnd"
            {...provided.draggableProps}
            ref={provided.innerRef} 
          >
            <button
              id={ this.props.order._id } 
              onClick={ () => { this.props.handleOrderClick(this.props.order._id) }}
            >
              { this.props.order._id }
            </button>
            <div
              {...provided.dragHandleProps}
            >
              DRAG
            </div>
          </div>
        )}
      </Draggable>
    )
  }
}