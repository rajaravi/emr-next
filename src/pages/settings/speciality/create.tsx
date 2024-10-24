import React, { useEffect, useState } from 'react';
import DynamicForm from '@/components/core-components/DynamicForm';
import { execute_axios_post } from '@/utils/services/httpService';
import ENDPOINTS from '@/utils/constants/endpoints';

// import { useTranslation } from '@/hooks/useTranslation';
import { useTranslation } from 'next-i18next';
import { GetStaticProps } from 'next';
import { getI18nStaticProps } from '@/utils/services/getI18nStaticProps';

export const getStaticProps: GetStaticProps = getI18nStaticProps();

const CreateSpeciality = (props) => {
    const { t } = useTranslation('common');
    const { show, toggleShow, data, rowID, onFormSubmit, refreshForm } = props;  
    const [formData, setFormData] = useState<{ id?: string; name?: string; is_archive?: boolean } | undefined>(undefined);
    const [canvasElement, setCanvasElement] = useState<any>();
    useEffect(() => { setFormData(data) }, [show]);
    useEffect(() => {
        const bootstrap = require('bootstrap/dist/js/bootstrap.bundle.min.js');
    
        const offcanvasElement = document.getElementById('offcanvasResponsive');
        const offcanvas = new bootstrap.Offcanvas(offcanvasElement);
        setCanvasElement(offcanvas);
    }, []);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    }; 

    const closeModal = () => {
        setFormData({ id: "", name: "", is_archive: false });
    }

    const validateForm = () => {
        const newErrors: { name?: string } = {};    
        if (!formData?.name) {
            newErrors.name = 'Name is required';
        }
        return newErrors;
    };

    const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {        
        event.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length === 0) {
            try {
                let passData = JSON.stringify(formData);                 
                const response = await execute_axios_post(ENDPOINTS.POST_CREATE_SPECIALITY, passData, {
                    headers: {
                      "content-type": "application/json",
                      'Authorization': 'Bearer '+localStorage.getItem('authKey')+'',
                    }
                  });
                if (response.success) {
                    setFormData({ id: "", name: "", is_archive: false });
                    canvasElement.hide();
                    refreshForm();      
                }
            } catch (error) {
                console.error('Error posting data:', error);
            }
        } 
    }  
    return (
        <>
        <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasResponsive" aria-labelledby="offcanvasResponsive">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvasResponsiveLabel">Create Speciality</h5>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#offcanvasResponsive" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
                <form onSubmit={onSubmitHandler}>
                    <input type="hidden" className="form-control rounded-0" name="id" value={formData?.id} />
                    <div className="form-group row">
                        <label className="col-sm-4 col-form-label">Name <span className='text-danger'>*</span></label>
                        <div className="col-sm-8">
                            <input type="text" className="form-control rounded-0" name="name" value={formData?.name} onChange={handleChange} autoComplete='off' />
                        </div>
                    </div>
                    <div className="form-group row mt-2">                            
                        <div className="col-sm-8 offset-sm-4">
                            <label htmlFor="is_archive" className="col-sm-8 col-form-label">                               
                            <input type="checkbox" className="rounded-0 cst-2" id="is_archive" name="is_archive" value="1" checked={formData?.is_archive} onChange={handleChange} /> Archive</label>
                        </div>
                    </div>                    
                    <button type="submit" className="btn btn-sm btn-success rounded-0 float-end"> Save</button>                        
                </form>
            </div>
        </div>
        </>
    );
};

export default CreateSpeciality;
