import React from 'react'
import { Formik, Form, Field, ErrorMessage, withFormik } from 'formik'
import * as Yup from 'yup'


// TODO !!!
// 1. create the UI
// 2. save to mongodb and then updated redux store

const venueLocations = [
  { value: 'RESTAURANT BAR', label: 'Restaurant' },
  { value: 'TAB BAR', label: 'Tab' },
  { value: 'JUKE BAR', label: 'Juke' },
  { value: 'GAMING BAR', label: 'Gaming' },
  { value: 'SPORTS BAR', label: 'Sports Bar' },
]

const AddOrder = props => {
  const {
    values,
    touched,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
    dirty,
  } = props
  return (
    <form onSubmit={ handleSubmit }>
      <label>Email </label>
      <input
        id="email"
        placeholder="Enter your email"
        type="text"
        value={ values.email }
        onChange={ handleChange }
        onBlur={ handleBlur }
      />
      {
        errors.email && touched.email && (<div>{errors.email}</div>)
      }
      <label>Quantity</label>
      <input 
        id="quantity"
        placeholder="Enter the quantity"
        type="text"
        value={ values.quantity }
        onChange={ handleChange }
        onBlur={ handleBlur }
      />
      <label>Item</label>
      <input 
        id="item"
        placeholder="Enter the item"
        type="text"
        value={ values.item }
        onChange={ handleChange }
        onBlur={ handleBlur }
      />
      <button
        type="button"
        onClick={ handleReset }
        disabled={ !dirty || isSubmitting }
      >
        Reset
      </button>
      <button
        type="submit"
        disabled={ isSubmitting }
      >
        Submit
      </button>
    </form>
  )
}

const EnhancedAddOrder = withFormik({
  mapPropsToValues: () => ({ email: '', quantity: '', item: ''}),

  //custom sync validation
  validate: values => {
    let errors = {}
    if (!values.email) {
      errors.email = 'Required'
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
        values.email
      )
    ) {
      errors.email = 'Invalid email address';
    }
    return errors;
  },

  handleSubmit: (values, { setSubmitting }) => {
    setTimeout(() => {
      alert(JSON.stringify(values, null, 2))
      setSubmitting(false)
    }, 2000)
  },

  displayName: 'AddOrder'


})(AddOrder)


export default EnhancedAddOrder