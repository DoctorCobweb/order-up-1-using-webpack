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

  customizeButton = () => {
    const location = this.props.order.location
    if (location === 'RESTAURANT BAR') {
      return (
        <button 
          id={ this.props.order._id }
          className="button button--restaurant"
          onClick={() => { this.props.handleOrderClick(this.props.order._id) }}
        >
          <div>{this.props.order.location[0]} / T: {this.props.order.tableNumber} / C: {this.props.order.covers}</div>
        </button>
      )
    } else if (location === 'GAMING BAR') {
      return (
        <button
          id={ this.props.order._id }
          className="button button--gaming"
          onClick={() => { this.props.handleOrderClick(this.props.order._id) }}
        >
          <div>{this.props.order.location[0]} / T: {this.props.order.tableNumber} / C: {this.props.order.covers}</div>
        </button>
      )
    } else {
      return (
        <button
          id={ this.props.order._id }
          className="button button--bar"
          onClick={() => { this.props.handleOrderClick(this.props.order._id) }}
        >
          <div>{this.props.order.location[0]} / T: {this.props.order.tableNumber} / C: {this.props.order.covers}</div>
        </button>

      )
    }
  }

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
            {
              this.customizeButton()
            }
          </div>
        )}
      </Draggable>
    )
  }
}
