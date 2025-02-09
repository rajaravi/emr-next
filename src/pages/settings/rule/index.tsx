import React, { useEffect, useRef, useState, ChangeEvent } from 'react';
import { execute_axios_post } from '@/utils/services/httpService';
import { Table, Button, Row, Col, Dropdown, Form, Container } from 'react-bootstrap';
import ENDPOINTS from '@/utils/constants/endpoints';
import styles from './_style.module.css';

// Translation logic - start
import { useTranslation } from 'next-i18next';
import { GetStaticPaths, GetStaticProps } from 'next';
import { getI18nStaticProps } from '@/utils/services/getI18nStaticProps';
import SettingLayout from '@/components/layout/SettingLayout';
import Datalist from '@/components/core-components/Datalist';
import SearchFilter from '@/components/core-components/SearchFilter';
import { useLoading } from '@/context/LoadingContext';
import OffcanvasComponent from '@/components/core-components/OffcanvasComponent';
import DynamicForm, { DynamicFormHandle } from '@/components/core-components/DynamicForm';
import ToastNotification from '@/components/core-components/ToastNotification';
import { RuleFormElements } from '@/data/RuleFormElements';
import { RuleModel } from '@/types/rule';

let pageLimit: number = 8;
let selectedID: number = 0;
let archiveID: number = 0;
export const getStaticProps: GetStaticProps = getI18nStaticProps();

const initialValue = {
  name: '',
  module_id: 0,
  rule_conditions: [{
    global_condition_id: '',
    rule_actions: [{
      rule_action_id: '',
      is_user_input_required: false,
    }]
  }]
};

