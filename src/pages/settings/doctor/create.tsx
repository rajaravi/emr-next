import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DynamicForm, { DynamicFormHandle } from '@/components/core-components/DynamicForm';
import { execute_axios_post } from '@/utils/services/httpService';
import ENDPOINTS from '@/utils/constants/endpoints';

// import { useTranslation } from '@/hooks/useTranslation';
import { useTranslation } from 'next-i18next';
import { GetStaticProps } from 'next';
import { getI18nStaticProps } from '@/utils/services/getI18nStaticProps';
import { DoctorFormElements } from '@/data/DoctorFormElements';

export const getStaticProps: GetStaticProps = getI18nStaticProps();

// export interface InvoiceModel {
//     invDate: string;
//     doctor: string;
//     incomeCategory: string;
//     billTo: string;
//     patientName: string;
//     tax: string;
//     procedures: Procedure[];
//     subTotal: number;
//     discount: number;
//     taxAmount: number;
//     netTotal: number;
//   }

// const initialFormData: DoctorModel = {    
//     designation_id: 0,
//     short_name: '',
//     name: '',
//     degree: '',
//     speciality_id: 0,
//     references: [
//       { reference_id: 0, reference_value: '' },
//     ],
//     contact_person: '',
//     is_archive: false   
// };

const newreference: any = { reference_id: 0, reference_value: '' }

interface Props {
    show: boolean;
    toggleShow: () => void;
    data: {
        data: any;
        designations: string[];
        specialities: string[];
    };
}
interface Row {
    reference_id: number;
    reference_value: string;
}

