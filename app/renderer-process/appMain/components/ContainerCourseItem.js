import React from 'react'
import { connect } from 'react-redux'
import {
  startUpdateItemQuantity,
  startUpdateItemAndInfoQuantity,
  startUpdateInfoLine
} from '../../../shared/actions/orders'
import CourseItem from './CourseItem'
import CourseItemInfo from './CourseItemInfo'


export class ContainerCourseItem extends React.Component {
  state = {
    isEditing: false,
    editingInfoId: undefined,
    editingInfoLineId: undefined,
    editingLineContent: undefined
  }

  // ---- HANDLING VARIOUS QUANTITY-BUTTON CLICKS ----------
  handleItemQuantityClick = (amount) => {
    const data = {
      orderId: this.props.orderId,
      courseId: this.props.courseId,
      itemId: this.props.courseItem._id,
      amount
    }
    this.props.startUpdateItemQuantity(data)
  }

  handleItemInfoQuantityClick = ({ _id, amount }) => {
    const data = {
      orderId: this.props.orderId,
      courseId: this.props.courseId,
      itemId: this.props.courseItem._id,
      infoId: _id,
      amount
    }

    this.props.startUpdateItemAndInfoQuantity(data)
  }

  // ---- HANDLING INFO-LINES EDITING/ADDING ----------
  handleItemInfoLineClick = (e, infoId, infoLineId) => {
    e.persist()
    this.setState(() => ({
      isEditing: true,
      editingInfoId: infoId,
      editingInfoLineId: infoLineId,
      editingLineContent: e.target.value
    }), () => {
      // console.log(this.state)
    })
  }
  
  handleCancelClick = () => {
    this.setState(() => ({
      isEditing: false,
      editingInfoId: undefined,
      editinInfoLineId: undefined,
      editingLineContent: undefined
    }))
  }

  // TODO: when we have Enter pressed: save the text to db and update redux store via actions
  handleItemInfoLineKeyDown = (e, infoId, infoLineId) => {
    console.log('handleItemInfoLineKeyDown')

    e.persist()

    if (e.key === 'Enter') {

      // ...a little bit of a gottcha:
      // you need to 'defocus' the textarea field.
      // if you don't, even after the state changes have taken effect,
      // the components dependent on state WONT update (like trying to get
      // rid of the buttons in CourseItemInfo component when editing is done)
      e.target.blur()

      // got to sanitize the data
      let updatedInfoLine = e.target.value
        .slice()
        .trim()
        .toUpperCase()
        .split(/\s+/)

      console.log(updatedInfoLine)

      // is the content is empty and the user tried to save, prevent that
      // from going any further
      if (!updatedInfoLine[0]) return

      let updatedInfoLineQuantity
      let updatedInfoLineName

      if ( updatedInfoLine.length > 0 && !(isNaN(parseInt(updatedInfoLine[0]))) ) {
        // there is a valid number at the start of the infoline
        updatedInfoLineQuantity = updatedInfoLine[0]
        // assume the rest of the array comprises the infoline's name
        updatedInfoLineName = updatedInfoLine.slice(1).join(' ')
      } else {
        // there is no valid number at start. we NEED to have a number
        // no less that 1 for the quantity because of how we calculate
        // the item info quantity when parsing a new order (in mongoose-orders.js)
        // for a given info, the algo looks at all its infoline quantities ,
        // then and selects the minimum of these to be the quantity for the *info* item:
        updatedInfoLineQuantity = 1
        updatedInfoLineName = updatedInfoLine.join(' ')

      }

      // procedure:
      // 1. save new item infoline value to mongodb, async action
      // 2. upon success, update redux via new action
      // 3. the order should now refresh and the infoline should show 
      //    the new value via props.line.name field
      // 4. then you should setState to stuff below
      this.props.startUpdateInfoLine({
        orderId: this.props.orderId,
        courseId: this.props.courseId,
        itemId: this.props.courseItem._id,
        infoId,
        infoLineId,
        quantity: updatedInfoLineQuantity,
        name: updatedInfoLineName,
      }, () => {
        // use a callback-style structure for resetting the state after the 
        // update was successful. if you call it immediately outside a callback
        // then UI jumps back to previous un-edited name for a short amount of
        // time whilst db/redux update and hence update UI to show new updated value.
        // setState is async which means it takes time to change the state.
        // the callback here gets fired AFTER the state changes.
        // putting the console.log() on the line underneath the this.setState() call,
        // outside the callback, will show the yet-to-be-updated state
        this.setState((prevState) => ({
          isEditing: false,
          editingInfoId: undefined,
          editingInfoLineId: undefined,
          editingLineContent: undefined
        }))
      })
    } else {
      // user is still typing away their updates
      this.setState(() => ({ editingLineContent: e.target.value }))
    }
  }

  //TODO
  handleAddNewInfoLine = () => {

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
            handleCancelClick = { this.handleCancelClick }
            handleItemInfoLineKeyDown = { this.handleItemInfoLineKeyDown }
            handleAddNewInfoLine = { this.handleAddNewInfoLine }
            showEditButtons = { this.state.editingInfoId === info._id }
            editingInfoLineId = { this.state.editingInfoLineId }
            editingLineContent = { this.state.editingLineContent }
            isEditing = { this.state.isEditing }
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
  startUpdateInfoLine: (data, cb) => dispatch(startUpdateInfoLine(data, cb)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ContainerCourseItem)
