import React from 'react'
import { connect } from 'react-redux'
import { startUpdateItemQuantity, startUpdateItemAndInfoQuantity } from '../../../shared/actions/orders'
import CourseItem from './CourseItem'
import CourseItemInfo from './CourseItemInfo'


export class ContainerCourseItem extends React.Component {
  state = {
    isEditing: false,
    infoIdEditing: undefined
  }

  handleItemQuantityClick = (amount) => {
    // console.log(`handleItemQuantityClick: item _id: ${this.props.courseItem._id} /// amount: ${amount}`)
    const data = {
      orderId: this.props.orderId,
      courseId: this.props.courseId,
      itemId: this.props.courseItem._id,
      amount
    }
    this.props.startUpdateItemQuantity(data)
  }

  handleItemInfoQuantityClick = ({ _id, amount }) => {
    // console.log(`handleItemInfoQuantityClick: info _id is: ${_id} /// amount: ${amount}`)
    const data = {
      orderId: this.props.orderId,
      courseId: this.props.courseId,
      itemId: this.props.courseItem._id,
      infoId: _id,
      amount
    }

    this.props.startUpdateItemAndInfoQuantity(data)
  }

  handleItemInfoLineClick = (e, infoId ) => {
    // console.log('handleItemInfoLineClick')
    // console.log(e.target.value)
    // console.log(infoId)
    // console.log(this.state)
    this.setState(() => ({ isEditing: true, infoIdEditing: infoId }))
  }
  
  handleCancelClick = () => {
    this.setState(() => ({ isEditing: false, infoIdEditing: undefined }))
  }

  // TODO: save the text to db and update redux store via actions
  handleItemInfoLineKeyDown = (e) => {
    console.log('handleItemInfoLineKeyDown')
    if (e.key === 'Enter') {

      // ...a little bit of a gottcha:
      // you need to 'defocus' the textarea field.
      // if you don't, even after the state changes have taken effect,
      // the components dependent on state WONT update (like getting
      // rid of the buttons in CourseItemInfo component)
      e.target.blur()

      // setState is async which means it takes time to change the state.
      // the callback here gets fired AFTER the state changes.
      // putting the console.log() on the line underneath the this.setState() call,
      // outside the callback, will show the yet-to-be-updated state
      this.setState((prevState) => ({
        isEditing: !prevState.isEditing,
        infoIdEditing: undefined 
      }), () => {
        console.log(this.state)
      })
    }
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
            handleItemInfoLineClick = { this.handleItemInfoLineClick }
            isEditing= { this.state.isEditing && this.state.infoIdEditing === info._id }
            handleCancelClick = { this.handleCancelClick }
            handleItemInfoLineKeyDown = { this.handleItemInfoLineKeyDown }
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
