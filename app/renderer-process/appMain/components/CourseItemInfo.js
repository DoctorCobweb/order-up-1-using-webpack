import React from 'react'
import CourseInfoLine from './CourseInfoLine'

const makeASingleInfoLine = (line) => (
  <div key={ line._id }>
    <div>{ line.quantity } { line.name }</div>
  </div>
)

const CourseItemInfo = (props) => (
    <div className="item-info">
      { props.info.infoLines.length !==0 
          && 
        props.info.infoLines.map(line => <CourseInfoLine key={ line._doc._id } line={line._doc}/>)
      } 
      <div>------------</div>
    </div>
)

export default CourseItemInfo