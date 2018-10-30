import React from 'react'
import { connect } from 'react-redux'
import uuidv1 from 'uuid/v1'
import CourseItemInfo from './CourseItemInfo'
import { updateOrder } from '../../../shared/actions/orders'


// const CourseItem = (props) => (
export class CourseItem extends React.Component {

  updateCourseItem = (increment) => {
    console.log(`updateCourseItem: increment ${increment} for orderId: ${this.props.orderId}`)

    // TODO: handle the updating
    // dispatch the increment to update the order using orderId
    this.props.updateOrder(this.props.orderId, {blah: 'yadda'} )
  }
  render = () => (
    <div className="course-item">
      <button onClick={ () => { this.updateCourseItem(1) } }>+</button>
      <button onClick={ () => { this.updateCourseItem(-1) } }>-</button>
      <h4>{ this.props.courseItem.quantity } { this.props.courseItem.name }</h4>
      { this.props.courseItem.infos.length !== 0
        &&
        this.props.courseItem.infos.map(info => <CourseItemInfo key={ info._doc._id } info={info._doc}/>)
      }
    </div>
  )
}

// USE SELECTOR to get the order corresponding to selectedOption
// const mapStateToProps = (state) => ({
//   orders: state
// })

const mapDispatchToProps = (dispatch) => ({
  updateOrder: (id, updates) => dispatch(updateOrder)

})

export default connect(null, mapDispatchToProps)(CourseItem)
