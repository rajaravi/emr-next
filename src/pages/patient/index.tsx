import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { execute_axios_post } from '@/utils/services/httpService';
import { Button, Row, Col, Dropdown } from 'react-bootstrap';
import ENDPOINTS from '@/utils/constants/endpoints';
import styles from './_style.module.css';
import { idToUuid } from '@/utils/helpers/uuid';
// Translation logic - start
import { useTranslation } from 'next-i18next';
import { GetStaticProps } from 'next';
import { getI18nStaticProps } from '@/utils/services/getI18nStaticProps';
import Datalist from '@/components/core-components/Datalist';
import SearchFilter from '@/components/core-components/SearchFilter';
import { useLoading } from '@/context/LoadingContext';
import ToastNotification from '@/components/core-components/ToastNotification';

let pageLimit: number = 8;
let selectedID: number = 0;
export const getStaticProps: GetStaticProps = getI18nStaticProps();

const PatientIndex: React.FC = () => {
  let uuid;
  const { showLoading, hideLoading } = useLoading();
  const { t } = useTranslation('common');
  const router = useRouter();
  const columns: { name: string; class: string; field: string; format: string; }[] = [
    { name: t('PATIENT.DETAILS.SNO'), class: "col-sm-1", field: "sno", format:''},
    { name: t('PATIENT.DETAILS.MRNNO'), class: "col-sm-1", field: "mrn_no", format:''},
    { name: t('PATIENT.DETAILS.FIRSTNAME'), class: "col-sm-2", field: "first_name", format:''},
    { name: t('PATIENT.DETAILS.SURNAME'), class: "col-sm-2", field: "surname", format:''},
    { name: t('PATIENT.DETAILS.DOB'), class: "col-sm-2", field: "dob", format:'date'},
    { name: t('PATIENT.DETAILS.COUNTY'), class: "col-sm-2", field: "county", format:''},
    { name: t('PATIENT.DETAILS.MOBILE_NO'), class: "col-sm-2", field: "mobile_no", format:''}
  ];
  const filter: { name: string; field: string; }[] = [
    { name: t('PATIENT.DETAILS.FIRSTNAME'), field: 'first_name' },
    { name: t('PATIENT.DETAILS.SURNAME'), field: 'surname' }
  ];

  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [selectedPatient, setSelectedPatient] = useState<number>(0);
  const [mode, setMode] = useState<boolean>(false);
  const [clear, setClear] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [searchFilter, setsearchFilter] = useState<any>([]);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'primary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'>('primary');

  useEffect(() => {
    fetchPatientList(page);
  }, []);

  const fetchPatientList = async (page: number, sFilter?: { field: string; text: string }) => {
    showLoading();
    try {
      let passData: string = JSON.stringify({ page: page, limit: pageLimit, sort: null, search: sFilter });
      const response = await execute_axios_post(ENDPOINTS.POST_PATIENT_LIST, passData);
      setList(response.data.list);
      setTotal(response.data.total);
    } catch (err) {
      setError('Failed to load doctor data.');
    } finally {
      hideLoading();
    }
  };

  const handleSearch = () => {
    const searchTextElement = document.getElementById('searchText') as HTMLInputElement;
    if (searchTextElement.value) {
        const sFilter = {
            field: (document.getElementById('searchType') as HTMLSelectElement).value,
            text: searchTextElement.value
        }
        setPage(1);
        setsearchFilter(sFilter);
        fetchPatientList(1,sFilter);
        setClear(true);
    }
  }

  const clearSearch = () => {
    (document.getElementById('searchText') as HTMLInputElement).value = '';
    setsearchFilter([]);
    fetchPatientList(1);
    setClear(false);
  }

  const patientDblClick = (event: any) => {
    let x = document.getElementsByClassName("selected");
    if(x.length > 0) { x[0].classList.remove("selected"); }

    if(event.target.parentNode.getAttribute('custom-id')) {
      selectedID = event.target.parentNode.getAttribute('custom-id');
      event.target.parentElement.setAttribute('class', 'row selected');
      uuid = idToUuid(selectedID).toString();
      router.push(`/patient/${uuid}/patient-details`);
    }
  }

  const patientClick = (event: any) => {
    let x = document.getElementsByClassName("selected");
    if(x.length > 0) { x[0].classList.remove("selected"); }

    if(event.target.parentNode.getAttribute('custom-id')) {
      selectedID = event.target.parentNode.getAttribute('custom-id');
      event.target.parentElement.setAttribute('class', 'row selected');
    }
    setSelectedPatient(selectedID);
  }

  const createPatient = () => {
    router.push('/patient/create');
  }
  
  const handleEdit = () => {
    if(selectedPatient == 0) {
      handleShowToast(t('SETTING.MESSAGES.SELECT_RECORD'), 'danger');
      return false;
    }
    else {
      uuid = idToUuid(selectedPatient).toString();
      router.push(`/patient/${uuid}/patient-details`);
    }
  }
   
  const refreshData = (currentPage: number) => {
    var listRows = document.querySelectorAll('.row');
    listRows.forEach(function(row) {
      row.classList.remove('selected');
    })
    setSelectedPatient(0);
    setPage(currentPage);
    fetchPatientList(currentPage, searchFilter);
  }

  const handleShowToast = (message: string, color: typeof toastColor) => {
    setToastMessage(message);
    setToastColor(color);
    setShowToast(true);
  };
  
  return (
    <>
    <div className="container-fluid pt-60">
      <div className="d-flex justify-content-between align-items-center">
        <h1 className={`${styles.title} my-3`}>{t('MENU.MENU_PATIENT')}</h1>
      </div>
      <Row className="white-bg p-1 m-0 top-bottom-shadow">
        <Col xs={8} className="mt-3 action">
          <Button variant='primary' className='btn rounded-0' onClick={createPatient}><i className="fi fi-ss-add"></i> {t('ACTIONS.ADDNEW')}</Button>
          <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic"  className="btn rounded-0 ms-2">
              {t('ACTIONS.ACTIONS')}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleEdit}><i className="fi fi-sr-pencil"></i> {t('ACTIONS.EDIT')}</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col xs={4} className="float-end">
          <SearchFilter 
            filterColumns={filter}
            handleSearch={handleSearch}
            clearSearch={clearSearch}
            clear={clear}
            showFilter={true}
          />
        </Col>
      </Row>
      <div>
        <Datalist
          columns={columns}
          list={list}
          onRowDblClick={patientDblClick}
          onRowClick={patientClick}
          page={page}
          total={total}
          pageLimit={pageLimit}
          refreshData={refreshData}
          showPagination={true}
          />
      </div>
      <ToastNotification
        show={showToast}
        message={toastMessage}
        position='top-end'
        color={toastColor}
        onClose={() => setShowToast(false)}
      />
      </div>
    </>
  );
};
export default PatientIndex;
