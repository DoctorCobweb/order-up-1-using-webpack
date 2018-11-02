import React from 'react'
import { connect } from 'react-redux'
import { startUpdateItemQuantity, startUpdateItemAndInfoQuantity } from '../../../shared/actions/orders'
import CourseItem from './CourseItem'
import CourseItemInfo from './CourseItemInfo'


export class ContainerCourseItem extends React.Component {

  handleItemQuantityClick = (amount) => {
    console.log(`handleItemQuantityClick: item _id: ${this.props.courseItem._id} /// amount: ${amount}`)
    const data = {
      orderId: this.props.orderId,
      courseId: this.props.courseId,
      itemId: this.props.courseItem._id,
      amount
    }
    this.props.startUpdateItemQuantity(data)
  }

  handleItemInfoQuantityClick = ({ _id, amount }) => {
    console.log(`handleItemInfoQuantityClick: info _id is: ${_id} /// amount: ${amount}`)

    // update the item quantity first
    // console.log('updating the item quantity first before adjusting info document')
    // this.handleItemQuantityClick(amount)

    const data = {
      orderId: this.props.orderId,
      courseId: this.props.courseId,
      itemId: this.props.courseItem._id,
      infoId: _id,
      amount
    }

    this.props.startUpdateItemAndInfoQuantity(data)
  }

  render = () => (
    <div className="container-course">
      <CourseItem
        name={ this.props.courseItem.name }
        quantity={ this.props.courseItem.quantity }
        handleItemQuantityClick={ this.handleItemQuantityClick }
      />
      { this.props.courseItem.infos.map(info => 
          <CourseItemInfo
            key={ info._id }
            info={ info }
            handleItemInfoQuantityClick={ this.handleItemInfoQuantityClick }
          />
        )
      }
    </div>
  )
}

const mapStateToProps = (state) => ({
  orders: state
})

const mapDispatchToProps = (dispatch) => ({
  startUpdateItemQuantity: (data) => dispatch(startUpdateItemQuantity(data)),
  startUpdateItemAndInfoQuantity: (data) => dispatch(startUpdateItemAndInfoQuantity(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ContainerCourseItem)