const Rule: React.FC = () => {
  const { showLoading, hideLoading } = useLoading();
  const [show, setShow] = useState(false);
  const { t } = useTranslation('common');
  const columns: { name: string; class: string; field: string; format: string; }[] = [
    { name: t('SETTING.RULE.SNO'), class: "col-sm-1", field: "sno", format: ""},
    { name: t('SETTING.RULE.NAME'), class: "col-sm-4", field: "name", format: ""},
    { name: t('SETTING.RULE.MODULE'), class: "col-sm-4", field: "module.description", format: ""}
  ];
  const filter: { name: string; field: string; }[] = [
    { name: t('SETTING.RULE.NAME'), field: 'name' }
  ];

  const dynamicFormRef = useRef<DynamicFormHandle>(null);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [selectedRule, setSelectedRule] = useState<number>(0);
  const [mode, setMode] = useState<boolean>(false);
  const [clear, setClear] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [searchFilter, setsearchFilter] = useState<any>([]);
  const [initialValues, setInitialValues] = useState<any>(initialValue);
  const [conditionList, setConditionList] = useState<any>([]);
  const [actionList, setActionList] = useState<any>([]);
  const [translatedElements, setTranslatedElements] = useState<any>([]);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [formReset, setFormReset] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');  
  const [toastColor, setToastColor] = useState<'primary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'>('primary');

  const initialFormData: RuleModel = {
    "id": null,
    "name": "",
    "module_id": 0,
    "rule_conditions": [{
      "id": 0,
      "global_condition_id": "",
      "rule_actions": [{
        "id": 0,
        "rule_action_id": "",
        "is_user_input_required": false,
      }]
    }]
  };
  const [formData, setFormData] = useState<RuleModel>(initialFormData);
  const handleShow = () => {
    setShow(true);
    setFormData(initialFormData);
  }
  const handleClose = () => {
    setShow(false);
    setMode(false);
  }

  useEffect(() => {    
    // Language apply for form label
    const translatedFormElements = RuleFormElements.map((element) => ({
      ...element,
      label: t('SETTING.RULE.'+element.label)
    }));
    setTranslatedElements(translatedFormElements);
    fetchRuleList(page);
  }, []);

  // Get doctor list
  const fetchRuleList = async (page: number, sFilter?: { field: string; text: string }) => {
    showLoading();
    try {
      let passData: string = JSON.stringify({ page: page, limit: pageLimit, sort: null, search: sFilter });
      const response = await execute_axios_post(ENDPOINTS.POST_RULE_LIST, passData);
      setList(response.data.list);
      setTotal(response.data.total);
    } catch (err) {
      setError('Failed to load rule data.');
    } finally {
      hideLoading();
    }
  }; 

  // Search button call
  const handleSearch = () => {
    const searchTextElement = document.getElementById('searchText') as HTMLInputElement;
    if (searchTextElement.value) {
        const sFilter = {
            field: (document.getElementById('searchType') as HTMLSelectElement).value,
            text: searchTextElement.value
        }
        setPage(1);
        setsearchFilter(sFilter);
        fetchRuleList(1,sFilter);
        setClear(true);
    }
  }

  // Clear button call
  const clearSearch = () => {
    (document.getElementById('searchText') as HTMLInputElement).value = '';
    setsearchFilter([]);
    fetchRuleList(1);
    setClear(false);
  }

  // List double click
  const ruleDblClick = (event: any) => {
    let x = document.getElementsByClassName("selected");
    if(x.length > 0) { x[0].classList.remove("selected"); }

    if(event.target.parentNode.getAttribute('custom-id')) {
      selectedID = event.target.parentNode.getAttribute('custom-id');
      event.target.parentElement.setAttribute('class', 'row selected');
      setSelectedRule(selectedID);
    }
    getRuleById('edit');
  }

  // List single click
  const ruleClick = (event: any) => {
    let x = document.getElementsByClassName("selected");
    if(x.length > 0) { x[0].classList.remove("selected"); }

    if(event.target.parentNode.getAttribute('custom-id')) {
      selectedID = event.target.parentNode.getAttribute('custom-id');
      event.target.parentElement.setAttribute('class', 'row selected');
    }
    setSelectedRule(selectedID);
  }

  // Edit action call
  const createRule = () => {    
    getRuleById('add');
  }
  
  // Edit action call
  const handleEdit = () => {
    if(selectedRule === 0) {
      handleShowToast(t('SETTING.MESSAGES.SELECT_RECORD'), 'danger');
      return false;
    }
    getRuleById('edit');
  }

  // Get module list
  const fetchMoudleList = async (moduleID: string) => {
    try {
      let passData: string = JSON.stringify({ module_id: moduleID });
      const response = await execute_axios_post(ENDPOINTS.POST_RULE_GET_RULES, passData);
      setConditionList(response.data.conditions);
      setActionList(response.data.actions);
    } catch (err) {
      setError('Failed to load purchaser data.');
    }
  }; 
  
  // Function to handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index?: number) => {
    setFormReset(false); // block form reset
    const { name, value } = e.target;
    if(name === 'module_id') {
      fetchMoudleList(value);
    }
    if (index !== undefined) {
      const updateCondition = [...formData.rule_conditions];
      updateCondition[index] = {
        ...updateCondition[index], [name]: value
      };

      const updatedFormData = { ...formData, rule_conditions: updateCondition };
      setFormData(updatedFormData);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };  

  // Get form data
  const getRuleById = async (type: string) => {
    try {
      let editID = 0;      
      if(type == 'edit') editID = selectedRule;
      let passData: string = JSON.stringify({ id: editID });
      const response = await execute_axios_post(ENDPOINTS.POST_RULE_FORMDATA, passData);
      if(response.success) {        
        handleShow();
        if(response.data?.data?.id) {
          setMode(true);
          fetchMoudleList(response.data.data.module_id);
          setInitialValues(response.data.data);
          setFormData(response.data.data);
          
        }
        // Module options assign
        let module = new Array;
        if(response.data.rule_modules) {
            response.data.rule_modules.map((rule: any, r: number) => {
              module.push({'label':rule.description, 'value': rule.id});
          })
        }
        // Dynamic values options format
        translatedElements.map((elements: any, k: number) => {
          if(elements.name == 'module_id') {
            elements.options = [];
            elements.options = module;
          }
        })        
      }
    } catch (error: any) {
        console.error('Error on fetching procedure details:', error);
    }
  }

   // Form validation before submission
   const validateForm = () => {
    const validationErrors: string[] = [];

    if (formData.rule_conditions.length === 0) {
      validationErrors.push("At least one rule condition is required.");
    }

    formData.rule_conditions.forEach((condition, cIndex) => {
      if (!condition.global_condition_id) {
        validationErrors.push(`Condition ${cIndex + 1} must have a selected type.`);
      }

      if (condition.rule_actions.length === 0) {
        validationErrors.push(`Condition ${cIndex + 1} must have at least one action.`);
      }

      condition.rule_actions.forEach((action, aIndex) => {
        if (!action.rule_action_id) {
          validationErrors.push(
            `Action ${aIndex + 1} in Condition ${cIndex + 1} must have a selected type.`
          );
        }
      });
    });

    setErrors(validationErrors);
    return validationErrors.length === 0;
  };
  
  // Save button handler
  const handleSave = async () => {
    showLoading();
    console.log('formData', formData);
    // return;
    // Implement your save logic here
    if (dynamicFormRef.current?.validateModelForm() && validateForm()) {
      try {
        const response = await execute_axios_post(ENDPOINTS.POST_RULE_STORE, formData);
        handleShowToast(t('SETTING.RULE.MESSAGES.SAVE_SUCCESS'), 'success');
      } catch (error) {
        console.error('Error updating notes:', error);
      } finally {
          hideLoading();
          refreshForm();
      }
      handleClose(); // Close offcanvas after saving
      setFormData(initialFormData);
    } else {
      console.log('Form is invalid', dynamicFormRef);
      hideLoading();
    }
  };

  // Archive action call
  const handleArchive = async(event: any) => {
    showLoading();
    try {
      archiveID = event.target.getAttribute('cur-id');
      let passData: string = JSON.stringify({ id: archiveID, is_archive: event.target.checked });
      const response = await execute_axios_post(ENDPOINTS.POST_RULE_DELETE, passData);      
      if(response.success) { 
        if(event.target.checked === true) {
          handleShowToast(t('SETTING.MESSAGES.UNARCHIVE'), 'dark');
        }
        if(event.target.checked === false) {
          handleShowToast(t('SETTING.MESSAGES.ARCHIVE'), 'success');
        }
        refreshData(page);
        hideLoading();
      }
    } catch (error: any) {
        console.error('Error on fetching procedure details:', error);
        hideLoading();
    }
  }

  // Callback function form save to list refresh
  const refreshForm = () => {
    refreshData(page);
  }

  // Callback function for pagination change event
  const refreshData = (currentPage: number) => {
    var listRows = document.querySelectorAll('.row'); // Selection row remove when the page change 
    listRows.forEach(function(row){
      row.classList.remove('selected');
    })
    setSelectedRule(0);
    setPage(currentPage);
    fetchRuleList(currentPage, searchFilter);
  }

  // Toast message call
  const handleShowToast = (message: string, color: typeof toastColor) => {
    setToastMessage(message);
    setToastColor(color);
    setShowToast(true);
  };

  // Add a new rule condition row
  const addRuleCondition = () => {
    setFormData((prev) => ({
      ...prev,
      rule_conditions: [
        ...prev.rule_conditions,
        { id: 0, global_condition_id: "", rule_actions: [] }, // Unique ID
      ],
    }));
  };

  // Remove a rule condition row
  const removeRuleCondition = (conditionIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      rule_conditions: prev.rule_conditions.filter((_, index) => index !== conditionIndex),
    }));
  };

  // Add a new rule action row inside a condition
  const addRuleAction = (conditionIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      rule_conditions: prev.rule_conditions.map((condition, index) =>
        index === conditionIndex
          ? {
              ...condition,
              rule_actions: [
                ...condition.rule_actions,
                { id: 0, rule_action_id: "", is_user_input_required: false }, // Unique ID
              ],
            }
          : condition
      ),
    }));
  };

  // Remove a rule action row
  const removeRuleAction = (conditionIndex: number, actionIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      rule_conditions: prev.rule_conditions.map((condition, cIndex) =>
        cIndex === conditionIndex
          ? {
              ...condition,
              rule_actions: condition.rule_actions.filter((_, aIndex) => aIndex !== actionIndex),
            }
          : condition
      ),
    }));
  };

  // Toggle user input required for rule actions
  const toggleUserInput = (conditionIndex: number, actionIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      rule_conditions: prev.rule_conditions.map((condition, cIndex) =>
        cIndex === conditionIndex
          ? {
              ...condition,
              rule_actions: condition.rule_actions.map((action, aIndex) =>
                aIndex === actionIndex
                  ? { ...action, is_user_input_required: !action.is_user_input_required }
                  : action
              ),
            }
          : condition
      ),
    }));
  };

  // Update Selected Condition in Dropdown
  const updateCondition = (conditionIndex: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      rule_conditions: prev.rule_conditions.map((condition, index) =>
        index === conditionIndex ? { ...condition, global_condition_id: value } : condition
      ),
    }));
  };

  // Update action dropdown value
  const updateActionType = (conditionIndex: number, actionIndex: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      rule_conditions: prev.rule_conditions.map((condition, cIndex) =>
        cIndex === conditionIndex
          ? {
              ...condition,
              rule_actions: condition.rule_actions.map((action, aIndex) =>
                aIndex === actionIndex ? { ...action, rule_action_id: value } : action
              ),
            }
          : condition
      ),
    }));
  };
  
  return (
    <SettingLayout>
      <div className="d-flex justify-content-between align-items-center">
        <h1 className={`${styles.title} mb-3`}>{t('SETTING.SIDE_MENU.RULE')}</h1>
      </div>
      <Row className="white-bg p-1 m-0 top-bottom-shadow">
        <Col xs={7} className="mt-3 action">
          <Button variant='primary' className='btn rounded-0' onClick={createRule}><i className="fi fi-ss-add"></i> {t('ACTIONS.ADDNEW')}</Button>
          <Dropdown >
            <Dropdown.Toggle variant="secondary" id="dropdown-basic"  className="btn rounded-0 ms-2">
              {t('ACTIONS.ACTIONS')}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleEdit}><i className="fi fi-sr-pencil"></i> {t('ACTIONS.EDIT')}</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col xs={5} className="float-end">
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
          onRowDblClick={ruleDblClick}
          onRowClick={ruleClick}
          page={page}
          total={total}
          pageLimit={pageLimit}
          refreshData={refreshData}
          showPagination={true}
          archiveRecord={handleArchive}/>
      </div>
      <OffcanvasComponent
        show={show}
        title={ (mode) ? t('SETTING.RULE.EDIT_TITLE') : t('SETTING.RULE.CREATE_TITLE') }
        handleClose={handleClose}
        onSave={handleSave}
        size="75%">

        <DynamicForm ref={dynamicFormRef}
          formData={translatedElements}
          initialValues={initialValues}
          formReset={formReset}
          onSubmit={handleSave}
          isEditMode={mode}
          modelFormInputs={handleInputChange}/>

        <Row>
          <Col>
            <Button className='btn btn-sm btn-primary col mb-2 rounded-0 float-end' onClick={addRuleCondition}><i className="fi fi-bs-plus"></i> Add Condition</Button>
          </Col>          
        </Row>        
        <Container style={{background:'#e2e7ed', marginBottom: '5px' }} >
          {formData.rule_conditions.map((condition, conditionIndex) => (
            <Row key={condition.global_condition_id} style={{border:'1px solid #b2becb', background:'#e9eff6', }}>
              <Col>
                <Row className='py-2'>
                  <Col xs={3}>
                    <h5 className='my-2'> Condition {conditionIndex + 1}</h5>
                  </Col>
                  <Col xs={4}>
                    <Form.Select
                      name="global_condition_id"
                      id={`global_condition_id-${conditionIndex}`}
                      className="rounded-0"                      
                      value={condition.global_condition_id}
                      onChange={(e) => updateCondition(conditionIndex, e.target.value)}>
                        <option value="">Select...</option>
                        {conditionList?.map((option: any, cIndex: number) => (
                          <option key={cIndex} value={option.id}>{option.description}</option>
                        ))}
                    </Form.Select>
                  </Col>
                  <Col xs={5}>
                    <Button className='btn btn-sm btn-light text-danger border-danger rounded-0 float-end mt-1' onClick={() => removeRuleCondition(conditionIndex)}><i className="fi fi-br-trash"></i> Remove Condition</Button>
                    <Button className='btn btn-sm btn-light text-success border-success rounded-0 float-end me-1 mt-1' onClick={() => addRuleAction(conditionIndex)}><i className="fi fi-bs-plus"></i> Add Action</Button>
                  </Col>
                </Row>
                {condition.rule_actions.map((action, actionIndex) => (
                <>
                  <Row key={conditionIndex+''+action.rule_action_id} className='py-1 border-bottom-secondary' style={{border:'1px solid #b2becb', background:'#fff', }}>
                    <Col xs={3}><label className='pt-2'>Actions {actionIndex + 1}</label></Col>
                    <Col xs={4}>
                      <Form.Select
                        name="rule_action_id"
                        id={`rule_action_id-${actionIndex}`}
                        className="rounded-0"
                        value={action.rule_action_id}
                        onChange={(e) => updateActionType(conditionIndex, actionIndex, e.target.value)}>
                          <option value="">Select...</option>
                          {actionList?.map((option: any, aIndex: number) => (
                            <option key={aIndex} value={option.id}>{option.description}</option>
                          ))}
                      </Form.Select>
                    </Col>
                    <Col xs={3} className='pt-2'>
                      <label><input type="checkbox" checked={action.is_user_input_required} onChange={() => toggleUserInput(conditionIndex, actionIndex)} /> User Input Required</label>                      
                    </Col>
                    <Col xs={2}>
                      <Button className='btn btn-sm btn-light text-danger rounded-0 float-end me-1 mt-1' onClick={() => removeRuleAction(conditionIndex, actionIndex)}><i className="fi fi-br-trash"></i> Remove Action</Button>
                    </Col>
                  </Row>
                </>
                ))}
              </Col>
            </Row>
          ))}
        </Container>        
      </OffcanvasComponent>
      <ToastNotification
        show={showToast}
        message={toastMessage}
        position='top-end'
        color={toastColor}
        onClose={() => setShowToast(false)}
      />
    </SettingLayout>
  );
};
export default Rule;
