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

export default class BoardListItem extends React.Component {

  render() {
    return (
      <Draggable
        draggableId={this.props.order._id}
        index={this.props.index}
      >
        {(provided, snapshot) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef} 
          >
            <div
              id={ this.props.order._id }
              className={ this.props.order.location === 'RESTAURANT BAR'
                ? 
                "board-list-item-dnd button--restaurant" 
                : 
                  this.props.order.location === 'GAMING BAR' ?
                    "board-list-item-dnd button--gaming"
                    :
                    "board-list-item-dnd button--bar"
            }
              onClick={() => { this.props.handleOrderClick(this.props.order._id) }}
            >
              T: {this.props.order.tableNumber}
            </div>

          </div>
        )}
      </Draggable>
    )
  }
}
