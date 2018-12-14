import React from 'react'
import Header from '../../../renderer-process/appMain/components/Header'
import AddOrderForm from './AddOrderForm'

export default class AddNewOrder extends React.Component {
  render = () => (
    <div>
      <Header/>
      <AddOrderForm />
    </div>
  )
}