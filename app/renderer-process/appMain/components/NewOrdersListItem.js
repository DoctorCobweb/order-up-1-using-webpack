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

  customizeButton = () => {
    const location = this.props.order.location
    if (location === 'RESTAURANT BAR') {
      return (
        <button 
          id={ this.props.order._id }
          className="button button--restaurant"
          onClick={() => { this.props.handleOrderClick(this.props.order._id) }}
        >
          <div>{this.props.order.location} / T: {this.props.order.tableNumber} / C: {this.props.order.covers}</div>
        </button>
      )
    } else if (location === 'GAMING BAR') {
      return (
        <button
          id={ this.props.order._id }
          className="button button--gaming"
          onClick={() => { this.props.handleOrderClick(this.props.order._id) }}
        >
          <div>{this.props.order.location} / T: {this.props.order.tableNumber} / C: {this.props.order.covers}</div>
        </button>
      )
    } else {
      return (
        <button
          id={ this.props.order._id }
          className="button button--bar"
          onClick={() => { this.props.handleOrderClick(this.props.order._id) }}
        >
          <div>{this.props.order.location} / T: {this.props.order.tableNumber} / C: {this.props.order.covers}</div>
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
            className="new-orders-list-item-dnd"
            {...provided.draggableProps}
            ref={provided.innerRef} 
          >
            {
              this.customizeButton()
            }
            <div
              {...provided.dragHandleProps}
              className="drag-handle"
            >
            </div>
          </div>
        )}
      </Draggable>
    )
  }
}