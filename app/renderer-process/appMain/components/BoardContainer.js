import React from 'react'
import { Board } from './Board'

export default class BoardContainer extends React.Component {

  render = () => (
    <div className="item-board-container" >
      <h1 className="item-board-container__content">THE BOARD</h1>
      <Board boardLabel={'A'} />
      <Board boardLabel={'B'} />
    </div>
  )
}