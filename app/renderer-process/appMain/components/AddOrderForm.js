import React from 'react'
import moment from 'moment'
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik'
import * as Yup from 'yup'
import { menuItems } from '../../../main-process/knuckle-dragger/menu-constants'

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
              <Field name="metaData['location']" component="select">
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
                            <Field name={`meals['ENTREES DINNER'].${index}.quantity`} placeholder="quantity" />
                            <Field name={`meals['ENTREES DINNER'].${index}.name`} component="select" placeholder="name">
                              { menuItems.map(item => <option value={item}>{item}</option>) }
                            </Field>
                            <Field name={`meals['ENTREES DINNER'].${index}.info`} placeholder="info" />
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


            <div>
              <h3>MAINS</h3>
              <FieldArray
                name="meals['MAINS DINNER']"
                render={ arrayHelpers => (
                  <div>
                    { values.meals['MAINS DINNER'] && values.meals['MAINS DINNER'].length > 0
                      ?
                        (values.meals['MAINS DINNER'].map((entree, index) => (
                          <div key={ index }>
                            <Field name={`meals['MAINS DINNER'].${index}.quantity`} placeholder="quantity" />
                            <Field name={`meals['MAINS DINNER'].${index}.name`} component="select" placeholder="name">
                              { menuItems.map(item => <option value={item}>{item}</option>) }
                            </Field>
                            <Field name={`meals['MAINS DINNER'].${index}.info`} placeholder="info" />
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
                            Add a main 
                          </button>
                        )
                    }
                  </div>
                )}
              />
            </div>


            <div>
              <h3>DESSERTS</h3>
              <FieldArray
                name="meals['DESSERT']"
                render={ arrayHelpers => (
                  <div>
                    { values.meals['DESSERT'] && values.meals['DESSERT'].length > 0
                      ?
                        (values.meals['DESSERT'].map((entree, index) => (
                          <div key={ index }>
                            <Field name={`meals['DESSERT'].${index}.quantity`} placeholder="quantity" />
                            <Field name={`meals['DESSERT'].${index}.name`} component="select" placeholder="name">
                              { menuItems.map(item => <option value={item}>{item}</option>) }
                            </Field>
                            <Field name={`meals['DESSERT'].${index}.info`} placeholder="" />
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
                            Add a dessert 
                          </button>
                        )
                    }
                  </div>
                )}
              />
            </div>


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