import React from 'react'
import { connect } from 'react-redux'
import { startUpdateInfo } from '../../../shared/actions/orders'
import CourseItem from './CourseItem'
import CourseItemInfo from './CourseItemInfo'

export class ContainerCourseItem extends React.Component {
  handleCourseItemClick = (val) => {
    console.log(`handleCourseItemClick: item _id: ${this.props.courseItem._id} /// value: ${val}`)
  }

  handleCourseItemInfoClick = ({ _id, val}) => {
    console.log(`handleCourseItemInfoClick: info _id is: ${_id} /// value: ${val}`)
  }
  calculateItemInfoQuantity = (info) => {
    const eachLinesQuantity = info.infoLines.map(infoLine => infoLine.quantity)
    // IMPORTANT ASSUMPTION on how to calc the quantity of an info section:
    // use the minimum val in eachLinesQuantity for 
    // the info's quantity.
    // this has consequences for the UI interaction when infoLines array
    // has variable quantity: 
    // ["1 tomato sce", "1 ex. lettuce", "2 med rare"]
    //  => should the quantity be 1 or 2?? 
    //  => assume that each info pertains to *one* of the meals
    //     if there is variable quantities.
    //
    // if all the infoLines have a quantity of (say) 2 then 
    // we get quantity of 2:
    // ["2 med rare", "ex. mush sce"]
    // => quantity should be 2 even though it's in a single info section
    const quantity = Math.min(...eachLinesQuantity)
    // console.log(`the caclulated info quantity: ${quantity}`)
    return quantity 
  }

  render = () => (
    <div>
      <CourseItem
        name={ this.props.courseItem.name }
        quantity={ this.props.courseItem.quantity }
        handleCourseItemClick={ this.handleCourseItemClick }
      />
      { this.props.courseItem.infos.map(info => 
          <CourseItemInfo
            key={ info._id }
            info={ info }
            handleCourseItemInfoClick={ this.handleCourseItemInfoClick }
            calculatedItemInfoQuantity={ this.calculateItemInfoQuantity(info) }
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

export default connect(mapStateToProps, mapDispatchToProps)(ContainerCourseItem)
