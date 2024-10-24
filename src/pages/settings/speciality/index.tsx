import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { execute_axios_post } from '@/utils/services/httpService';
import ENDPOINTS from '@/utils/constants/endpoints';
import styles from './_style.module.css';

// Translation logic - start
import { GetStaticPaths, GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { getI18nStaticProps } from '@/utils/services/getI18nStaticProps';
import SettingLayout from '@/components/layout/SettingLayout';
import Datalist from '@/components/core-components/Datagrid';
import CreateSpeciality from '../speciality/create';


let pageLimit: number = 8;
let eid = 0;
export const getStaticProps: GetStaticProps = getI18nStaticProps();
// Translation logic - end

const columns: { name: string; class: string; field: string; }[] = [
  { name: "S.No", class: "col-sm-1", field: "id" },
  { name: "Name", class: "col-sm-11", field: "name" } 
];

const filter: { name: string; field: string; }[] = [
  { name: "Name", field: 'name' }
];

const Speciality: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { id } = router.query;
  const [refreshList, setRefreshList] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [list, setList] = useState<any>([]);
  const [total, setTotal] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [clear, setClear] = useState<boolean>(false);
 
  
  useEffect(() => { getData(page); }, [refreshList]);
  

  const getData = async (page: number, sFilter?: { field: string; text: string }) => {
    try {
        let passData: string = JSON.stringify({ page: page, limit: pageLimit, sort: null, search: sFilter });
        const response = await execute_axios_post(ENDPOINTS.GET_SPECIALITY, passData, {
          headers: {
            "content-type": "application/json",
            'Authorization': 'Bearer '+localStorage.getItem('authKey')+'',
          }
        });
        setList(response.data.list);
        setTotal(response.data.total);
        if(total < pageLimit) setCount(total);
        else setCount(page * pageLimit);
     
    } catch (error: any) {
        console.error('Error creating patient:', error);
        // error.status(500).json({ message: error.message });
    }        
  }

  const handleSearch = () => {
    const searchTextElement = document.getElementById('searchText') as HTMLInputElement;
    if (searchTextElement.value) {
        const sFilter = {
            field: (document.getElementById('searchType') as HTMLSelectElement).value,
            text: searchTextElement.value
        }
        getData(1,sFilter);
        setClear(true);        
    }
  }

  const clearSearch = () => {
    (document.getElementById('searchText') as HTMLInputElement).value = '';
    getData(1);
    setClear(false);
  }
  const doctorDblClick = (event: any) => {
    var myOffcanvas = document.getElementById('offcanvasResponsive')
    console.log('DBL click');
    event.stopPropagation()
  }
  const doctorClick = (event: any) => {
    console.log('click');
    let x = document.getElementsByClassName("selected");
    if(x.length > 0) { x[0].classList.remove("selected"); }
        
    if(event.target.getAttribute('custom-attribute')) {
        eid = event.target.getAttribute('custom-attribute');
        event.target.parentElement.setAttribute('class', 'row selected');        
    }
  }

  const refreshData = (currentPage: number) => {
    getData(currentPage);
  }
  const refreshForm = () => {
    getData(1);
  }

  return (
    <SettingLayout>
      <div className="d-flex justify-content-between align-items-center">
        <h1 className={`${styles.title} mb-3`}>{t('SETTING.SIDE_MENU.SPECIALITY')}</h1>                
      </div>
      <div className="row white-bg p-1 m-0 top-bottom-shadow">
        <div className="col-sm-7 mt-3 action">    
        <button className="btn btn-md btn-theme rounded-0" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasResponsive" aria-controls="offcanvasResponsive"><i className="fi fi-ss-add"></i>  Add New</button>   
          <div className="dropdown">
            <button className="btn btn-theme-light dropdown-toggle rounded-0 ms-2" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              Actions
            </button>
            <ul className="dropdown-menu">
              <li><a className="dropdown-item" type="button"><i className="fi fi-sr-pencil"></i> Edit</a></li>
              <li><a className="dropdown-item" type="button"><i className="fi fi-sr-folder-open"></i> Archive</a></li>              
            </ul>
          </div>
        </div>  
        <div className='col-sm-5 float-end'>
          <div className="py-3 row">
            <div className="col-sm-4 px-0">
              <select className="form-control rounded-0 bg-transparent border-0" id="searchType">
                {
                  filter.map((fil, k) => {
                    return (
                      <option key={k} value={fil.field}>{fil.name}</option>
                    );
                  })
                }
              </select>
            </div>
            <div className="col-sm-8 position-relative">
              <input type="text" className="form-control search-text rounded-0" id="searchText" autoComplete='off' />
              <button type='button' className="btn btn-theme search-button rounded-0" onClick={() => handleSearch()}><i className="fi fi-br-search"></i> </button>
              {clear ? <button type='button' className="btn btn-default rounded-0 btn-search-clear" onClick={() => clearSearch()}><i className="fi fi-tr-delete"></i> </button> : null}
            </div>                        
          </div>
        </div>
      </div>
      <div>
        <Datalist 
          columns={columns}
          list={list}
          onRowDblClick={doctorDblClick}
          onRowClick={doctorClick}
          page={page}
          total={total}
          pageLimit={pageLimit}
          refresh={refreshList}
          refreshData={refreshData}
          showPagination={true}
        />
      </div>      
      <CreateSpeciality id={eid} refreshForm={refreshForm} />      
    </SettingLayout>
  );
};

export default Speciality;

