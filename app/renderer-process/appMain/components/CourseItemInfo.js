import React from 'react'
import CourseItemInfoLine from './CourseItemInfoLine'


const CourseItemInfo = (props) => (
    <div className={ props.info.quantity <= 0 ? "item-info item-info-completed" : "item-info" }>
      <div className="item-info__container">
        <div className="item-info__quantity">{ props.info.quantity }</div>
        <div className="item-info__lines">
          { props.info.infoLines.length !==0 
              && 
            props.info.infoLines.map(line => 
              <CourseItemInfoLine 
                key={ line._id }
                infoId={ props.info._id }
                line={ line }
                handleItemInfoLineClick={ props.handleItemInfoLineClick }
                isEditing={ props.isEditing && props.editingInfoLineId === line._id }
                handleItemInfoLineKeyDown={ props.handleItemInfoLineKeyDown }
                editingLineContent={ props.editingLineContent }
              />
            )
          } 
          {
            props.displayNewInfoLine
              &&
            <input
              onChange={ (e) => props.handleNewItemInfoLineClick(e, props.info._id) }
              onFocus={ (e) => props.handleNewItemInfoLineClick(e, props.info._id) }
              onKeyDown={ (e) => props.handleNewItemInfoLineKeyDown(e, props.info._id) }
            />
          }
          { props.showEditButtons
              &&
            <div className="container--button--infoline">
              <button
                className="button--infoline"
                onClick={ (e) => props.handleAddNewInfoLine(e, props.info._id) }
              >
                Add new line
              </button>
              <button
                className="button--infoline"
                onClick={ props.handleCancelClick }
              >
                X
              </button>
            </div>
          }
        </div>
      </div>
      <div className="button__stack">
        <button
          className="button-button__stack"
          onClick={ () => props.handleItemInfoQuantityClick({ _id: props.info._id, amount: 1 }) }
        >
          +
        </button>
        <button
          className="button-button__stack"
          onClick={ () => props.handleItemInfoQuantityClick({ _id: props.info._id, amount: -1 }) }
        >
          -
        </button>
      </div>
    </div>
)

export default CourseItemInfo