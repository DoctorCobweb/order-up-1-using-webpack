import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import Header from './Header'

export class Completed extends React.Component {

  state = {
    searchTerm: ''
  }

  handleSearchTermChange = (e) => {
    this.setState({ searchTerm: e.target.value })
  }

  componentDidMount = () => {
    console.log('hello from Completed componentDidMount')
  }

  render = () => (
    <div>
      <Header />
      <input
        type="text"
        placeholder="Search"
        value={ this.state.searchTerm }
        onChange={ this.handleSearchTermChange }
      />
      {
        _.values(this.props.completedOrders)
          .filter(
            completedOrder =>
              `${completedOrder.content.location} ${completedOrder.content.tableNumber}`
                .toUpperCase()
                .indexOf(this.state.searchTerm.toUpperCase()) >= 0
          )
          .map(
            (completedOrder, index) =>
              <p key={ completedOrder.id }>{ completedOrder.content.location } { completedOrder.content.tableNumber }</p>
          )
      }
    </div>
  )
}

const mapStateToProps = (state) => ({
  completedOrders : state.lists.completedOrders,
})

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Completed)