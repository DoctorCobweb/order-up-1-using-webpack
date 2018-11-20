import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import ContainerCourseItem from './ContainerCourseItem'
import { startAddNewInfo } from '../../../shared/actions/lists'

export class Course extends React.Component {
  state = {
    itemIdToEdit: undefined
  }
  handleAddNewInfo = (courseId, courseName, itemName, itemId) => {
    this.setState(() => ({
      itemIdToEdit: itemId
    }))
  }

  handleCancelAddInfoClick = () => {
    this.setState(() => ({
      itemIdToEdit: undefined
    }))
  }

  handleSaveAddInfoClick = (infoQuantity, infoName, itemId) => {
    console.log(`${infoQuantity} ${infoName}`)

    const data = {
      orderId: this.props.orderId,
      courseId: this.props.courseId,
      itemId,
      quantity: infoQuantity,
      name: infoName,
    }
    this.props.startAddNewInfo(data, () => {
      // call this after successfully saving new info
      this.setState(() => ({
        itemIdToEdit: undefined
      }))
    })
  }

  render = () => (
    <div>
      <h2
        className="heading"
      >
        { this.props.courseName }

        { 
          this.props.courseName === 'MAINS DINNER' &&  this.props.goOnMains ?
            ` AWAY @${moment(this.props.goOnMainsStartedAt).format("HH:mm")}`
             :
            ''
        }
        { 
          this.props.courseName === 'MAINS DINNER' &&  !this.props.goOnMains ?
            ` (HOLD)`
             :
            ''
        }
        { 
          this.props.courseName === 'BAR MEALS' &&  this.props.goOnMains ?
            ` AWAY @${moment(this.props.goOnMainsStartedAt).format("HH:mm")}`
             :
            ''
        }
        { 
          this.props.courseName === 'BAR MEALS' &&  !this.props.goOnMains ?
            ` (HOLD)`
             :
            ''
        }
      </h2>
      { this.props.courseItems.map(courseItem => (
          <ContainerCourseItem
            key={ courseItem._id }
            orderId={ this.props.orderId }
            courseItem={ courseItem }
            courseName = { this.props.courseName }
            courseId={ this.props.courseId }
            handleAddNewInfo = { this.handleAddNewInfo }
            showAddNewInfo = { this.state.itemIdToEdit === courseItem._id }
            handleCancelAddInfoClick = { this.handleCancelAddInfoClick }
            handleSaveAddInfoClick = { this.handleSaveAddInfoClick }
          />
        ))
      }
    </div>
  )
}

const mapStateToProps = (state, ownProps) => ({
  // TODO?
})

const mapDispatchToProps = (dispatch) => ({
  startAddNewInfo: (data, cb) => dispatch(startAddNewInfo(data, cb))
})

export default connect(mapStateToProps, mapDispatchToProps)(Course)