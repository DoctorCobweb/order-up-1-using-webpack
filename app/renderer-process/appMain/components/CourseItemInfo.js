import React from 'react'
import CourseItemInfoLine from './CourseItemInfoLine'

const CourseItemInfo = (props) => (
    <div className="item-info">
      <div>TODO: quantity val derived from infolines</div>
      { props.info.infoLines.length !==0 
          && 
        props.info.infoLines.map(line => <CourseItemInfoLine key={ line._id } line={line}/>)
      } 
      <div>
        <button onClick={ () => props.handleCourseItemInfoClick({_id: props.info._id, val:1}) }>+</button>
        <button onClick={ () => props.handleCourseItemInfoClick({_id: props.info._id, val:-1}) }>-</button>
      </div>
      <div>------------</div>
    </div>
)

export default CourseItemInfo