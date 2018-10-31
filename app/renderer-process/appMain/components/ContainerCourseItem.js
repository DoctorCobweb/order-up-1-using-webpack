import React from 'react'
import { connect } from 'react-redux'
import { startUpdateInfo } from '../../../shared/actions/orders'
import CourseItem from './CourseItem'
import CourseItemInfo from './CourseItemInfo'
import CourseItemInfoLine from './CourseItemInfoLine'

export class ContainerCourseItem extends React.Component {
  handleCourseItemClick = (val) => {
    // get the _id of Course Item from this.props.item._id
    console.log(`handleCourseItemClick: ${val}`)
  }

  handleCourseItemInfoClick = ({ _id, val}) => {
    console.log(`handleCourseItemInfoClick: info _id: ${_id} /// ${val}`)
  }

  render = () => (
    <div>
      <CourseItem
        name={ this.props.item.name }
        quantity= { this.props.item.quantity }
      />
      <div>
        <button onClick={ () => this.handleCourseItemClick(1) }>+</button>
        <button onClick={ () => this.handleCourseItemClick(-1) } >-</button>
      </div>
      { this.props.item.infos.map(info => 
          <CourseItemInfo
            info={ info }
            handleCourseItemInfoClick={ this.handleCourseItemInfoClick }
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
  blah: (yadda) => dispatch(startUpdateInfo(yadda))
})

export default connect(mapStateToProps, mapDispatchToProps)(ItemContainer)
