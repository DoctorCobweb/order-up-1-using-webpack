import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik'
import Select from 'react-select'
import CreatableSelect from 'react-select/lib/Creatable'
import * as Yup from 'yup'
import { menuItems } from '../../../main-process/knuckle-dragger/menu-constants'
// import { startAddOrderToList } from '../../../shared/actions/lists'
import { addToMongoDB } from '../../../shared/db-utils/mongoose-orders'
// 1. create the UI
// 2. save to mongodb and then updated redux store

const mockOrder = {
  "metaData": {
    "orderTakenUsing": "OrderUp",
    "clerk": "chef",
    "orderSentAt": "",
    "variableContent": [],
    "tableNumber": "123",
    "customerName": "kitchen",
    "covers": "",
    "location": "JUKE BAR",
    "goOnMains": false
  },
  "meals": {
    "ENTREES DINNER": [
      {
        "quantity": 2,
        "name": "CHILDS FISH",
        "info": [
          [
            {"quantity": 1, "info": "EX CHEESE"},
            {"quantity": 1, "info": "NO PEPPER"},
            {"quantity": 1, "info": "ADD JALEPENOS"}
          ]
        ]
      },
      {"quantity": 4, "name": "BRUSCHETTA", "info": []}
    ],
    "MAINS DINNER": [
      {"quantity": 1, "name": "WEDGES", "info": []},
      {
        "quantity": 3,
        "name": "BEEF BURGER",
        "info": [
          [
            {"quantity": 1, "info": "MED RARE"},
            {"quantity": 1, "info": "MUSH"},
            {"quantity": 1, "info": "CHIPS GREENS"},
            {"quantity": 1, "info": "XTRA GARLIC BUTT"}
          ]
        ]
      }
    ],
    "DESSERT": [
      {"quantity": 1, "name": "SENIOR PUDDING", "info": []},
      {
        "quantity": 3,
        "name": "CARAMEL TOPPING",
        "info": [
          [
            {"quantity": 1, "info": "WITH SORBET INSTEAD"},
            {"quantity": 1, "info": "EX COLD"},
            {"quantity": 1, "info": "SPRINKLES O/S"}
          ],
          [
            {"quantity": 1, "info": "LEMON SCE"},
            {"quantity": 1, "info": "EX SCOOP"}
          ]
        ]
      }
    ]
  }
} 

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]

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
    orderTakenUsing: Yup.string(),
    clerk: Yup.string(),
    orderSentAt: Yup.string(),
    variableContent: Yup.array(),
    tableNumber: Yup.string(),
    customerName: Yup.string(),
    location: Yup.string(),
    goOnMains: Yup.boolean(),
  }),
  meals: Yup.object().shape({
    'ENTREES DINNER': Yup.array(),
    'MAINS DINNER': Yup.array(),
    'DESSERT': Yup.array(),
  }),
  topics: Yup.array(),
})

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
          topics: [],
        }}
        // validationSchema={orderValidationSchema}
        onSubmit={( values, { setSubmitting }) => {

          values.metaData.orderSentAt = moment()

          mockOrder.metaData.orderSentAt = moment()

          // DEMO this here
          // this.props.startAddOrderToList(mockOrder)
          addToMongoDB(null, mockOrder)

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
              <LocationSelect
                value={ values.metaData.location }
                onChange={ setFieldValue }
                onBlur={ setFieldTouched }
                touched={ touched.location }
              />
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
                        (
                          <div>
                            {
                              values.meals['ENTREES DINNER'].map((entree, index) => (
                                <div key={ index }>
                                  <Field name={`meals['ENTREES DINNER'].${index}.quantity`} placeholder="quantity" />
                                  <MenuItemSelect
                                    value={ values.meals['ENTREES DINNER'][index].name}
                                    onChange={ setFieldValue }
                                    onBlur={ setFieldTouched }
                                    touched={ touched[`meals['ENTREES DINNER'].${index}.name`]}
                                    index={ index }
                                    options={ menuItemsOptions }
                                    course={ 'ENTREES DINNER' }
                                  />
                                  <Field name={`meals['ENTREES DINNER'].${index}.info`} placeholder="info" />
                                  <button
                                    type="button"
                                    onClick={ () => arrayHelpers.remove(index) } // remove an entree from the list
                                  >
                                    -
                                  </button>
                                </div>
                                )
                              )
                            }
                            <button
                              type="button"
                              onClick={ () => arrayHelpers.push('') } 
                            >
                              +
                            </button>
                          </div>
                        )
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
                        (
                          <div>
                            {
                              values.meals['MAINS DINNER'].map((entree, index) => (
                                <div key={ index }>
                                  <Field name={`meals['MAINS DINNER'].${index}.quantity`} placeholder="quantity" />
                                  <MenuItemSelect
                                    value={ values.meals['MAINS DINNER'][index].name}
                                    onChange={ setFieldValue }
                                    onBlur={ setFieldTouched }
                                    touched={ touched[`meals['MAINS DINNER'].${index}.name`]}
                                    index={ index }
                                    options={ menuItemsOptions }
                                    course={ 'MAINS DINNER' }
                                  />
                                  <Field name={`meals['MAINS DINNER'].${index}.info`} placeholder="info" />
                                  <button
                                    type="button"
                                    onClick={ () => arrayHelpers.remove(index) } // remove an main from the list
                                  >
                                    -
                                  </button>
                                </div>
                                )
                              )
                            }
                            <button
                              type="button"
                              onClick={ () => arrayHelpers.push('') } 
                            >
                              +
                            </button>
                          </div>
                        )
                      :
                        (
                          <button type="button" onClick={ () => arrayHelpers.push('') }>
                            Add an main
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
                        (
                          <div>
                            {
                              values.meals['DESSERT'].map((entree, index) => (
                                <div key={ index }>
                                  <Field name={`meals['DESSERT'].${index}.quantity`} placeholder="quantity" />
                                  <MenuItemSelect
                                    value={ values.meals['DESSERT'][index].name}
                                    onChange={ setFieldValue }
                                    onBlur={ setFieldTouched }
                                    touched={ touched[`meals['DESSERT'].${index}.name`]}
                                    index={ index }
                                    options={ menuItemsOptions }
                                    course={ 'DESSERT' }
                                  />
                                  <Field name={`meals['DESSERT'].${index}.info`} placeholder="info" />
                                  <button
                                    type="button"
                                    onClick={ () => arrayHelpers.remove(index) } // remove an dessert from the list
                                  >
                                    -
                                  </button>
                                </div>
                                )
                              )
                            }
                            <button
                              type="button"
                              onClick={ () => arrayHelpers.push('') } 
                            >
                              +
                            </button>
                          </div>
                        )
                      :
                        (
                          <button type="button" onClick={ () => arrayHelpers.push('') }>
                            Add an dessert 
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
