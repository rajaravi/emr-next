import React, { useEffect, useState } from 'react';
import DynamicForm from '@/components/core-components/DynamicForm';
import { execute_axios_post } from '@/utils/services/httpService';
import ENDPOINTS from '@/utils/constants/endpoints';

// import { useTranslation } from '@/hooks/useTranslation';
import { useTranslation } from 'next-i18next';
import { GetStaticProps } from 'next';
import { getI18nStaticProps } from '@/utils/services/getI18nStaticProps';
import { DoctorFormElements } from '@/data/DoctorFormElements';

export const getStaticProps: GetStaticProps = getI18nStaticProps();

interface Props {
    show: boolean;
    toggleShow: () => void;
    data: {
        data: any;
        designations: string[];
        specialities: string[];
    };
    onFormSubmit: () => void;
}
interface Row {
    id: number;
    name: string;
    age: string;
}

const CreateDoctor: React.FC<Props> = (props) => {
    const { t } = useTranslation('common');

    const { show, toggleShow } = props;  
    const [formData, setFormData] = useState<any>();
    const [designation, setDesignation] = useState<string[]>([]);
    const [speciality, setSpeciality] = useState<string[]>([]);
    const [references, setReferences] = useState<any[]>([]);
    const [rows, setRows] = useState<Row[]>([]);


    useEffect(() => { 
        // setFormData(props.data.data);
        // setDesignation(props.data.designations); 
        // setSpeciality(props.data.specialities);
        getReference();
        // if (props.data.data) {
        //     setRows(props.data.data.reference);
        // }
    }, [show]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    }; 

    const closeModal = () => {
        setFormData({ formData: "" });
        setRows([]);
    }

    const handleAddRow = () => {
        const newRow: Row = {
            id: rows.length ? rows[rows.length - 1].id + 1 : 1,
            name: '',
            age: ''
        };    
        setRows([...rows, newRow]);
    };

    const handleRemoveRow = (id: number) => {
        setRows(rows.filter(row => row.id !== id));
    };
    
    const handleInputChange = (id: number, event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setRows(rows.map(row => (row.id === id ? { ...row, [name]: value } : row)));
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};    
        if (!formData.name) {
            newErrors.name = 'Name is required';
        }
        return newErrors;
    };
    
    const handleCreate = async (values: any) => {
        // Logic to create a new patient
        console.log('Creating patient with values:', values);
        try {
            const response = await execute_axios_post(ENDPOINTS.POST_CREATE_DOCTOR, values, {
                headers: {
                  "content-type": "application/json",
                  'Authorization': 'Bearer '+localStorage.getItem('authKey')+'',
                }
            });
            // const response = await axios.post('/api/createPatient', values);
            console.log('GET data:', response);

            //   res.status(200).json({ message: 'Success', response });
        } catch (error: any) {
            console.error('Error creating patient:', error);
            //   res.status(500).json({ message: error.message });
        }
    };    

    async function getReference() {
        try {            
            let passData: string = JSON.stringify({ limit: 1000 });
                const response = await execute_axios_post(ENDPOINTS.GET_REREFENCE_LIST, passData, {
                headers: {
                    "content-type": "application/json",
                    'Authorization': 'Bearer '+localStorage.getItem('authKey')+'',
                }
            });
            setReferences(response.data);       
        } catch (error) {
            console.error('Error posting data:', error);
        }   
    }

    return (
        <>
            <div className="offcanvas modal-lg offcanvas-end" data-bs-backdrop="static" tabIndex="-1" id="offcanvasResponsive" aria-labelledby="offcanvasResponsive">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasResponsiveLabel">Create Doctor </h5>
                    <button type="submit" className="btn btn-sm btn-success rounded-0 float-end mt-0 me-3 ms-auto" onClick={() => handleCreate()}> Save</button>
                    <button type="button" className="btn-close float-end p-0 m-0" data-bs-dismiss="offcanvas" data-bs-target="#offcanvasResponsive" aria-label="Close"></button>                    
                </div>
                <div className="offcanvas-body">
                    <DynamicForm
                        formData={DoctorFormElements}                        
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
                            {rows.map(row => (
                                <tr key={row.id}>
                                <td className='col-6 p-0'>
                                    <select className='form-control rounded-0 border-0' name='reference_id[]' value={row?.reference_id} onChange={(e) => handleInputChange(row?.reference_id, e)}>
                                    <option value="0">Select</option>
                                    {references?.map(option => (
                                        <option key={option.id} value={option.id}>
                                            {option.name}
                                        </option>
                                    ))}
                                    </select>                                        
                                </td>
                                <td className='col-5 p-0'>
                                    <input type="text" className='form-control rounded-0 border-0' name="reference_value[]" value={row?.reference_value} onChange={(e) => handleInputChange(row?.reference_value, e)} />
                                </td>
                                <td className='col-1 p-0'>
                                    <button className='btn btn-sm btn-default text-danger mt-2' onClick={() => handleRemoveRow(row.id)}><i className="fi fi-br-trash"></i></button>
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
