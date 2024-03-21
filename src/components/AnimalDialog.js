/**
* AnimalDialog.js
*
* @2023 Digital Aid Seattle
*/

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';

import { useEffect, useState } from 'react';
import { NewAnimalRecord, animalService } from '../services/AnimalService';

function AnimalDialog(props) {
  const [showDialog, setShowDialog] = useState(false);
  const [record, setRecord] = useState(new NewAnimalRecord({}));

  useEffect(() => {
    setShowDialog(props.visible);
  }, [props]);

  const hideDialog = () => {
    props.onClose(undefined);
  };

  const saveDialog = () => {
    animalService.newRecord(record)
      .then((rec) => props.onClose(rec))
      .catch((err) => props.onClose(null));
  };

  const dialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveDialog} />
    </>
  );

  return (
    <Dialog
      visible={showDialog}
      style={{ width: '650px' }}
      header="Animal Record"
      modal
      className="p-fluid"
      footer={dialogFooter}
      onHide={hideDialog}
    >
      <div className="col-12 md:col-12">
        <div className="card p-fluid">

          <div className="field grid">
            <label htmlFor="name" className="col-12 mb-2 md:col-2 md:mb-0">
              Name
            </label>
            <div className="col-12 md:col-10">
              <InputText id="name" type="text" onChange={(e) => request.name = e.target.value} />
            </div>
          </div>
          <div className="field grid">
            <label htmlFor="email" className="col-12 mb-2 md:col-2 md:mb-0">
              Email
            </label>
            <div className="col-12 md:col-10">
              <InputText id="email" type="text" onChange={(e) => request.email = e.target.value} />
            </div>
          </div>
          <div className="field grid">
            <label htmlFor="phone" className="col-12 mb-2 md:col-2 md:mb-0">
              Phone
            </label>
            <div className="col-12 md:col-10">
              <InputText id="phone" type="text" onChange={(e) => request.phone = e.target.value} />
            </div>
          </div>

          <div className="field grid">
            <label htmlFor="summary" className="col-12 mb-2 md:col-2 md:mb-0">
              Summary
            </label>
            <div className="col-12 md:col-10">
              <InputText id="summary" type="text" onChange={(e) => request.summary = e.target.value} />
            </div>
          </div>
          <div className="field grid">
            <label htmlFor="description" className="col-12 mb-2 md:col-2 md:mb-0">
              Description
            </label>
            <div className="col-12 md:col-10">
              <InputTextarea id="description" type="text" onChange={(e) => request.description = e.target.value} />
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default AnimalDialog;
