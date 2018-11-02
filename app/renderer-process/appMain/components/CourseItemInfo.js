import React from 'react'
import CourseItemInfoLine from './CourseItemInfoLine'


const CourseItemInfo = (props) => (
    <div className="item-info">
      <div>info quantity: { props.info.quantity }</div>
      { props.info.infoLines.length !==0 
          && 
        props.info.infoLines.map(line => <CourseItemInfoLine key={ line._id } line={ line }/>)
      } 
      <div>
        <button onClick={ () => props.handleItemInfoQuantityClick({ _id: props.info._id, amount:1 }) }>+</button>
        <button onClick={ () => props.handleItemInfoQuantityClick({ _id: props.info._id, amount:-1 }) }>-</button>
      </div>
    </div>
)

export default CourseItemInfo