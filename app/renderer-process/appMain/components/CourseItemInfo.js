import React from 'react'
import InfoLine from './InfoLine'

const makeASingleInfoLine = (line) => (
  <div key={ line._id }>
    <div>{ line.quantity } { line.name }</div>
  </div>
)

const CourseItemInfo = (props) => (
    <div className="item-info">
      { props.info.infoLines.length !==0 
          && 
        props.info.infoLines.map(line => <InfoLine key={ line._id } line={line}/>)
      } 
      <div>------------</div>
    </div>
)

export default CourseItemInfo