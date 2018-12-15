import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import _ from 'lodash'
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik'
import Select from 'react-select'
import CreatableSelect from 'react-select/lib/Creatable'
import * as Yup from 'yup'
import { menuItems } from '../../../main-process/knuckle-dragger/menu-constants'
// import { startAddOrderToList } from '../../../shared/actions/lists'
import { addToMongoDB } from '../../../shared/db-utils/mongoose-orders'
// 1. create the UI
// 2. save to mongodb and then updated redux store

const locationOptions = [
  { value: 'RESTAURANT BAR', label: 'Restaurant' },
  { value: 'TAB BAR', label: 'Tab Bar' },
  { value: 'JUKE BAR', label: 'Juke' },
  { value: 'SPORTS BAR', label: 'Sports Bar' },
  { value: 'GAMING BAR', label: 'Gaming' },
]

const menuItemsOptions = menuItems.map(item => ({value: item, label: item}))

const orderValidationSchema = Yup.object().shape({
  metaData: Yup.object().shape({
    orderTakenUsing: Yup.string().required('Required'),
    clerk: Yup.string().required('Required'),
    orderSentAt: Yup.string().required('Required'),
    variableContent: Yup.array(),
    tableNumber: Yup.string().required('Required'),
    customerName: Yup.string(),
    covers: Yup.number().required('Required'),
    location: Yup.string().required('Required'),
    goOnMains: Yup.boolean(),
  }),
  meals: Yup.object().shape({
    'ENTREES DINNER': Yup.array().of(Yup.object().shape({
      'info': Yup.string(),
      'quantity': Yup.string().required('Required'),
      'name': Yup.object().shape({
        'label': Yup.string().required('Required'),
        'value': Yup.string().required('Required'),
      })
    }).nullable().required('Required')),
    'MAINS DINNER': Yup.array(),
    'DESSERT': Yup.array(),
  }),
  topics: Yup.array(),
})

export default class AddOrderForm extends React.Component {
  state = {
    goOnMains: false,
  }

