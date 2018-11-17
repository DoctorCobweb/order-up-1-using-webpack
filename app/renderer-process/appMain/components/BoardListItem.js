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
            className="board-list-item-dnd"
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef} 
          >
            {this.props.order._id}
          </div>
        )}
      </Draggable>
    )
  }
}
