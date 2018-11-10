import React from 'react'


export default class OrderListItem extends React.Component {

  handleDragstart = (e) => {
    console.log(`hello from handleDragstart. id: ${e.target.id}`)

    e.dataTransfer.setData('text/plain', e.target.id)
    e.dataTransfer.dropEffect = 'move'
  }

  customizeButton = () => {
    const location = this.props.order.location
    if (location === 'RESTAURANT BAR') {
      return (
        <button 
          id={ this.props.order._id }
          className="button button--restaurant"
          onClick={() => { this.props.handleOrderClick(this.props.order._id) }}
          draggable="true"
          onDragStart={ this.handleDragstart }
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
          draggable="true"
          onDragStart={ this.handleDragstart }
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
          draggable="true"
          onDragStart={ this.handleDragstart }
        >
          <div>{this.props.order.location} / T: {this.props.order.tableNumber} / C: {this.props.order.covers}</div>
        </button>

      )
    }

  }

  render = () => this.customizeButton()

}
