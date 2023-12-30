import React, { Fragment, useEffect, useState } from "react";
import MainNav from "../../layouts/MainNav";
import SubHeader from "../../layouts/SubHeader";
import LabelContainer from "../../layouts/LabelContainer";
import InputContainer from "../../layouts/InputContainer";
import TextAreaContainer from "../../layouts/TextAreaContainer";
import FormSubmitButton from "../../layouts/FormSubmitButton";
import ButtonContainer from "../../layouts/ButtonContainer";
import ConfirmationDialogue from "../../layouts/ConfirmationDialogue";

import RecordsTable from "./RecordsTable";

import {
  getRecords,
  addRecord,
  updateRecord,
  clearCurrentRecord,
  clearErrors,
} from "../../../actions/customerActions";

import {
  showElem,
  hideElem,
  enableElem,
  disableElem,
} from "../../../common functions/helpers";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";

import Color from "../../constants/Colors";
import M from "materialize-css/dist/js/materialize.min.js";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const Customers = (props) => {
  const initialInputs = {
    customer_ID: "",
    name: "",
    email: "",
    phone: ""
  };

  const [record, setRecord] = useState(initialInputs);
  const [formDialog, setFormDialog] = useState(false);

  const { customer_ID, name, email, phone } = record;

  //#region Functions

  const onChange = (e) =>
    setRecord({ ...record, [e.target.name]: e.target.value });

  const [saveChangesDialogue, setSaveChangesDialogue] = useState(false);

  const onDialogClose = () => {
    setSaveChangesDialogue(false);
  };

  const onFormDialogClose = () => {
    setFormDialog(false);
  };

  const onCancel = () => {
    setRecord(initialInputs);
    hideElem("save-btn");
    hideElem("cancel-btn");
    showElem("insert-btn");
    disableElem("name-inp");
    disableElem("email-inp");
    disableElem("phone-inp");
    setFormDialog(false);
  };

  const onEnableForm = () => {
    enableElem("name-inp");
    enableElem("email-inp");
    enableElem("phone-inp");
    hideElem("insert-btn");
    showElem("save-btn");
    showElem("cancel-btn");
    setFormDialog(true);
  };

  const onInsertNew = () => {
    setRecord(initialInputs);
    onEnableForm();
  };

  const onSave = (e) => {
    e.preventDefault();
    setSaveChangesDialogue(true);
  };

  const onConfirm = () => {
    if (current) {
      props.updateRecord(record);
    } else {
      props.addRecord(record);
    }
    setSaveChangesDialogue(false);
  };

  //#endregion

  const { records, current, message, error } = props;

  useEffect(() => {
    props.getRecords();
    onCancel();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (message) {
      M.toast({ html: `${message}` });
      props.clearErrors();
      props.clearCurrentRecord();
    }

    onCancel();

    if (error) {
      M.toast({ html: `${error}` });
      props.clearErrors();
    }

    if (current !== null) {
      setRecord(current);
      onEnableForm();
    }

    // eslint-disable-next-line
  }, [current, message, error]);

  return (
    <Fragment>
      <MainNav selItem={"cus-id"} />
      <div className='main'>
        <div className='row'>
          <SubHeader
            text={"Customers"}
            style={{ textAlign: "left", paddingLeft: "20px" }}
          />
          {/* Table */}
          <div className='row'>
            <div className='col s10 offset-s1'>
              <div id='insert-btn'>
                <ButtonContainer
                  icons={"add"}
                  text={"Insert"}
                  onClick={onInsertNew}
                  style={{
                    backgroundColor: Color.primaryHex,
                    width: "auto",
                    marginTop: '20px'
                  }}
                />
              </div>
              <RecordsTable tbData={records} />
            </div>
          </div>
        </div>
        {/* Save Changes Dialog */}
        <ConfirmationDialogue
          open={saveChangesDialogue}
          onConfirmDialogClose={onDialogClose}
          title='Save Changes'
          content='Are you sure you want to made changes?'
          onConfirm={onConfirm}
        />
      </div>
      {/* Dialog Form */}
      <Dialog
        open={formDialog}
        onClose={onFormDialogClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        disableBackdropClick
        disableEscapeKeyDown 
      >
        <DialogTitle id='alert-dialog-title'>
          {current ? "Update Customer" : "Add Customer"}
        </DialogTitle>
        <form onSubmit={onSave}>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              <div className="row" style={{minWidth: '400px'}}> 
                <LabelContainer name='customer_ID' value={customer_ID} text='ID' />
                <InputContainer
                  id='name-inp'
                  type='text'
                  name='name'
                  value={name}
                  onChange={onChange}
                  text='Name'
                  style={inputStyle}
                  required
                />
                <InputContainer
                  id='email-inp'
                  type='text'
                  name='email'
                  value={email}
                  onChange={onChange}
                  text='email'
                  style={inputStyle}
                  required
                />
                <InputContainer
                  id='phone-inp'
                  type='number'
                  name='phone'
                  value={phone}
                  onChange={onChange}
                  text='phone'
                  style={inputStyle}
                  required
                />
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <FormSubmitButton
              icons={"save"}
              text={"Save"}
              style={{
                backgroundColor: Color.success,
                width: "auto",
              }}
            />
            <ButtonContainer
              icons={"close"}
              text={"Cancel"}
              onClick={onCancel}
              style={{
                backgroundColor: Color.danger,
                width: "auto",
              }}
            />
          </DialogActions>
        </form>
      </Dialog>
    </Fragment>
  );
};

const inputStyle = {
  backgroundColor: "transparent",
  borderStyle: "none",
  borderBottom: "1px solid black",
};

Customers.propTypes = {
  records: PropTypes.object.isRequired,
  current: PropTypes.object.isRequired,
  message: PropTypes.string.isRequired,
  error: PropTypes.object.isRequired,
  getRecords: PropTypes.func.isRequired,
  addRecord: PropTypes.func.isRequired,
  updateRecord: PropTypes.func.isRequired,
  clearCurrentRecord: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  records: state.customers.records,
  current: state.customers.current,
  message: state.customers.message,
  error: state.customers.error,
});

const mapDispatchToProps = (dispatch) => {
  return {
    getRecords: () => dispatch(getRecords()),
    addRecord: (obj) => dispatch(addRecord(obj)),
    updateRecord: (obj) => dispatch(updateRecord(obj)),
    clearCurrentRecord: () => dispatch(clearCurrentRecord()),
    clearErrors: () => dispatch(clearErrors()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Customers);
