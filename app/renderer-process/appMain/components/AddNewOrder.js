import React from 'react'
import Header from '../../../renderer-process/appMain/components/Header'
import AddOrderForm from './AddOrderForm'
import { connect, getIn } from 'formik'

export default class AddNewOrder extends React.Component {
  render = () => (
    <div>
      <Header/>
      <BlahConnected/>
      <AddOrderForm/>
    </div>
  )
}

const Blah = props => {
  console.log('props.formik')
  console.log(props.formik)
  return (
    <div>
      <div> some location: { props.formik.values }</div>
    </div>
  )
}

const BlahConnected = connect(Blah)