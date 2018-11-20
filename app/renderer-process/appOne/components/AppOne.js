import React, { Component } from 'react'
import { connect } from 'react-redux'
import { hot } from 'react-hot-loader'
import BoardList from './BoardList'

export class AppOne extends Component {

  render = () => (
    <BoardList
      orders={ this.props.lists.lists['board-a'].orderIds
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

const ConnectedAppOne = connect(mapStateToProps, mapDispatchToProps)(AppOne)
export default hot(module)(ConnectedAppOne) 