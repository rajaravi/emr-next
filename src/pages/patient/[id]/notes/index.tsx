import React, { useEffect, useRef, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import styles from './_style.module.css';
import { execute_axios_get, execute_axios_post } from '@/utils/services/httpService';
import { ColDef, RowClickedEvent, RowDoubleClickedEvent } from 'ag-grid-community';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faPrint, faSave, faClose, faSearch, faCheck } from '@fortawesome/free-solid-svg-icons';

import ModalPopUp from '@/components/core-components/ModalPopUp';
import AgGridComponent from '@/components/core-components/AgGridComponent';
import DynamicForm, { DynamicFormHandle } from '@/components/core-components/DynamicForm';
import PatientLayout from '@/components/layout/PatientLayout';

import { InvoiceFormElements } from '@/data/InvoiceFormElements';
import { NotesModel, NotesTable, sampleNotesRecords } from '@/types/notes';

import { Patient } from '@/types/patient';
import { idToUuid } from '@/utils/helpers/uuid';
import { EMR_CONFIG } from '@/utils/constants/config'

// Translation logic - start
import { GetStaticPaths, GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { getI18nStaticProps } from '@/utils/services/getI18nStaticProps';
import OffcanvasComponent from '@/components/core-components/OffcanvasComponent';
import { NotesFormElements } from '@/data/NotesFormElements';
import ToastNotification from '@/components/core-components/ToastNotification';
import { useLoading } from '@/context/LoadingContext';


export const getStaticProps: GetStaticProps = getI18nStaticProps();
export const getStaticPaths: GetStaticPaths = async () => {
  // Hardcode some IDs
  const paths = [
    { params: { id: '1' } },
    { params: { id: '2' } },
    { params: { id: '3' } },
  ];

  return {
    paths,
    fallback: true, // or 'blocking'
  };
};
// Translation logic - end

const initialFormData: NotesModel = {
  date: new Date(),
  status: '',
  notes: '',
};

const initialValues = {
  status: [],
  date: '1989-11-19',
  notes: ''
};

const Invoice: React.FC = () => {
  const { showLoading, hideLoading } = useLoading();
  const { t } = useTranslation('common');
  const router = useRouter();
  const { id } = router.query;

  const [rowData, setRowData] = useState<NotesTable[]>([]);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);
  const [formData, setFormData] = useState<NotesModel>(initialFormData);
  const [show, setShow] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'primary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'>('primary');

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  // Function to handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index?: number) => {
    // setFormReset(false); // block form reset
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  // Save button handler
  const handleSave = async () => {
    showLoading();
    // Implement your save logic here
    console.log('Form saved:', formData);
    handleShowToast('Notes saved successfully!', 'success');

    try {
      const response = await execute_axios_post('/api/updateNotes', formData);
      console.log(response.data.message); // Display success message or handle success
    } catch (error) {
      console.error('Error updating notes:', error);
    } finally {
      setTimeout(() => {
        hideLoading();
      }, 2000);
    }
    handleClose(); // Close offcanvas after saving
  };

  const handleShowToast = (message: string, color: typeof toastColor) => {
    setToastMessage(message);
    setToastColor(color);
    setShowToast(true);
  };

  useEffect(() => {
    const fetchAccountData = async () => {
      const rowDataFromApi: NotesTable[] = sampleNotesRecords;
      const columnDefsFromApi: ColDef[] = [
        { headerName: 'Date', field: 'date', valueFormatter: (params) => params.value.toLocaleDateString() },
        { headerName: 'Notes', field: 'notes',  width: 1000 },
        // { headerName: 'Patient', field: 'patient_name', sortable: true, filter: true, resizable: true, width: 300 },
      ];

      setRowData(rowDataFromApi);
      setColumnDefs(columnDefsFromApi);
    };

    fetchAccountData();
  }, []);

  const onInvoiceDoubleClicked = (event: RowDoubleClickedEvent<NotesTable>): void => {
    if (event.data) {
      const notes_id = event.data.notes_id;
      console.log("🚀 ~ uuid:onInvoiceDoubleClicked ", notes_id);
    } else {
      console.error('Row data is undefined');
    }
  };

  const onInvoiceClicked = (event: RowDoubleClickedEvent<NotesTable>): void => {
    if (event.data) {
      console.log("🚀 ~ onInvoiceClicked:", event.data);
    }
  };


  return (
    <>
      <PatientLayout patientId={id as string}>
        <div className="container-fluid mt-2">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className={`${styles.title} mb-3`}>Notes</h1>
            <div className={styles.buttonGroup}>
              <button className={`${styles.btn} btn btn-success`} onClick={handleShow}>
                <FontAwesomeIcon icon={faPlus} /> Add New</button>
              <button className={`${styles.btn} btn btn-primary`}>
                <FontAwesomeIcon icon={faEdit} /> Edit</button>
              <button className="btn btn-info">
                <FontAwesomeIcon icon={faPrint} /> Print</button>
            </div>
          </div>
        <div>
          <AgGridComponent<NotesTable>
            rowData={rowData}
            columnDefs={columnDefs}
            onRowDoubleClicked={onInvoiceDoubleClicked}
            onRowClicked={onInvoiceClicked}
            customGridOptions={{ suppressCellSelection: true }}
          />
          <OffcanvasComponent show={show} title={'Add Notes'} handleClose={handleClose} onSave={handleSave} size="50%">
            <DynamicForm
              formData={NotesFormElements}
              initialValues={initialValues}
              modelFormInputs={handleInputChange}
              colClass="col-md-12"
              isEditMode={true} />
          </OffcanvasComponent>
          <ToastNotification
            show={showToast}
            message={toastMessage}
            position='top-end'
            color={toastColor}
            onClose={() => setShowToast(false)}
          />
        </div>
      </div>
      </PatientLayout>
    </>
  );
};

export default Invoice;
