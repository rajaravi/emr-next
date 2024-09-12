import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './_style.module.css';
// Translation logic - start
import { GetStaticPaths, GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { getI18nStaticProps } from '@/utils/services/getI18nStaticProps';
import SettingLayout from '@/components/layout/SettingLayout';
import AgGridComponent from '@/components/core-components/AgGridComponent';
import { ColDef, RowDoubleClickedEvent } from 'ag-grid-community';
import { faPlus, faEdit, faPrint, faSave, faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DoctorTable, sampleDoctors } from '@/types/doctor';

export const getStaticProps: GetStaticProps = getI18nStaticProps();
// Translation logic - end
export interface DoctorTable {
  name: string;
  speciality: Date;
  contact_name: string;
  contact_no: string;
}

const Doctor: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { id } = router.query;
  const [selectedPatient, setSelectedAccount] = useState<DoctorTable | null>(null);
  const [rowData, setRowData] = useState<DoctorTable[]>([]);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);

  useEffect(() => {
    const fetchCarsData = async () => {
      const rowDataFromApi: DoctorTable[] = sampleDoctors;
      const columnDefsFromApi: ColDef[] = [
        { headerName: 'ID', field: 'doctor_id', width: 100 },
        { headerName: 'Name', field: 'name', sortable: true, filter: true, resizable: true, width: 300  },        
        { headerName: 'Speciality', field: 'speciality', width: 300 },
        { headerName: 'Contact Name', field: 'contact_name', sortable: true, filter: true, resizable: true, width: 250 },
        { headerName: 'Contact No.', field: 'contact_no', sortable: true, filter: true, resizable: true, width: 250 },
      ];

      setRowData(rowDataFromApi);
      setColumnDefs(columnDefsFromApi);
    };

    fetchCarsData();
  }, []);

  const onRowDoubleClicked = (event: RowDoubleClickedEvent<DoctorTable>): void => {
    if (event.data) {
      // const inv_no = event.data.inv_no;
      // console.log("🚀 ~ uuid:onRowDoubleClicked ", inv_no);
    } else {
      console.error('Row data is undefined');
    }
  };

  const onRowClicked = (event: RowDoubleClickedEvent<DoctorTable>): void => {
    if (event.data) {
      // const patientId = event.data;
      // console.log("🚀 ~ onRowClicked:", patientId);
      // setSelectedAccount(patientId)
    }
  };

  return (
    <SettingLayout>
        <div className="d-flex justify-content-between align-items-center">
          <h1 className={`${styles.title} mb-3`}>{t('SETTING.SIDE_MENU.DOCTOR')}</h1>
          <div className={styles.buttonGroup}>
            <a className={`${styles.btn} text-dark mx-3 text-decoration-none btn btn-sm border-0`}>
              <FontAwesomeIcon icon={faEdit} /> Edit
            </a>
            <button className={`${styles.btn} btn btn-sm btn-success rounded-0`}>
              <FontAwesomeIcon icon={faPlus} /> Add New
            </button>
            
          </div>
        </div>
        <div>
          <AgGridComponent<DoctorTable>
            rowData={rowData}
            columnDefs={columnDefs}
            onRowDoubleClicked={onRowDoubleClicked}
            onRowClicked={onRowClicked}
            customGridOptions={{ suppressCellSelection: true }}
          />
        </div>
    </SettingLayout>
  );
};

export default Doctor;
