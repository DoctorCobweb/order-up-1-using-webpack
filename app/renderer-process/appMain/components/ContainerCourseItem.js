import React from 'react'
import { connect } from 'react-redux'
import { startUpdateItemQuantity } from '../../../shared/actions/orders'
import CourseItem from './CourseItem'
import CourseItemInfo from './CourseItemInfo'


export class ContainerCourseItem extends React.Component {

  handleItemQuantityClick = (amount) => {
    console.log(`handleItemQuantityClick: item _id: ${this.props.courseItem._id} /// amount: ${amount}`)
    const data = {
      orderId: this.props.orderId,
      itemId: this.props.courseItem._id,
      amount
    }
    this.props.startUpdateItemQuantity(data)
  }

  handleItemInfoQuantityClick = ({ _id, val}) => {
    console.log(`handleItemInfoQuantityClick: info _id is: ${_id} /// value: ${val}`)
    // TODO
    // call async action creator here
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
  startUpdateItemQuantity: (_id, amount) => dispatch(startUpdateItemQuantity(_id, amount)),
  // startUpdateItemInfo: (_id, ) => dispatch(startUpdateInfo(yadda))
})

export default connect(mapStateToProps, mapDispatchToProps)(ContainerCourseItem)
