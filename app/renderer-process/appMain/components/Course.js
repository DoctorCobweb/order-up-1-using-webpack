import React from 'react'
import uuidv1 from 'uuid/v1'
import CourseItem from './CourseItem'

const Course = (props) => (
  <div key={props.courseId}>
    <h2>{ props.courseName }</h2>
    { props.courseItems
      .map(courseItem => (
        <CourseItem
          ItemId={courseItem._id}
          orderId={ props.orderId }
          courseItem={courseItem}
        />
      ))
    }
  </div>
)

export default Course