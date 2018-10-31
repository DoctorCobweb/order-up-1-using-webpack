import React from 'react'
import CourseItemInfoLine from './CourseItemInfoLine'

const CourseItemInfo = (props) => (
    <div className="item-info">
      { props.info.infoLines.length !==0 
          && 
        props.info.infoLines.map(line => <CourseItemInfoLine key={ line._id } line={line}/>)
      } 
      <div>------------</div>
    </div>
)

export default CourseItemInfo