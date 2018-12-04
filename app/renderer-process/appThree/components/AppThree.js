import React, { Component } from 'react'
import { connect } from 'react-redux'
import { hot } from 'react-hot-loader'
import BoardList from '../../../shared/components/BoardList'

// AppThree displays orders 21-30

export class AppThree extends Component {
  render = () => (
      <BoardList
        orders= {
          this.props.lists.lists['new-orders'].orderIds
            .map(orderId => this.props.lists.orders[orderId]).slice(20,30)
        }
        screenID='C'
      />
    )
}

const mapStateToProps = (state) => ({
  lists: state.lists
})

const mapDispatchToProps = (dispatch) => ({

})

const ConnectedAppThree = connect(mapStateToProps, mapDispatchToProps)(AppThree)
export default hot(module)(ConnectedAppThree) 