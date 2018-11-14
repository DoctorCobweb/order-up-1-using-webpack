import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import Course from './Course'
import { findOrder, sortCoursesInOrder } from '../../../shared/selectors/orders'
import { startToggleGoOnMains } from '../../../shared/actions/orders'
import { history } from '../../../shared/routers/AppRouter'

export class Order extends React.Component { 

  handleGoOnMainsClick = (e) => {
    // playing around with history functionality
    // history.push('/test')
    this.props.startToggleGoOnMains({
      orderId: this.props.orderId
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
            Order sent at: { moment(this.props.order.orderSentAt).format("DD/MM/YYYY HH:mm:ss") }
          </div>
          <div>
            Order received at: { moment(this.props.order.orderReceivedAt).format("DD/MM/YYYY HH:mm:ss") }
          </div>
          { this.props.order.goOnMains ? 
            <button className="button button--hold-course" onClick={ this.handleGoOnMainsClick }>Hold Mains</button>
            :
            <button className="button button--go-on-course" onClick={ this.handleGoOnMainsClick }>Go on Mains</button>
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
              />)
            )
        }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  order: findOrder(state.orders, ownProps.orderId)
})

const mapDispatchToProps = (dispatch) => ({
  startToggleGoOnMains: (data) => dispatch(startToggleGoOnMains(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(Order)