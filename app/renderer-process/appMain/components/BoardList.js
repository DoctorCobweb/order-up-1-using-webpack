import React from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import BoardListItem from './BoardListItem'

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

export default class BoardList extends React.Component {
  render() {
    return (
      <div className="board-list-container">
        <h3>{ this.props.list.title } : { this.props.list.direction } </h3>
        <Droppable 
          droppableId={ this.props.list.nameId }
          direction={ this.props.list.direction }
        >
          { (provided, snapshot) => (
            <div
              ref={ provided.innerRef } //
              { ...provided.droppableProps }
              className="board-list"
            >
              { this.props.orders
                  .map((order, index) => 
                    <BoardListItem
                      key={ order.id }
                      order={ order.content }
                      index={ index }
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