const CreateDoctor: React.FC<Props> = (props: any) => {
    const { t } = useTranslation('common');

    const { mode, loadData, handleSave, isOffcanvasOpen, onClose  } = props;
    const [formData, setFormData] = useState<any>([loadData]);
    const [designation, setDesignation] = useState<string[]>([]);
    const [speciality, setSpeciality] = useState<string[]>([]);
    const [newReference, setNewReference] = useState<any[]>(newreference);
    const [referenceList, setReferenceList] = useState<any[]>([]);
    const [rows, setRows] = useState<Row[]>([]);
    

    const offcanvasRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const bootstrap = require('bootstrap/dist/js/bootstrap.bundle.min.js');
    
        // Find the offcanvas element
        const offcanvasElement = document.getElementById('offcanvasComponent');
        if (offcanvasElement) {
          const offcanvas = new bootstrap.Offcanvas(offcanvasElement);          
          // Show or hide offcanvas based on `show` prop
          if (isOffcanvasOpen) {
            offcanvas.show();
          } else {
            offcanvas.hide();
            offcanvasElement.classList.remove('show');
            const backdrop = document.querySelector('.offcanvas-backdrop');
            if (backdrop) {
                backdrop.remove();
            }
          }
    
          // Cleanup event listener when component is unmounted
          return () => {
            offcanvasElement.removeEventListener('hidden.bs.offcanvas', onClose);
          };
        }
    }, [onClose]);
      
    useEffect(() => { 
        // setDesignation(props.data.designations); 
        // setSpeciality(props.data.specialities);
        getReference();
    }, []);    

    const handleAddRow = () => {
        formData.references = (formData?.references) ? formData.references : [];
        setFormData({
            ...formData,
            references: [...formData.references, newReference]
        });
        console.log("forms",formData);
    };


    const handleRemoveRow = (index: number) => {
        const updateReferences = formData.references.filter((_, i) => i !== index);
        const updatedFormData = { ...formData, references: updateReferences };
        setFormData(updatedFormData);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index?: number) => {
        // setFormReset(false); // block form reset
        const { name, value } = e.target;
    
        if (index !== undefined) {
          const updatedreferences = [...formData.references];
          updatedreferences[index] = { 
            ...updatedreferences[index], [name]: value
          };
          const updatedFormData = { ...formData, references: updatedreferences };
          setFormData(updatedFormData);
    
          // Auto Calculate Total, Discount, Tax
        } else {
          setFormData({ ...formData, [name]: value });
        }
    };

    // const handleInputChange = (id: number, event: React.ChangeEvent<HTMLInputElement>) => {
    //     const { name, value } = event.target;
    //     setRows(rows.map(row => (row.id === id ? { ...row, [name]: value } : row)));
    // };
   
    async function getReference() {
        try {            
            let passData: string = JSON.stringify({ limit: 1000 });
                const response = await execute_axios_post(ENDPOINTS.GET_REREFENCE_LIST, passData, {
                headers: {
                    "content-type": "application/json",
                    'Authorization': 'Bearer '+localStorage.getItem('authKey')+'',
                }
            });
            setReferenceList(response.data);   
        } catch (error) {
            console.error('Error posting data:', error);
        }   
    }

    const dynamicFormRef = useRef<DynamicFormHandle>(null);    
    const handleFormSave = () => {
        dynamicFormRef.current?.customModelSubmit();
        if (dynamicFormRef.current?.validateModelForm()) {            
            dynamicFormRef.current?.customModelSubmit('references', formData.references);
        } else {
            // console.log('Form is invalid', dynamicFormRef);
        }
    }

    return (
        <>
            <div className="offcanvas canvas-md offcanvas-end" tabIndex={-1} id="offcanvasComponent" aria-labelledby="offcanvasComponentLabel" data-bs-backdrop="static" ref={offcanvasRef}>      
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasComponentLabel">{(mode === 1) ? t('FORMS.DOCTOR.EDITTITLE') : t('FORMS.DOCTOR.CREATETITLE')}</h5>       
                    <button type="button" onClick={handleFormSave} className={`btn btn-sm btn-success rounded-0 float-end ms-auto`}> {t('BUTTONS.SAVE')} </button>
                    <button type="button" onClick={onClose} className="btn-close text-reset ms-2" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">   
                    <DynamicForm ref={dynamicFormRef}
                        formData={DoctorFormElements}
                        initialValues={loadData}
                        onSubmit={handleSave}
                        isEditMode={mode} 
                        modelFormInputs={handleInputChange}                        
                        />
                    <div className="form-group row mt-2">                            
                        <div className="col-sm-12">
                            <button type="button" className='btn btn-sm btn-primary rounded-0 float-end mb-2' onClick={handleAddRow}>Add Row</button>
                            <table className="table table-bordered">
                                <thead>
                                    <tr className='bg-secondary text-white'>
                                        <th>Reference</th>
                                        <th>Reference No</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {formData?.references?.map((row, index) => (
                                        <tr key={index + row.id}>
                                        <td className='col-6 p-0'>
                                            <select 
                                                className='form-control rounded-0 border-0' 
                                                name='reference_id' 
                                                id={`reference_id-${index}`}
                                                value={row?.reference_id} 
                                                onChange={(e) => handleInputChange(e, index)}                                            
                                            >
                                            <option value="0">Select</option>
                                            {referenceList?.map(option => (
                                                <option key={option.id} value={option.id}>
                                                    {option.name}
                                                </option>
                                            ))}
                                            </select>                                        
                                        </td>
                                        <td className='col-5 p-0'>
                                            <input 
                                                type="text" 
                                                className='form-control rounded-0 border-0' 
                                                name="reference_value"
                                                id={`reference_value-${index}`}
                                                value={row?.reference_value} 
                                                onChange={(e) => handleInputChange(e, index)} 
                                                 />
                                        </td>
                                        <td className='col-1 p-0'>
                                            <button className='btn btn-sm btn-default text-danger mt-2' onClick={() => handleRemoveRow(index)}><i className="fi fi-br-trash"></i></button>
                                        </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div> 
                </div>      
            </div>
        </>
    );
};

export default CreateDoctor;
