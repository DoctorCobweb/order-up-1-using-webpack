import React from 'react'
import { connect } from 'react-redux'
import CourseItem from './CourseItem'
import CourseItemInfo from './CourseItemInfo'
import AddInfo from './AddInfo'
import {
  startUpdateItemQuantity,
  startUpdateItemAndInfoQuantity,
  startUpdateInfoLine,
  startAddNewInfoLine,
} from '../../../shared/actions/lists'


export class ContainerCourseItem extends React.Component {
  state = {
    isUpdating: false,
    editingInfoId: undefined,
    editingInfoLineId: undefined,
    editingLineContent: "",
    displayNewInfoLine: false,
    infoIdForNewInfoLine: undefined,
    newInfoLineContent: "",
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
      isUpdating: true,
      editingInfoId: infoId,
      editingInfoLineId: infoLineId,
      editingLineContent: e.target.value,
      infoIdForNewInfoLine: undefined
    }), () => {
      // console.log(this.state)
    })
  }
  
  handleCancelClick = () => {
    this.setState(() => ({
      isUpdating: false,
      editingInfoId: undefined,
      editinInfoLineId: undefined,
      editingLineContent: "",
      infoIdForNewInfoLine: undefined
    }))
  }

  handleItemInfoLineKeyDown = (e, infoId, infoLineId) => {
    console.log('handleItemInfoLineKeyDown')

    // in react we have synthetic events, and they are pooled. ie. the synthetic event object
    // is reused and all properties will be nullified after the event callback has been invoked.
    // (performance reasons)
    // => cannot access the event in an async way.
    // if we need to access the even properties in an async way, we should call
    // .persist() on the event. this removes the event from the pool and allows for reference to
    // the event to be retained by user code.
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
          isUpdating: false,
          editingInfoId: undefined,
          editingInfoLineId: undefined,
          editingLineContent: "" 
        }))
      })
    } else {
      // user is still typing away their updates
      this.setState(() => ({ editingLineContent: e.target.value }))
    }
  }

  //TODO: finish
  handleAddNewInfoLine = (e, infoId) => {
    console.log('TODO: create a new infoline')
    this.setState(() => ({
      displayNewInfoLine: true,
      infoIdForNewInfoLine: infoId
    }))

  }

  handleNewItemInfoLineClick = (e, infoId) => {
    e.persist()

    // anything  TODO here??
    console.log(infoId)
  }

  handleNewItemInfoLineKeyDown = (e, infoId) => {
    e.persist()
    if (e.key === 'Enter') {
      e.target.blur()
      let newInfoLine = e.target.value
        .slice()
        .trim()
        .toUpperCase()
        .split(/\s+/)

      console.log('user hit enter...')
      console.log(newInfoLine)
      console.log(`infoId: ${infoId}`)

      // is the content is empty and the user tried to save, prevent that
      // from going any further
      if (!newInfoLine[0]) return

      let newInfoLineQuantity
      let newInfoLineName

      if ( newInfoLine.length > 0 && !(isNaN(parseInt(newInfoLine[0]))) ) {
        // there is a valid number at the start of the infoline
        newInfoLineQuantity = newInfoLine[0]
        // assume the rest of the array comprises the infoline's name
        newInfoLineName = newInfoLine.slice(1).join(' ')
      } else {
        // there is no valid number at start. we NEED to have a number
        // no less that 1 for the quantity because of how we calculate
        // the item info quantity when parsing a new order (in mongoose-orders.js)
        // for a given info, the algo looks at all its infoline quantities ,
        // then and selects the minimum of these to be the quantity for the *info* item:
        newInfoLineQuantity = 1
        newInfoLineName = newInfoLine.join(' ')
      }

      // 1. now we have the new stuff to go and save a new info item.
      // 2. create new InfoItem
      // 3. assign it to the infolines array of the associated info using the infoId
      // 4. update the order in the state
      this.props.startAddNewInfoLine({
        orderId: this.props.orderId,
        courseId: this.props.courseId,
        itemId: this.props.courseItem._id,
        infoId,
        quantity: newInfoLineQuantity,
        name: newInfoLineName,
      }, () => {
        this.setState(() => ({
          isUpdating: false,
          editingInfoId: undefined,
          editingInfoLineId: undefined,
          editingLineContent: "",

          displayNewInfoLine: false,
          infoIdForNewInfoLine: undefined,
          newInfoLineContent: "" 
        }))
      })
    } else {
      this.setState(() => ({
        newInfoLineContent: e.target.value
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
            handleCancelClick = { this.handleCancelClick }
            handleItemInfoLineKeyDown = { this.handleItemInfoLineKeyDown }
            handleAddNewInfoLine = { this.handleAddNewInfoLine }
            showEditButtons = { this.state.editingInfoId === info._id }
            editingInfoLineId = { this.state.editingInfoLineId }
            editingLineContent = { this.state.editingLineContent }
            isUpdating = { this.state.isUpdating }
            displayNewInfoLine = { this.state.displayNewInfoLine && this.state.infoIdForNewInfoLine === info._id}
            handleNewItemInfoLineClick = { this.handleNewItemInfoLineClick }
            handleNewItemInfoLineKeyDown = { this.handleNewItemInfoLineKeyDown }
          />
        )
      }

      {
        this.props.showAddNewInfo
        ?
        ""
        :
        <button
          className="button--info"
          onClick={ () => 
            this.props.handleAddNewInfo(
              this.props.courseId,
              this.props.courseName,
              this.props.courseItem.name,
              this.props.courseItem._id
            )
          }
        >
          + Add new info
        </button>
      }
      {
        this.props.showAddNewInfo
        ?
        <AddInfo
          handleCancelAddInfoClick = { this.props.handleCancelAddInfoClick }
          handleSaveAddInfoClick = { this.props.handleSaveAddInfoClick }
          itemId={ this.props.courseItem._id }
        />
        :
        ""
      }
    </div>
  )
}

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = (dispatch) => ({
  startUpdateItemQuantity: (data) => dispatch(startUpdateItemQuantity(data)),
  startUpdateItemAndInfoQuantity: (data) => dispatch(startUpdateItemAndInfoQuantity(data)),
  startUpdateInfoLine: (data, cb) => dispatch(startUpdateInfoLine(data, cb)),
  startAddNewInfoLine: (data, cb) => dispatch(startAddNewInfoLine(data, cb))
})

export default connect(mapStateToProps, mapDispatchToProps)(ContainerCourseItem)
