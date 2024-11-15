import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Row } from 'react-bootstrap';
import { useRouter } from 'next/router';
import styles from './_style.module.css';
import { useNavigate } from 'react-router-dom';

import { idToUuid } from '@/utils/helpers/uuid';
import { useTranslation } from 'next-i18next';
import { GetStaticProps } from 'next';
import { getI18nStaticProps } from '@/utils/services/getI18nStaticProps';
import AgGridComponent from '@/components/core-components/AgGridComponent';
import { ColDef } from 'ag-grid-community';
import { RowDoubleClickedEvent } from 'ag-grid-community';// Import Quartz theme CSS
import { faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Patient, samplePatients } from '@/types/patient';
import { useLoading } from '@/context/LoadingContext';

export const getStaticProps: GetStaticProps = getI18nStaticProps();

const PatientIndex: React.FC = () => {
  const { showLoading, hideLoading } = useLoading();
  const { t } = useTranslation('common');
  const router = useRouter();
  // const { id } = router.query;

  // TODO: convert patiend ID selected from the datatable
  // const patientId = 62; // 62: e1195a2c-5150-4173-82e1-e0e6377c086d // Testing purpose
  // let uuid = idToUuid(patientId).toString();
  // console.log("🚀 ~ uuid:", patientId, uuid);
  let uuid;
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [rowData, setRowData] = useState<Patient[]>([]);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);

  useEffect(() => {
    showLoading();
    const fetchCarsData = async () => {
      const rowDataFromApi: Patient[] = samplePatients;
      const columnDefsFromApi: ColDef[] = [
        { headerName: 'Doctor', field: 'doctor', sortable: true, filter: true, resizable: true, width: 250  },
        { headerName: 'ID', field: 'patient_id', sortable: true, filter: true, resizable: true, width: 120 },
        { headerName: 'Name', field: 'display_name', sortable: true, filter: true, resizable: true, width: 300 },
        { headerName: 'Date of Birth', field: 'dob', valueFormatter: (params) => params.value.toLocaleDateString() },
        { headerName: 'Address', field: 'address_1' },
        { headerName: 'Home Phone', field: 'home_phone' },
        { headerName: 'Mobile', field: 'mobile' },
      ];

      setRowData(rowDataFromApi);
      setColumnDefs(columnDefsFromApi);
      setTimeout(() => {
        hideLoading();
      }, 1000);
    };

    fetchCarsData();
  }, []);

  const addNewPatinet = () => {
    router.push('/patient/create'); 
  };

  const editPatinet = () => {
    if (selectedPatient) {
      const patientId = selectedPatient.patient_id;
      uuid = idToUuid(patientId).toString();
      router.push(`/patient/${uuid}`);
    }
  }

  const onRowDoubleClicked = (event: RowDoubleClickedEvent<Patient>): void => {
    if (event.data) {
      const patientId = event.data.patient_id;
      uuid = idToUuid(patientId).toString();
      router.push(`/patient/${uuid}`);
      // Perform additional actions with the row ID
    } else {
      console.error('Row data is undefined');
    }
  };

  const onRowClicked = (event: RowDoubleClickedEvent<Patient>): void => {
    if (event.data) {
      const patientId = event.data;
      setSelectedPatient(patientId)
    }
  };
  

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center">
        <h1 className={`${styles.title} my-3`}>Patient</h1>
        <div className={styles.buttonGroup}>
          <button className={`${styles.btn} btn btn-sm btn-success rounded-0`} onClick={addNewPatinet}>
            <FontAwesomeIcon icon={faPlus} /> Add New</button>
          <button className="btn btn-sm btn-primary rounded-0" onClick={editPatinet}>
            <FontAwesomeIcon icon={faEdit} /> Edit</button>
        </div>
      </div>
      <div>
        <AgGridComponent<Patient>
          rowData={rowData}
          columnDefs={columnDefs}
          onRowDoubleClicked={onRowDoubleClicked}
          onRowClicked={onRowClicked}
          customGridOptions={{ suppressCellSelection: true }}
        />
      </div>
    </div>
  );
};

export default PatientIndex;
