import React, { Component } from 'react'
import { connect } from 'react-redux'
import { hot } from 'react-hot-loader'
import BoardList from './BoardList'

// AppOne displays the first 10 orders

export class AppOne extends Component {

  render = () => (
    <BoardList
      orders={
        this.props.lists.lists['new-orders'].orderIds
          .map(orderId => this.props.lists.orders[orderId]).slice(0, 10)
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