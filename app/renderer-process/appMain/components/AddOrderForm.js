import React from 'react'
import { Formik, Form, Field, ErrorMessage, withFormik } from 'formik'
import * as Yup from 'yup'

// 1. create the UI
// 2. save to mongodb and then updated redux store

export default class AddOrderForm extends React.Component {
  render = () => (
    <div>
      <Formik 
        initialValues={{
          tableNumber: '',
          location: 'RESTAURANT BAR',
          entreeQuantity: '',
          entreeItem: '',
          entreeInformation: '',
          mainQuantity: '',
          mainItem: '',
          mainInformation: '',
          dessertQuantity: '',
          dessertItem: '',
          dessertInformation: '',
        }}
        validate={ values => {
          let errors = {}
          if (!values.tableNumber) {
            errors.tableNumber = 'Required'
          }
          return errors
        }}
        onSubmit={( values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2))
            setSubmitting(false)
          }, 400)
        }}
      >
      { ({ isSubmitting }) => (
        <Form>
          <div>
            <h3>VENUE DETAILS</h3>
            <div>Table Number</div>
            <Field type="text" name="tableNumber" placeholder="Table Number"/>
            <ErrorMessage name="tableNumber" component="div"/>
            <div>Location</div>
            <Field name="location" component="select" label="Location">
              <option value="RESTAURANT BAR">Restaurant</option>
              <option value="TAB BAR">Tab Bar</option>
              <option value="JUKE BAR">Juke Bar</option>
              <option value="SPORTS BAR">Sports Bar</option>
              <option value="GAMING BAR">Gaming</option>
            </Field>
          </div>
          <div>
            <h3>ENTREES</h3>
            <div>Quantity</div>
            <Field type="text" name="entreeQuantity" />
            <ErrorMessage name="entreeQuantity" component="div>"/>
            <div>Item</div>
            <Field type="text" name="entreeItem" />
            <ErrorMessage name="entreeItem" component="div>"/>
            <div>Information</div>
            <Field type="text" name="entreeInformation" />
            <ErrorMessage name="entreeInformation" component="div>"/>
          </div>
          <div>
            <h3>MAINS</h3>
            <div>Quantity</div>
            <Field type="text" name="mainQuantity" />
            <ErrorMessage name="mainQuantity" component="div>"/>
            <div>Item</div>
            <Field type="text" name="mainItem" />
            <ErrorMessage name="mainItem" component="div>"/>
            <div>Information</div>
            <Field type="text" name="mainInformation" />
            <ErrorMessage name="mainInformation" component="div>"/>
          </div>
          <div>
            <h3>DESSERT</h3>
            <div>Quantity</div>
            <Field type="text" name="dessertQuantity" />
            <ErrorMessage name="dessertQuantity" component="div>"/>
            <div>Item</div>
            <Field type="text" name="dessertItem" />
            <ErrorMessage name="dessertItem" component="div>"/>
            <div>Information</div>
            <Field type="text" name="dessertInformation" />
            <ErrorMessage name="dessertInformation" component="div>"/>
          </div>
          <button type="submit" disabled={ isSubmitting }>
            Submit
          </button>
        </Form>
      )}
      </Formik>
    </div>
  )
}