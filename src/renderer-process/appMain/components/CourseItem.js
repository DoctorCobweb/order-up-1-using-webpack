import React from 'react'
import uuidv1 from 'uuid/v1'
import CourseItemInfo from './CourseItemInfo'

const CourseItem = (props) => (
  <div key={uuidv1()}>
    <h4 className="course-item">{ props.courseItem.quantity } { props.courseItem.name }</h4>
    { props.courseItem.info.length !== 0
      &&
      props.courseItem.info.map(itemInfo => <CourseItemInfo key={uuidv1()} itemInfo={itemInfo}/>)
    }
  </div>
)

export default CourseItem
