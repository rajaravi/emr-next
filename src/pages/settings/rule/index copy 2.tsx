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
let conditionArray: any = [];
let resourceURL: any = [];
let CommonType: any = [];
let actionCategory: any = [];
let ActionType: any = [];
let actionURL: any = [];
let targetOther: any = [];
let actionValue:any = [];
export const getStaticProps: GetStaticProps = getI18nStaticProps();

const initialValue = {
  name: '',
  module: '',  
  rule_conditions: [{
    id: 0,
    field: '',
    condition: '',
    field_value: 0,
  }],    
  rule_actions: [{
    name: '',
    identifier: '',
    recipient: '',
    value: '',
    recipients: '',
    is_user_interaction_required: false,
    is_skippable: false,
    parameters: [{
      name: '',
      value: 0,
      conditional_parameters: []
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
    { name: t('SETTING.RULE.MODULE'), class: "col-sm-4", field: "module", format: ""}
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
  const [fieldList, setFieldList] = useState<any>([]);
  const [conditionList, setConditionList] = useState<any>([]);
  const [resourceList, setResourceList] = useState<any>([]);
  const [moduleList, setModuleList] = useState<any>([]);  
  const [actionList, setActionList] = useState<any>([]);
  const [categoryList, setCategoryList] = useState<any>([]);
  const [categoryValueList, setCategoryValueList] = useState<any>([]);
  const [recipientsList, setRecipientsList] = useState<any>([]);  
  const [identity, setIdentity] = useState<any>([]);
  const [params, setParams] = useState<any>([]);
  const [translatedElements, setTranslatedElements] = useState<any>([]);
  const [jsonData, setJsonData] = useState<any>([]);
  const [ruleSchema, setRuleSchema] = useState<any>([]);

  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [formReset, setFormReset] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');  
  const [toastColor, setToastColor] = useState<'primary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'>('primary');

  const initialFormData: RuleModel = {
    "id": null,
    "name": "",
    "module": "",  
    "rule_conditions": [{
      "id": null,
      "field": "",
      "condition": "",
      "field_value": 0,
    }],    
    "rule_actions": [{
      "id": null,
      "name": "",
      "identifier": "",
      "recipient": "",
      "value": "",
      "recipients": "",
      "is_user_interaction_required": false,
      "is_skippable": false,
      "parameters": [{
        "name": "",
        "value": 0,
        "conditional_parameters": []
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

  // Function to handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index?: number) => {
    setFormReset(false);
    const { name, value } = e.target;
    if (name == 'module') {
      getConditionsData(ruleSchema.modules[value]);      
    }
    setFormData({ ...formData, [name]: value });
  };  

  const getConditionsData = (selectedModule: any) => {
    let fields = new Array;            
    selectedModule.fields.map((rule: any, r: number) => {
      fields.push({'label':rule.name, 'value': rule.field, 'res': rule.resource_uri});
      conditionArray[rule.field] = rule.conditions;
      resourceURL[rule.field] = rule.resource_uri;
      CommonType[rule.field] = rule.common_data_reference;
    })
    setFieldList(fields);
    let actions = new Array;
    let params = new Array;
    selectedModule.actions.map((act: any, a: number) => {
      actions.push({'label':act.action, 'value': act.identifier });
      act.parameters.map((param: any, p: number) => {          
        actionCategory[act.action] = act.parameters;
        console.log(param);
        params.push({'label': act.action, 'param': param.parameter_identifier, 'resource': param.resource_uri, 'common_data_reference': param.common_data_reference, 'is_required': param.is_required, 'reference': param.reference, 'type': param.type, 'name': param.name, 'conditional_parameters': param.conditional_parameters});
      })        
    })
    const actionParams:any = [];
      actions.forEach(item1 => {
        const match = params.find(item2 => item2.label === item1.label);
        actionParams.push({ ...item1, ...(match || {}) });
    });      
    setParams(params);
    console.log("params", params);
    setActionList(actionParams);
    setCategoryList(actionCategory);
  }

  // Get form data
  const getRuleById = async (type: string) => {
    try {
      let editID = 0;      
      if(type == 'edit') editID = selectedRule;
      let passData: string = JSON.stringify({ id: editID });
      const response = await execute_axios_post(ENDPOINTS.POST_RULE_FORMDATA, passData);
      if(response.success) {        
        handleShow();        
        setRuleSchema(response.data.rule_schema);        
        if(response.data?.data?.id) {
          setMode(true);
          const selectedModule = response.data.rule_schema.modules[response.data.data.module];
          response.data.data.rule_conditions.map(async (con: any, c: number) => {
            getConditionsData(selectedModule);
            setConditionList(conditionArray[con.field]);
            let dropDownType = CommonType[con.field] ? CommonType[con.field] : '';
            getResourceData(con.field, resourceURL[con.field], dropDownType);
          })
          
          response.data.data.rule_actions.map((act: any, a: number) => {
            
            if(act.parameters) {              
              const parsedParameters = JSON.parse(act.parameters);              
              parsedParameters.map((param: any, p: number) => {
                actionValue[act.name] = param.value;
                getActionsData(act.name, param.name);
              })
            }
          })
          setInitialValues(response.data.data);
          setFormData(response.data.data);
        }

        if(response.data.rule_schema) {
          let getModules = Object.keys(response.data.rule_schema.modules);
          let rule_module = new Array;
          getModules.map((rule: any, r: number) => {
            rule_module.push({'label':rule, 'value': rule});
          })
          setModuleList(rule_module);
        }
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

    // formData.rule_conditions.forEach((condition, cIndex) => {
    //   if (!condition.global_condition_id) {
    //     validationErrors.push(`Condition ${cIndex + 1} must have a selected type.`);
    //   }

    //   if (condition.rule_actions.length === 0) {
    //     validationErrors.push(`Condition ${cIndex + 1} must have at least one action.`);
    //   }

    //   condition.rule_actions.forEach((action, aIndex) => {
    //     if (!action.rule_action_id) {
    //       validationErrors.push(
    //         `Action ${aIndex + 1} in Condition ${cIndex + 1} must have a selected type.`
    //       );
    //     }
    //   });
    // });

    setErrors(validationErrors);
    return validationErrors.length === 0;
  };
  
  // Save button handler
  const handleSave = async () => {
    showLoading();
    console.log('formData', formData);
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
      rule_conditions: [...prev.rule_conditions, { id: 0, field: "", conditions: "", field_value: "" }, ],
    }));
  };

  // Remove a rule condition row
  const removeRuleCondition = (conditionIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      rule_conditions: prev.rule_conditions.filter((_, index) => index !== conditionIndex),
    }));
  };

  // Remove a rule condition row
  const removeRuleAction = (actionIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      rule_actions: prev.rule_actions.filter((_, index) => index !== actionIndex),
    }));
  }; 

  // Add a new rule action row inside a condition
  const addRuleAction = () => {
    setFormData((prev) => ({
      ...prev,
      rule_actions: [...prev.rule_actions, { id: 0, name: '',
        identifier: '',
        recipient: '',
        value: '',
        recipients: '',
        is_user_interaction_required: false,
        is_skippable: false,
        parameters: [{
          name: '',
          value: 0,
          conditional_parameters: []
        }]  }, ],
    }));
  };

  const handleFieldChange = (cIndex: number, e: any) => {
    setConditionList(conditionArray[e.target.value]);
    let dropDownType = CommonType[e.target.value] ? CommonType[e.target.value] : '';
    getResourceData(e.target.value, resourceURL[e.target.value], dropDownType);
    setFormData((prev) => ({
      ...prev,
      rule_conditions: prev.rule_conditions.map((condition, index) =>
        index === cIndex ? { ...condition, field: e.target.value, condition: "", field_value: 0 } : condition
      ),
    }));
  };

  const handleConditionChange = (cIndex: number, e: any) => {
    setFormData((prev) => ({
      ...prev,
      rule_conditions: prev.rule_conditions.map((condition, index) =>
        index === cIndex ? { ...condition, condition: e.target.value } : condition
      ),
    }));  
  };

  const handleFieldValueChange = (cIndex: number, e: any) => {
    setFormData((prev) => ({
      ...prev,
      rule_conditions: prev.rule_conditions.map((condition, index) =>
        index === cIndex ? { ...condition, field_value: e.target.value } : condition
      ),
    }));  
  };
    

  // Get doctor list
  const getResourceData = async (moduleType: string, url: string, ddtype: string) => {
    try {
      let passData = '';
      if(ddtype) {
        passData = JSON.stringify({type: [ddtype]})
      }
      const response = await execute_axios_post(process.env.NEXT_PUBLIC_API_URL+'/'+url, passData);
      if(ddtype == 'APPOINTMENT_STATUS') {
        let appStatus = new Array;
        response.data.appointment_statuses.map((app: any, a: number) => {
          appStatus.push({'id': app.id, 'name': app.description });          
        })
        let resource = resourceList;
        resource[moduleType] = appStatus;
        setResourceList(resource);
      }
      else {
        let resource = resourceList;
        resource[moduleType] = response.data;
        setResourceList(resource); 
      }
    } catch (err) {
      setError('Failed to load rule data.');
    } finally {
      hideLoading();
    }
  }; 

  const handleActionChange = async(cIndex: number, e: any) => {
    var selectedIndex = e.nativeEvent.target.selectedIndex;
    var selectedText = e.nativeEvent.target[selectedIndex].text
    const selectedOption = e.target.selectedOptions[0];
    const identity = selectedOption.getAttribute("data-identity");
    const parameterIdentity = selectedOption.getAttribute("data-param");
    setFormData((prev) => ({
      ...prev,
      rule_actions: prev.rule_actions.map((action, index) =>
        index === cIndex ? { ...action, name: e.target.value, identifier: identity, is_user_interaction_required: false, is_skippable: false,
          parameters: [{ name: parameterIdentity, value: 0, conditional_parameters: [] }] } : action ),
    }));    
    if(categoryList[selectedText] !== undefined) {
      getActionsData(selectedText, parameterIdentity);
    }
  };

  const getActionsData = async(selectedText: string, parameterIdentity: string ) => {
    alert(parameterIdentity);
    // let currentModule = categoryList[selectedText][0] ? categoryList[selectedText][0] : actionCategory[selectedText][0];
    // let targetModule = categoryList[selectedText][1] ? categoryList[selectedText][1] : actionCategory[selectedText][1];
    params.forEach((param: any) => {
      let passData = '';
      if(param.label === selectedText) {
        if(param.common_data_reference) {
          passData = JSON.stringify({type: [param.common_data_reference]})
        }
        execute_axios_post(process.env.NEXT_PUBLIC_API_URL+'/'+param.resource, passData)
          .then(response => {
              let action = categoryValueList;
              if(action[selectedText] === undefined) action[selectedText] = [];
              if (param.common_data_reference) {
                if(param.name == 'Target Audience') {
                  action[selectedText][param.param] = response.data.email_target_audiences;
                }
              } else {
                action[selectedText][param.param] = response.data;
              }
              setCategoryValueList(action);
              console.log("category_value_list", categoryValueList);
            }
          )
          .catch(error => {
            console.error("Error:", error);
            throw error; // ✅ Re-throw for handling
          }
        );
      }
    });
    // const response = await execute_axios_post(process.env.NEXT_PUBLIC_API_URL+'/'+currentModule.resource_uri, passData);
    // let action = categoryValueList;
    // let identity:any = [];
    // identity[selectedText] = parameterIdentity;
    // if(action[selectedText] === undefined) action[selectedText] = [];
    // action[selectedText][parameterIdentity] = response.data;
    // setCategoryValueList(action);
    // console.log("category_value_list", categoryValueList);
    // setIdentity(identity);

    // if(selectedText == "Send Email") {
    //   let passData = '';
    //   if(targetModule.common_data_reference) {
    //     passData = JSON.stringify({type: [targetModule.common_data_reference]})
    //   }
    //   const response = await execute_axios_post(process.env.NEXT_PUBLIC_API_URL+'/'+targetModule.resource_uri, passData);
    //   let emailTarget = new Array;
    //   response.data.email_target_audiences.map((email: any, e: number) => {
    //     emailTarget.push({'id': email.id, 'name': email.description });
    //   })
    //   let action = recipientsList;
    //   if(action[selectedText] === undefined) action[selectedText] = [];
    //   action[selectedText][parameterIdentity] = emailTarget;
    //   setRecipientsList(action);
    // }
  }

  const handleValueChange = (cIndex: number, e: any, pIndex: number) => {
    alert(pIndex);
    const selectedOption = e.target.selectedOptions[0]; // Get selected <option>
    const paramIdentity = selectedOption.getAttribute("data-identity");
    setFormData((prev) => ({
      ...prev,
      rule_actions: prev.rule_actions.map((action, index) =>
        index === cIndex ? { ...action, value: e.target.value, is_user_interaction_required: false, is_skippable: false,
          // parameters: ((action.parameters[pIndex] !== undefined) ? (action.parameters.map((param, param_index) => param_index === pIndex ? {...param, name: paramIdentity, value: e.target.value, conditional_parameters: []} : param)) : [...action.parameters, {name: paramIdentity, value: e.target.value, conditional_parameters: []}])} : action ),
          parameters: [...action.parameters, {name: paramIdentity, value: e.target.value, conditional_parameters: []}]} : action ),
    }));
    console.log("form_data", formData);
  };

  const handleRecipientsChange = (cIndex: number, e: any) => {
    var selectedIndex = e.nativeEvent.target.selectedIndex;
    var selectedText = e.nativeEvent.target[selectedIndex].text
    setFormData((prev) => ({
      ...prev,
      rule_actions: prev.rule_actions.map((action, index) =>
        index === cIndex ? { ...action, recipient: e.target.value } : action ),
    }));
    
  };

  const handleTargetOtherChange = (cIndex: number, e: any) => {
    alert(e.target.value);
    targetOther[formData.rule_actions[cIndex].name] = e.target.value;    
  };
  
  // Toggle user input required for rule actions
  const toggleUserInput = (aIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      rule_actions: prev.rule_actions.map((action, index) =>
        index === aIndex ? { ...action, is_user_interaction_required: !action.is_user_interaction_required } : action ),
    }));
  };

   // Toggle user input required for rule actions
   const toggleUserSkip = (aIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      rule_actions: prev.rule_actions.map((action, index) =>
        index === aIndex ? { ...action, is_skippable: !action.is_skippable } : action ),
    }));
  };
  
  return (
    <SettingLayout>
      <div className="d-flex justify-content-between align-items-center">
        <h1 className={`${styles.title} mb-3 module-title`}><i className="fi fi-rr-rules-alt"></i> {t('SETTING.SIDE_MENU.RULE')}</h1>
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
        size="85%">

        <DynamicForm ref={dynamicFormRef}
          formData={translatedElements}
          initialValues={initialValues}
          formReset={formReset}
          onSubmit={handleSave}
          isEditMode={mode}
          modelFormInputs={handleInputChange}/>

        <Row>
          <Col xs={6}>
            <Form.Label>Module</Form.Label>
            <Form.Select
              name="module"
              id={`module`}
              className="rounded-0"                      
              value={formData.module}
              onChange={(e) => handleInputChange(e, 1)}>
                <option value="">Select...</option>
                {moduleList?.map((option: any, cIndex: number) => (
                  <option key={cIndex} value={option.value}>{option.label}</option>
                ))}
            </Form.Select>
          </Col>          
        </Row>        
        <Container style={{ marginBottom: '5px', padding: '0' }} >          
          <Row className='mt-3'>
            <Col xs={6}><h5 className='my-2'>Condition(s)</h5></Col>
            <Col xs={6}><Button className='btn btn-sm btn-primary col mb-2 rounded-0 float-end' onClick={addRuleCondition}><i className="fi fi-bs-plus"></i> Add Condition</Button></Col>
          </Row>
          <Row>
            <Col xs={3}><Form.Label className='fw-bold mb-0'>Field</Form.Label></Col>
            <Col xs={3}><Form.Label className='fw-bold mb-0'>Condition</Form.Label></Col>
            <Col xs={3}><Form.Label className='fw-bold mb-0'>Value</Form.Label></Col>            
          </Row>
          {formData.rule_conditions.map((condition, conditionIndex) => (
            <Row key={conditionIndex} style={{border:'1px solid transparent' }}>              
              <Col xs={3}>       
                <Form.Select
                  name="field"
                  id={`field-${conditionIndex}`}
                  className="rounded-0"                      
                  value={condition.field}
                  onChange={(e) => handleFieldChange(conditionIndex, e)}>
                    <option value="">Select...</option>
                    {fieldList?.map((option: any, cIndex: number) => (
                      <option key={cIndex} value={option.value}>{option.label}</option>
                    ))}
                </Form.Select>
              </Col>
              <Col xs={3}>                
                <Form.Select
                  name="condition"
                  id={`condition-${conditionIndex}`}
                  className="rounded-0"                      
                  value={condition.condition}
                  onChange={(e) => handleConditionChange(conditionIndex, e)}>
                    <option value="">Select...</option>
                    {conditionList?.map((option: any, cIndex: number) => (
                      <option key={cIndex} value={option}>{option}</option>
                    ))}
                </Form.Select>
              </Col>
              <Col xs={3}>                
                <Form.Select
                  name="field_value"
                  id={`field_value-${conditionIndex}`}
                  className="rounded-0"                      
                  value={condition.field_value}
                  onChange={(e) => handleFieldValueChange(conditionIndex, e)}>
                    <option value="">Select...</option>
                    {resourceList[condition.field]?.map((option: any, cIndex: number) => (
                      <option key={cIndex} value={option.id}>{option.name}</option>
                    ))}
                </Form.Select>
              </Col>
              <Col xs={3}>
                <Form.Control type='hidden' name="id" id={`id-${conditionIndex}`} value={condition.id ? condition.id : 0} readOnly style={{width:'100px', float: 'left'}} />
                <Button className='btn btn-sm btn-light text-danger rounded-0 float-end mt-1' onClick={() => removeRuleCondition(conditionIndex)}><i className="fi fi-br-trash"></i></Button>                
              </Col>
            </Row>
          ))}
          <Row className='mt-3'>
            <Col xs={6}><h5 className='my-2'>Action(s)</h5></Col>
            <Col xs={6}> <Button className='btn btn-sm btn-primary col mb-2 rounded-0 float-end' onClick={addRuleAction}><i className="fi fi-bs-plus"></i> Add Action</Button></Col>
          </Row>
          <Row>
            <Col xs={2}><Form.Label className='fw-bold mb-0'>Name</Form.Label></Col>
            <Col xs={2}><Form.Label className='fw-bold mb-0'>Value</Form.Label></Col>
            <Col xs={2}><Form.Label className='fw-bold mb-0'>Target</Form.Label></Col>
            <Col xs={2}><Form.Label className='fw-bold mb-0'>Recipients</Form.Label></Col>
            <Col xs={2} className='d-none'><Form.Label className='fw-bold mb-0'>User Input Required</Form.Label></Col>
            <Col xs={2}><Form.Label className='fw-bold mb-0'>User Can Skip</Form.Label></Col>
          </Row>
          {formData.rule_actions.map((action, actionIndex) => (
            <Row key={actionIndex} style={{border:'1px solid transparent' }}>              
              <Col xs={2}>       
                <Form.Select
                  name="name"
                  id={`name-${actionIndex}`}
                  className="rounded-0"                      
                  value={action.name}
                  onChange={(e) => handleActionChange(actionIndex, e)}>
                    <option value="">Select...</option>
                    {actionList?.map((option: any, cIndex: number) => (
                      <option key={cIndex} value={option.label} data-param={option.param} data-resource={option.resource} data-identity={option.value}>{option.label}</option>
                    ))}
                </Form.Select>
                <Form.Control type='hidden' name="identifier" id={`identifier-${actionIndex}`} value={action.identifier} readOnly />                
              </Col> 
              {
                params.map((param: any, param_index: number) => (
                  (param.label === action.name) ? (
                  <Col xs={2} key={param_index}>
                    <Form.Select
                      name={param.param}
                      id={`${param.param}-${actionIndex}`}
                      className="rounded-0"
                      value={action.value ? action.value : actionValue[action.name]}
                      onChange={(e) => handleValueChange(actionIndex, e, param_index)}             
                      // disabled={categoryValueList[action.name] && categoryValueList[action.name][param.param] ? false : true}
                      >
                      <option value="">Select...</option>
                      {(categoryValueList[action.name]) ? (categoryValueList[action.name][param.param]?.map((option: any, cIndex: number) => (
                        <option key={cIndex} value={option.id} data-identity={param.param}>{option.name}</option>
                      ))) : ''}                  
                    </Form.Select>
                  </Col>
                  ) : ''
                )
                )
              }           
              <Col xs={2}>
                <Form.Control
                  type='text'
                  name="recipients"
                  id={`recipients-${actionIndex}`}
                  className={targetOther[action.name] ? 'rounded-0' : 'd-none'}                      
                  value={action.recipients}
                  onChange={(e) => handleTargetOtherChange(actionIndex, e)} />
              </Col>
              <Col xs={2} className='pt-2 d-none'>
                <Form.Label><input type="checkbox" checked={action.is_user_interaction_required} onChange={() => toggleUserInput(actionIndex)} /></Form.Label>
                <Form.Control className='col-sm-4' type='hidden' name="id" id={`id-${actionIndex}`} value={action.id ? action.id : 0} readOnly style={{width:'50px', float: 'left'}} />
              </Col>
              <Col xs={2} className='pt-2'>
                <Form.Label><input type="checkbox" checked={action.is_skippable} onChange={() => toggleUserSkip(actionIndex)} /></Form.Label>
                <Button className='btn btn-sm btn-light text-danger rounded-0 float-end' onClick={() => removeRuleAction(actionIndex)}><i className="fi fi-br-trash"></i></Button>   
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
