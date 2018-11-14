import React from 'react'
import { connect } from 'react-redux'
import { Droppable } from 'react-beautiful-dnd'

export class Board extends React.Component {

  render = () => (
    <div>
      { this.props.boardLabel }
    </div>
  )
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = (dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(Board)