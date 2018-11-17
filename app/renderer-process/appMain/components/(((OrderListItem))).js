import React from 'react'
import { Draggable } from 'react-beautiful-dnd'


export default class OrderListItem extends React.Component {


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

  render = () => (
    <Draggable
      draggableId={ this.props.order._id } // required
      index={ this.props.index } // reqiured
    >
      { (provided, snapshot) => (
        <div
          { ...provided.draggableProps }
          ref={ provided.innerRef }
          className="list-item"
        >
          <button
            id={ this.props.order._id }
            onClick={() => { this.props.handleOrderClick(this.props.order._id) }}
          >
            <div>{this.props.order.location} / T: {this.props.order.tableNumber} / C: {this.props.order.covers}</div>
          </button>
          <div
            { ...provided.dragHandleProps }
          >
            DRAG HANDLE 
          </div>
        </div>
      )}
    </Draggable>
  )
}

        // <button
        //   id={ this.props.order._id }
        //   className="button button--bar"
        //   onClick={() => { this.props.handleOrderClick(this.props.order._id) }}
        // >
        //   <div>{this.props.order.location} / T: {this.props.order.tableNumber} / C: {this.props.order.covers}</div>
        // </button>