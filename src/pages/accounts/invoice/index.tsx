import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './_style.module.css';
// Translation logic - start
import { GetStaticPaths, GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { getI18nStaticProps } from '@/utils/services/getI18nStaticProps';
import AccountLayout from '@/components/layout/AccountLayout';
import AgGridComponent from '@/components/core-components/AgGridComponent';
import { faPlus, faEdit, faPrint, faSave, faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AccountTable, sampleAccountRecords, TableRow } from '@/types/accounts';
import { ColDef, RowDoubleClickedEvent } from 'ag-grid-community';
import { Patient } from '@/types/patient';
import { idToUuid } from '@/utils/helpers/uuid';
import ModalPopUp from '@/components/core-components/ModalPopUp';
import DynamicForm from '@/components/core-components/DynamicForm';
import { InvoiceFormElements } from '@/data/InvoiceFormElements';
import { Table, Button } from 'react-bootstrap';

export const getStaticProps: GetStaticProps = getI18nStaticProps();
// Translation logic - end

const Invoice: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { id } = router.query;
  let uuid;
  const [selectedPatient, setSelectedAccount] = useState<AccountTable | null>(null);
  const [rowData, setRowData] = useState<AccountTable[]>([]);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    console.log('----samplePatients--->', sampleAccountRecords)
    const fetchCarsData = async () => {
      const rowDataFromApi: AccountTable[] = sampleAccountRecords;
      const columnDefsFromApi: ColDef[] = [
        { headerName: 'Inv.No', field: 'inv_no', sortable: true, filter: true, resizable: true, width: 250  },
        { headerName: 'Date', field: 'inv_date', valueFormatter: (params) => params.value.toLocaleDateString() },
        { headerName: 'Doctor', field: 'doctor_name', sortable: true, filter: true, resizable: true, width: 120 },
        { headerName: 'Patient', field: 'patient_name', sortable: true, filter: true, resizable: true, width: 300 },
        { headerName: 'Bill To', field: 'bill_to' },
        { headerName: 'Amount', field: 'amount' },
        { headerName: 'Balance', field: 'balance' },
      ];

      setRowData(rowDataFromApi);
      setColumnDefs(columnDefsFromApi);
    };

    fetchCarsData();
  }, []);

  const onRowDoubleClicked = (event: RowDoubleClickedEvent<AccountTable>): void => {
    if (event.data) {
      const inv_no = event.data.inv_no;
      console.log("🚀 ~ uuid:onRowDoubleClicked ", inv_no);
    } else {
      console.error('Row data is undefined');
    }
  };

  const onRowClicked = (event: RowDoubleClickedEvent<AccountTable>): void => {
    if (event.data) {
      const patientId = event.data;
      console.log("🚀 ~ onRowClicked:", patientId);
      setSelectedAccount(patientId)
    }
  };


  const handleShow = () => {
    console.log("🚀 ~ handleShow ~ handleShow:", handleShow)
    setShowModal(true)
  };
  const handleClose = () => {
    setShowModal(false)
  };

  const handleCreate = async (values: any) => {
    
  }

  const [rows, setRows] = useState<TableRow[]>([
    { date: '', code: '', procedure: '', quantity: 1, cost: 0, total: 0 },
  ]);

  const handleAddRow = () => {
    setRows([...rows, { date: '', code: '', procedure: '', quantity: 1, cost: 0, total: 0 }]);
  };

  const handleRemoveRow = (index: number) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const handleInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const updatedRows = rows.map((row, i) =>
      i === index ? { ...row, [name]: value } : row
    );
    setRows(updatedRows);
  };

  return (
    <AccountLayout>
      <div className="container-fluid mt-2">
        <div className="d-flex justify-content-between align-items-center">
          <h1 className={`${styles.title} mb-3`}>Invoice</h1>
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
          <AgGridComponent<AccountTable>
            rowData={rowData}
            columnDefs={columnDefs}
            onRowDoubleClicked={onRowDoubleClicked}
            onRowClicked={onRowClicked}
            customGridOptions={{ suppressCellSelection: true }}
          />
        </div>

        {/* ModalPopUp component with custom content */}
        <ModalPopUp
          show={showModal}
          handleClose={handleClose}
          title="Add Invoice"
          sizeElement="custom-modal-width"
          footer={
            <>
              <button type="button" style={{ marginRight: '.5rem' }} className={`btn btn-success`}>
                <FontAwesomeIcon icon={faSave} /> Save & Pay</button>
              <button type="button" style={{ marginRight: '.5rem' }} className={`btn btn-success`}>
                <FontAwesomeIcon icon={faSave} /> Save</button>
              <button type="button" className={`btn btn-warning`} onClick={handleClose}>
                <FontAwesomeIcon icon={faClose} /> Cancel</button>
            </>
          }
        >
          {/* Form content goes here */}
          {/* <div>Modal body text goes here.</div> */}
          <div className="container mt-4">
            <DynamicForm
              formData={InvoiceFormElements}
              onSubmit={handleCreate}
              colClass="col-md-4"
            />
            <div className="container">
              <Table >
                <thead >
                  <tr >
                    <th style={{backgroundColor: '#07839c', color: 'white'}}>Date</th>
                    <th style={{backgroundColor: '#07839c', color: 'white'}}>Code</th>
                    <th style={{backgroundColor: '#07839c', color: 'white'}}>Procedure</th>
                    <th style={{backgroundColor: '#07839c', color: 'white'}}>Quantity</th>
                    <th style={{backgroundColor: '#07839c', color: 'white'}}>Cost</th>
                    <th style={{backgroundColor: '#07839c', color: 'white'}}>Total</th>
                    <th style={{backgroundColor: '#07839c', color: 'white'}}></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="date"
                          name="date"
                          id={`date-${index}`}
                          className="form-control"
                          value={row.date}
                          onChange={(e) => handleInputChange(index, e)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="code"
                          id={`code-${index}`}
                          placeholder="Code"
                          className="form-control"
                          value={row.code}
                          onChange={(e) => handleInputChange(index, e)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="procedure"
                          id={`procedure-${index}`}
                          placeholder="Procedure"
                          className="form-control"
                          value={row.procedure}
                          onChange={(e) => handleInputChange(index, e)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="quantity"
                          id={`quantity-${index}`}
                          className="form-control"
                          value={row.quantity}
                          onChange={(e) => handleInputChange(index, e)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="cost"
                          id={`cost-${index}`}
                          className="form-control"
                          value={row.cost}
                          onChange={(e) => handleInputChange(index, e)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="total"
                          id={`total-${index}`}
                          className="form-control"
                          value={row.total}
                          onChange={(e) => handleInputChange(index, e)}
                        />
                      </td>
                      <td>
                        <Button variant="danger" onClick={() => handleRemoveRow(index)}>
                          ×
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button variant="success" onClick={handleAddRow}>
                Add Row
              </Button>
            </div>
          </div>
        </ModalPopUp>
    </div>
    </AccountLayout>
  );
};

export default Invoice;
