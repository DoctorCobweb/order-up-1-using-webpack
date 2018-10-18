import React from 'react'
import Modal from 'react-modal'
import { connect } from 'react-redux'

const OrderModal = (props) => (
  <Modal
    isOpen={!!props.selectedOrder}
    // for when user presses 'esc' or clicks background to close modal:
    onRequestClose={props.handleClearSelectedOrder}
    contentLabel="Selected Option"
    closeTimeoutMS={200}
    className="modal"
    ariaHideApp={false} // see https://github.com/reactjs/react-modal/tree/master/docs/accessibility
  >
    <div>
      <h3 >Selected Order</h3>
      <p>Order number: TODO</p>
    </div>
  </Modal>

) 

// USE SELECTOR to get the order corresponding to selectedOption
const mapStateToProps = (state) => ({
  orders: state
})

export default connect(mapStateToProps, null)(OrderModal)
