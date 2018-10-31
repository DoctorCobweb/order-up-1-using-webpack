import React from 'react'
import ContainerCourseItem from './ContainerCourseItem'

const Course = (props) => (
  <div>
    <h2>{ props.courseName }</h2>
    { props.courseItems.map(courseItem => (
        <ContainerCourseItem
          key={ courseItem._id }
          orderId={ props.orderId }
          courseItem={ courseItem }
        />
      ))
    }
  </div>
)

export default Course