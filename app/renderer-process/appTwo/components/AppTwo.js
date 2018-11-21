import React, { Component } from 'react'
import { connect } from 'react-redux'
import { hot } from 'react-hot-loader'
import BoardList from './BoardList'

// AppTwo is Board B: all orders in the 'board-b' list

export class AppTwo extends Component {

  render = () => (
    <BoardList
      orders={ this.props.lists.lists['board-b'].orderIds
        .map(orderId => this.props.lists.orders[orderId])
      }
    />
  )
}

const mapStateToProps = (state) => ({
  lists: state.lists
})

const mapDispatchToProps = (dispatch) => ({

})

const ConnectedAppTwo = connect(mapStateToProps, mapDispatchToProps)(AppTwo)
export default hot(module)(ConnectedAppTwo) 