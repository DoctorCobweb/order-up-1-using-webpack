import React from 'react'
import moment from 'moment'
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik'
import * as Yup from 'yup'

// 1. create the UI
// 2. save to mongodb and then updated redux store

export default class AddOrderForm extends React.Component {
  render = () => (
    <div>
      <Formik 
        initialValues={{
          metaData: {
            orderTakenUsing: 'OrderUp',
            clerk: 'chef',
            orderSentAt: '',
            variableContent: [],
            tableNumber: undefined,
            customerName: 'kitchen',
            covers: undefined,
            location: undefined,
            goOnMains: false,
          },
          meals: {
            'ENTREES DINNER': [],
            'MAINS DINNER': [],
            'DESSERT': [],
          },
        }}
        validate={ values => {
          let errors = {}
          // if (!values.metaData.tableNumber) {
          //   errors.metaData.tableNumber = 'Required'
          // }
          return errors
        }}
        onSubmit={( values, { setSubmitting }) => {

          values.metaData.orderSentAt = moment()

          // this is where we save the order to mongodb and redux
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2))
            setSubmitting(false)
          }, 400)
        }}
        // render props
        render={({
          // just writing out all props to see what we can use...
          dirty,
          errors,
          handleBlur,
          handleChange,
          handleReset,
          handleSubmit,
          isSubmitting,
          isValid,
          isValidating,
          resetForm,
          setErrors,
          setFieldError,
          setFieldTouched,
          submitForm,
          submitCount,
          setFieldValue,
          setStatus,
          setSubmitting,
          setTouched,
          setValues,
          status,
          touched,
          values,
          validateForm,
          validateField,
        }) => (
          <Form>
            <div>
              <h3>VENUE DETAILS</h3>
              <div>Table Number</div>
              <Field type="text" name="metaData.tableNumber" placeholder="Table Number"/>
              {/* <ErrorMessage name="metaData.tableNumber" component="div"/> */}
              <div>Location</div>
              <Field name="metaData.location" component="select" label="Location">
                <option value="RESTAURANT BAR">Restaurant</option>
                <option value="TAB BAR">Tab Bar</option>
                <option value="JUKE BAR">Juke Bar</option>
                <option value="SPORTS BAR">Sports Bar</option>
                <option value="GAMING BAR">Gaming</option>
              </Field>
              <button
                type="button"
                onClick={ () => values.metaData.goOnMains = false }
              >
                Hold Mains
              </button>
              <button
                type="button"
                onClick={ () => values.metaData.goOnMains = true }
              >
                Dont Hold Mains
              </button>
            </div>
            <div>
              <h3>ENTREES</h3>
              <FieldArray
                name="meals['ENTREES DINNER']"
                render={ arrayHelpers => (
                  <div>
                    { values.meals['ENTREES DINNER'] && values.meals['ENTREES DINNER'].length > 0
                      ?
                        (values.meals['ENTREES DINNER'].map((entree, index) => (
                          <div key={ index }>
                            <Field name={`meals['ENTREES DINNER'].${index}`} />
                            <button
                              type="button"
                              onClick={ () => arrayHelpers.remove(index) } // remove an entree from the list
                            >
                              -
                            </button>
                            <button
                              type="button"
                              onClick={ () => arrayHelpers.insert(index, '') } // insert an empty entree at this position
                            >
                              +
                            </button>
                          </div>
                        )))
                      :
                        (
                          <button type="button" onClick={ () => arrayHelpers.push('') }>
                            Add an entree
                          </button>
                        )
                    }
                  </div>
                )}
              />
            </div>
            {/* 
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
            */}
            <button
              className="button"
              type="submit"
              disabled={ isSubmitting }
            >
              Submit
            </button>
          </Form>
        )}
      />
    </div>
  )
}