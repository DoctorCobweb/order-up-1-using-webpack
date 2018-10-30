import React from 'react'
import uuidv1 from 'uuid/v1'
import CourseItem from './CourseItem'

const Course = (props) => (
  <div>
    <h2>{ props.courseName }</h2>
    { props.courseItems
      .map(courseItem => (
        <CourseItem
          key={ courseItem._doc._id }
          orderId={ props.orderId }
          courseItem={courseItem._doc}
        />
      ))
    }
  </div>
)

export default Course