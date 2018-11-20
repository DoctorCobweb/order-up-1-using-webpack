import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { history } from '../../../shared/routers/AppRouter'
import Course from './Course'
import {
  findOrder,
  sortCoursesInOrder,
} from '../../../shared/selectors/lists'
import {
  startToggleGoOnMains,
} from '../../../shared/actions/lists'

export class Order extends React.Component { 

  handleGoOnMainsClick = (e) => {
    this.props.startToggleGoOnMains({
      orderId: this.props.orderId,
    })
  }

  render = () => {
    return (
      <div>
        <div className="heading">
          <h2>{ this.props.order.location }</h2>
          <h2>Table: { this.props.order.tableNumber }</h2>
        </div>
        <div className="order-meta-details">
          <div>{ this.props.order.orderTakenUsing }</div>
          <div>Clerk: { this.props.order.clerk }</div>
          <div>
            Order sent @{ moment(this.props.order.orderSentAt).format("HH:mm") }
          </div>
          <div>
            Order received @{ moment(this.props.order.orderReceivedAt).format("HH:mm") }
          </div>
          <button
            onClick={ () => this.props.handleOrderCompletedClick(this.props.orderId) }
          >
            Order Completed?
          </button>
          { this.props.order.goOnMains ? 
            <button className="button button--hold-course" onClick={ this.handleGoOnMainsClick }>Hold Mains</button>
            :
            <button className="button button--go-on-course" onClick={ this.handleGoOnMainsClick }>Go on Mains</button>
          }
          {
            (this.props.order.goOnMains) ?
            <div>Mains called away @{ moment(this.props.order.goOnMainsStatedAt).format("HH:mm")} </div>
            :
            ""
          }
        </div>
        { sortCoursesInOrder(this.props.order).courses
            .map(course => (
              <Course
                key={ course._id }
                orderId={ this.props.order._id }
                courseName={ course.name}
                courseId={ course._id }
                courseItems={ course.items }
                goOnMains={ this.props.order.goOnMains }
                onOnMainsStartedAt={ this.props.order.goOnMainsStartedAt }
              />)
            )
        }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  order: findOrder(state.lists.orders, ownProps.orderId)
})

const mapDispatchToProps = (dispatch) => ({
  startToggleGoOnMains: (data) => dispatch(startToggleGoOnMains(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Order)