  render = () => (
    <div className="add-order-form__container">
      <Formik 
        initialValues={{
          metaData: {
            orderTakenUsing: 'OrderUp',
            clerk: 'chef',
            orderSentAt: '',
            variableContent: [],
            tableNumber: '',
            customerName: 'kitchen',
            covers: '',
            location: '',
            goOnMains: false,
          },
          meals: {
            'ENTREES DINNER': [],
            'MAINS DINNER': [],
            'DESSERT': [],
          },
        }}
        validationSchema={ orderValidationSchema }
        onSubmit={( values, { setSubmitting }) => {

          const order = _.cloneDeep(values)
          order.metaData.orderSentAt = moment()
          order.metaData.location = order.metaData.location.value

          let covers = 0

          order.meals = _.reduce(order.meals, (acc, courseItems, course) => {
            acc[course] = _.filter(
              _.map(courseItems, (item, idx) => {
                  if (!item) return
                  return {
                    quantity: item.quantity,
                    name: item.name.value,
                    info: [ [ {quantity: 1, info: item.info } ] ]
                  }
                }
              ),
              filterItem => {
                  if (filterItem !== undefined) {
                    covers++
                    return true
                  } else {
                    return false
                  }
                }
            )
            return acc
          }, {})

          order.metaData.covers = covers

          console.log('order')
          console.log(order)

          addToMongoDB(order)

          // this is where we save the order to mongodb and redux
          setTimeout(() => {
            // alert(JSON.stringify(values, null, 2))
            alert(JSON.stringify(order, null, 2))
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
            <div className="add-order-form__section-container">
              <div
                className="add-order-form__submit-container"
              >
                <button
                  className="button"
                  type="submit"
                  disabled={ isSubmitting }
                >
                  Add Order
                </button>
              </div>
              <h3>VENUE DETAILS</h3>
              <div>Table Number</div>
              <Field
                className="add-order-form-input"
                type="text"
                name="metaData.tableNumber"
                placeholder="Table Number"
              />

              { console.log(errors['metaData.tableNumber']) }
              { console.log(touched['metaData.tableNumber']) }

              { touched.metaData && touched.metaData.tableNumber && errors.metaData && errors.metaData.tableNumber && <p>{ errors.metaData.tableNumber }</p> }
              <div>Location</div>
              <LocationSelect
                value={ values.metaData.location }
                onChange={ setFieldValue }
                onBlur={ setFieldTouched }
                touched={ touched.location }
              />
              { touched.metaData && touched.metaData.location && errors.metaData && errors.metaData.location && <p>{ errors.metaData.location }</p> }
              <div>
                <div>Hold mains?</div>
                <button
                  className={ this.state.goOnMains ? "button button-add-order-form--not-active" : "button button--green" } 
                  type="button"
                  onClick={ () => {

                    if (!this.state.goOnMains) {
                      return 
                    }

                    values.metaData.goOnMains = false
                    this.setState(() => ({
                      goOnMains: false,
                    }))
                  }}
                >
                  Yes
                </button>
                <button
                  className={ this.state.goOnMains ? "button button--green": "button button-add-order-form--not-active"} 
                  type="button"
                  onClick={ () => {

                    if (this.state.goOnMains) {
                      return
                    } 

                    values.metaData.goOnMains = true
                    this.setState(() => ({
                      goOnMains: true,
                    }))
                  }}
                >
                  No
                </button>
              </div>
            </div>
            <div className="add-order-form__section-container">
              <h3>ENTREES</h3>
              <FieldArray
                name="meals['ENTREES DINNER']"
                render={ arrayHelpers => (
                  <div>
                    { values.meals['ENTREES DINNER'] && values.meals['ENTREES DINNER'].length > 0
                      ?
                        (
                          <div>
                            {
                              values.meals['ENTREES DINNER'].map((entree, index) => (
                                <div
                                  className="add-order-form__item-container"
                                  key={ index }
                                >
                                  { console.log(touched) }
                                  { console.log(errors) }
                                  <Field
                                    className="add-order-form-input"
                                    name={`meals['ENTREES DINNER'].${index}.quantity`}
                                    placeholder="Quantity"
                                  />

                                  { 
                                    /*
                                    touched.meals &&
                                    touched.meals['ENTREES DINNER'] &&
                                    touched.meals['ENTREES DINNER'][index] &&
                                    errors.meals &&
                                    errors.meals['ENTREES DINNER'] &&
                                    errors.meals['ENTREES DINNER'][index] &&
                                    <p>Cannot have an empty item. Please remove this item by pressing on red cross</p> 
                                    */
                                  }

                                  <MenuItemSelect
                                    value={ values.meals['ENTREES DINNER'][index].name}
                                    onChange={ setFieldValue }
                                    onBlur={ setFieldTouched }
                                    touched={ touched[`meals['ENTREES DINNER'].${index}.name`]}
                                    index={ index }
                                    options={ menuItemsOptions }
                                    course={ 'ENTREES DINNER' }
                                  />
                                  <Field
                                    className="add-order-form-input"
                                    name={`meals['ENTREES DINNER'].${index}.info`}
                                    placeholder="Info"
                                  />
                                  <div
                                    className="add-order-form__remove-item-container"
                                  >
                                    <button
                                      className="button button--red"
                                      type="button"
                                      onClick={ () => arrayHelpers.remove(index) } // remove an entree from the list
                                    >
                                      X
                                    </button>
                                  </div>
                                </div>
                                )
                              )
                            }
                            <button
                              className="button button--green"
                              type="button"
                              onClick={ () => arrayHelpers.push('') } 
                            >
                              +
                            </button>
                          </div>
                        )
                      :
                        (
                          <button
                            className="button button--green"
                            type="button"
                            onClick={ () => arrayHelpers.push('') }>
                            Add an entree
                          </button>
                        )
                    }
                  </div>
                )}
              />
            </div>
            <div className="add-order-form__section-container">
              <h3>MAINS</h3>
              <FieldArray
                name="meals['MAINS DINNER']"
                render={ arrayHelpers => (
                  <div>
                    { values.meals['MAINS DINNER'] && values.meals['MAINS DINNER'].length > 0
                      ?
                        (
                          <div>
                            {
                              values.meals['MAINS DINNER'].map((entree, index) => (
                                <div
                                  className="add-order-form__item-container"
                                  key={ index }
                                >
                                  <Field
                                    className="add-order-form-input"
                                    name={`meals['MAINS DINNER'].${index}.quantity`}
                                    placeholder="Quantity"
                                  />
                                  <MenuItemSelect
                                    value={ values.meals['MAINS DINNER'][index].name}
                                    onChange={ setFieldValue }
                                    onBlur={ setFieldTouched }
                                    touched={ touched[`meals['MAINS DINNER'].${index}.name`]}
                                    index={ index }
                                    options={ menuItemsOptions }
                                    course={ 'MAINS DINNER' }
                                  />
                                  <Field
                                    className="add-order-form-input"
                                    name={`meals['MAINS DINNER'].${index}.info`}
                                    placeholder="Info"
                                  />
                                  <div
                                    className="add-order-form__remove-item-container"
                                  >
                                    <button
                                      className="button button--red"
                                      type="button"
                                      onClick={ () => arrayHelpers.remove(index) } // remove an main from the list
                                    >
                                      X
                                    </button>
                                  </div>
                                </div>
                                )
                              )
                            }
                            <button
                              className="button button--green"
                              type="button"
                              onClick={ () => arrayHelpers.push('') } 
                            >
                              +
                            </button>
                          </div>
                        )
                      :
                        (
                          <button
                            className="button button--green"
                            type="button"
                            onClick={ () => arrayHelpers.push('') }>
                            Add a main
                          </button>
                        )
                    }
                  </div>
                )}
              />
            </div>
            <div className="add-order-form__section-container">
              <h3>DESSERTS</h3>
              <FieldArray
                name="meals['DESSERT']"
                render={ arrayHelpers => (
                  <div>
                    { values.meals['DESSERT'] && values.meals['DESSERT'].length > 0
                      ?
                        (
                          <div>
                            {
                              values.meals['DESSERT'].map((entree, index) => (
                                <div
                                  className="add-order-form__item-container"
                                  key={ index }
                                >
                                  <Field
                                    className="add-order-form-input"
                                    name={`meals['DESSERT'].${index}.quantity`}
                                    placeholder="Quantity"
                                  />
                                  <MenuItemSelect
                                    value={ values.meals['DESSERT'][index].name}
                                    onChange={ setFieldValue }
                                    onBlur={ setFieldTouched }
                                    touched={ touched[`meals['DESSERT'].${index}.name`]}
                                    index={ index }
                                    options={ menuItemsOptions }
                                    course={ 'DESSERT' }
                                  />
                                  <Field
                                    className="add-order-form-input"
                                    name={`meals['DESSERT'].${index}.info`}
                                    placeholder="Info"
                                  />
                                  <div
                                    className="add-order-form__remove-item-container"
                                  >
                                    <button
                                      className="button button--red"
                                      type="button"
                                      onClick={ () => arrayHelpers.remove(index) } // remove an dessert from the list
                                    >
                                      X
                                    </button>
                                  </div>
                                </div>
                                )
                              )
                            }
                            <button
                              className="button button--green"
                              type="button"
                              onClick={ () => arrayHelpers.push('') } 
                            >
                              +
                            </button>
                          </div>
                        )
                      :
                        (
                          <button
                            className="button button--green"
                            type="button"
                            onClick={ () => arrayHelpers.push('') }>
                            Add a dessert 
                          </button>
                        )
                    }
                  </div>
                )}
              />
            </div>


          </Form>
        )}
      />
    </div>
  )
}


class LocationSelect extends React.Component {
  handleChange = (newValue, actionMeta) => {
    console.group('Location Value Changed')
    console.log(newValue)
    console.log(`action: ${actionMeta.action}`)
    console.groupEnd()
    
    // this is going to call setFieldValue and manually update values.metaData.location
    this.props.onChange('metaData.location', newValue)
  }
  handleInputChange = (inputValue, actionMeta) => {
    console.group('Location Input Changed')
    console.log(inputValue)
    console.log(`action: ${actionMeta.action}`)
    console.groupEnd()

    // this is going to call setFieldTouched and manually update values.metaData.location 
    this.props.onBlur('metaData.location', true)
  }
  render = () => (
    <Select
      isClearable 
      options={ locationOptions }
      onChange={ this.handleChange }
      onInputChange={ this.handleInputChange }
      value={ this.props.value}
    />
  )
}

class MenuItemSelect extends React.Component {
  handleChange = (newValue, actionMeta) => {
    console.group('Entree Value Changed')
    console.log(newValue)
    console.log(`action: ${actionMeta.action}`)
    console.groupEnd()
    
    // this is going to call setFieldValue and manually update eg values.meals['ENTREES DINNER'].${index}.name
    this.props.onChange(`meals[${this.props.course}].${this.props.index}.name`, newValue)
  }
  handleInputChange = (inputValue, actionMeta) => {
    console.group('Entree Input Changed')
    console.log(inputValue)
    console.log(`action: ${actionMeta.action}`)
    console.groupEnd()

    // this is going to call setFieldTouched and manually update eg. values.meals['ENTREES DINNER'].${index}.name
    this.props.onBlur(`meals[${this.props.course}].${this.props.index}.name`, true)
  }
  render = () => (
    <CreatableSelect
      isClearable 
      options={ this.props.options }
      onChange={ this.handleChange }
      onInputChange={ this.handleInputChange }
      value={ this.props.value }
    />
  )

}

// const mapStateToProps = (state) => ({
//   lists: state.lists,
//   priorities: state.priorities,
// })

// const mapDispatchToProps = (dispatch) => ({
//   startAddOrderToList: (data) => dispatch(startAddOrderToList(data)),
// })

// export default connect(mapStateToProps, mapDispatchToProps)(AddOrderForm)
