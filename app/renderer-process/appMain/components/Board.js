import React from 'react'

export default class Board extends React.Component {
  handleOnDrop = (e) => {
    e.preventDefault()
    const data = e.dataTransfer.getData('text/plain')
    console.log(`data on drop: ${data}`)

  }
  handleOnDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'

  }

  render = () => (
    <div
      id="the-board"
      className="item-board"
      onDrop={ this.handleOnDrop }
      onDragOver={ this.handleOnDragOver }
    >
      <h1 className="item-board__content">THE BOARD</h1>
    </div>
  )
}