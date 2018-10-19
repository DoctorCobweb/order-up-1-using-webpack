import React from 'react'
import { connect } from 'react-redux'
import Course from './Course'

export default class Order extends React.Component {
  render() {
    return (
      <div>
        <h2>{ this.props.order.metaData.location}</h2>
        <h5>{ this.props.order.metaData.orderTakenUsing}</h5>
        <h5>Clerk: { this.props.order.metaData.clerk}</h5>
        <h5>{ this.props.order.metaData.orderSentAt}</h5>
        <h2>{ this.props.order.metaData.tableNumber}</h2>
        { Object.keys(this.props.order.meals)
            .map(courseName => (
              <Course
                key={ courseName }
                courseName={ courseName }
                courseItems={ this.props.order.meals[courseName] }
              />
            )
          )
        }
      </div>
    )
  }
}