import React from 'react'
import { connect } from 'react-redux'
import { startUpdateItemQuantity, startUpdateItemAndInfoQuantity } from '../../../shared/actions/orders'
import CourseItem from './CourseItem'
import CourseItemInfo from './CourseItemInfo'


export class ContainerCourseItem extends React.Component {
  state = {
    editingInfoId: undefined,
    editingInfoLineId: undefined,
    editingLineContent: undefined
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

  handleItemInfoLineClick = (e, infoId, infoLineId ) => {
    e.persist()
    // console.log('handleItemInfoLineClick')
    // console.log(e.target.value)
    // console.log(infoId)
    // console.log(this.state)
    this.setState(() => ({
      editingInfoId: infoId,
      editingInfoLineId: infoLineId,
      editingLineContent: e.target.value
    }), () => {
      console.log(this.state)
    })
  }
  
  handleCancelClick = () => {
    this.setState(() => ({
      editingInfoId: undefined,
      editinInfoLineId: undefined,
      editingLineContent: undefined
    }))
  }

  // TODO: when we have Enter pressed: save the text to db and update redux store via actions
  handleItemInfoLineKeyDown = (e) => {
    console.log('handleItemInfoLineKeyDown')

    e.persist()

    if (e.key === 'Enter') {

      // ...a little bit of a gottcha:
      // you need to 'defocus' the textarea field.
      // if you don't, even after the state changes have taken effect,
      // the components dependent on state WONT update (like getting
      // rid of the buttons in CourseItemInfo component)
      e.target.blur()

      // got to sanitize the data
      let newLineArray = e.target.value
        .slice()
        .trim()
        .toUpperCase()
        .split(/\s+/)

      // if ( newLineArray.length > 0 && isNaN(parseInt(newLineArray[0]))) {

      // } else {

      // }



      // procedure:
      // 1. save new item infoline value to mongodb, async action
      // 2. upon success, update redux via new action
      // 3. the order should now refresh and the infoline should show 
      //    the new value via props.line.name field
      // 4. then you should setState to stuff below



      // setState is async which means it takes time to change the state.
      // the callback here gets fired AFTER the state changes.
      // putting the console.log() on the line underneath the this.setState() call,
      // outside the callback, will show the yet-to-be-updated state
      this.setState((prevState) => ({
        editingInfoId: undefined,
        editingInfoLineId: undefined,
        editingLineContent: undefined

      }), () => {
        console.log(this.state)
      })
    } else {
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
            isEditing = { this.state.editingInfoId === info._id }
            editingInfoLineId = { this.state.editingInfoLineId }
            editingLineContent = { this.state.editingLineContent }
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
