import React, { forwardRef, useRef, useImperativeHandle, useEffect, useState, useCallback } from 'react';
import { Row, Col, Container, Button, Form, ProgressBar, Modal, Tabs, Tab, Card, Table } from 'react-bootstrap';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import DynamicForm, { DynamicFormHandle } from '@/components/core-components/DynamicForm';
import OffcanvasComponent from '@/components/core-components/OffcanvasComponent';
import { typeaheadColumnConfig } from '@/types/patient';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };
  if (!id) {
    return {
      notFound: true, // Show 404 if patient ID is invalid
    };
  }
  return {
    props: {
      ...(await serverSideTranslations(context.locale || 'en', ['common'])), // Ensure 'common' namespace exists
      id: id, // Pass a valid string
    },
  };
};

interface FormProps {
  admissionData: any;
  show: boolean;
  mode: boolean;
  formName: string;
  formType: number;
  handleClose: () => void;
  handleSave: () => void;
  handleInputChange: (e:any) => void;
}

const SubForm = forwardRef<DynamicFormHandle, FormProps>(({admissionData, show, mode, formName, formType,  handleSave, handleClose, handleInputChange }, ref) => {

  const { t } = useTranslation('common');  
  
  const dynamicFormRefApp = useRef<DynamicFormHandle>(null);
  useImperativeHandle(ref, () => ({
    validateModelForm: () => dynamicFormRefApp.current?.validateModelForm(),
  }));

  return (
  <>
  <OffcanvasComponent
      show={show}
      title={ (mode) ? formName : t('PATIENT.FORM.CREATE_TITLE') }
      handleClose={handleClose}
      onSave={handleSave}
      size="90%">
        
      <Container className={(formType == 1) ? 'p-0' : 'd-none'}>
        <Row className='mb-3'>
          <Col xs={3}>
            <Form.Label>Patient Name</Form.Label>
            <Form.Control type="text" name='patientname' value={admissionData.patient_name} className='form-control rounded-0' readOnly />
          </Col>
          <Col xs={3}>
            <Form.Label>DOB</Form.Label>
            <Form.Control type="text" name='dob'  value={admissionData.dob} className='form-control rounded-0' readOnly/>
          </Col>
          <Col xs={3}>
            <Form.Label>Patient Contact No.</Form.Label>
            <Form.Control type="text" name='contact_no' value={admissionData.contact_no} className='form-control rounded-0' readOnly/>
          </Col>
          <Col xs={3}>
            <Form.Label>Consultant Name</Form.Label>
            <Form.Control type="text" name='doctor' value={admissionData.doctor} className='form-control rounded-0' readOnly/>
          </Col>
        </Row>
        <Row className='mb-3'>
          <Col xs={3}>
            <Form.Label>Surgery Date</Form.Label>
            <Form.Control type="text" name='surgery_date' value='11-03-2025' className='form-control rounded-0' readOnly/>
          </Col>
          <Col xs={3}>
            <Form.Label>Surgery Type</Form.Label>
            <Form.Control type="text" name='surgery_type' value={admissionData.surgery_type} className='form-control rounded-0' readOnly/>
          </Col>          
        </Row>
        <Row className='mb-3'>
          <Col xs={12}>
            <Card className='rounded-0'>
              <Card.Header className='rounded-0'>Pre Op Tests</Card.Header>
              <Card.Body className='rounded-0'>
                <Form.Check inline label="FBC" name="preop_test[]" type='checkbox' id={`preoptest-1`} className='col-sm-2' checked={mode} onChange={handleInputChange}/>
                <Form.Check inline label="U&E" name="preop_test[]" type='checkbox' id={`preoptest-2`} className='col-sm-2' onChange={handleInputChange} />
                <Form.Check inline label="ECG" name="preop_test[]" type='checkbox' id={`preoptest-3`} className='col-sm-2'  onChange={handleInputChange}  checked={mode}/>
                <Form.Check inline label="MRSA-NASAL" name="preop_test[]" type='checkbox' id={`preoptest-4`} className='col-sm-2'  onChange={handleInputChange}/>
                <Form.Check inline label="TFT" name="preop_test[]" type='checkbox' id={`preoptest-5`} className='col-sm-2'  onChange={handleInputChange}/>
                <Form.Check inline label="CRP" name="preop_test[]" type='checkbox' id={`preoptest-6`} className='col-sm-2'  onChange={handleInputChange}/>
                <Form.Check inline label="MRSA FULL SCREEN" name="preop_test[]" type='checkbox' id={`preoptest-7`} className='col-sm-2' onChange={handleInputChange}/>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className='mb-3'>
          <Col xs={12}>
            <Card className='rounded-0'>
              <Card.Header className='rounded-0'>Pre Op Additional Lab Tests</Card.Header>
              <Card.Body className='rounded-0'>
                <Form.Check inline label="MSU" name="preop_labtest[]" type='checkbox' id={`preop_labtest-1`} className='col-sm-2'  onChange={handleInputChange}/>
                <Form.Check inline label="Group & Hold" name="preop_labtest[]" type='checkbox' id={`preop_labtest-2`} className='col-sm-2'  onChange={handleInputChange}/>
                <Form.Check inline label="COAG" name="preop_labtest[]" type='checkbox' id={`preop_labtest-3`} className='col-sm-2' checked={mode}  onChange={handleInputChange}/>
                <Form.Check inline label="ESR" name="preop_labtest[]" type='checkbox' id={`preop_labtest-4`} className='col-sm-2'  onChange={handleInputChange}/>
                <Form.Check inline label="Glucose" name="preop_labtest[]" type='checkbox' id={`preop_labtest-5`} className='col-sm-2' checked={mode}  onChange={handleInputChange}/>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className='mb-3'>
          <Col xs={12}>
            <Card className='rounded-0'>
              <Card.Header className='rounded-0'>Pre Op X-Rays</Card.Header>
              <Card.Body className='rounded-0'>
                <Form.Check inline label="Chest X-Ray" name="preop_xray[]" type='checkbox' id={`preop_xray-1`} className='col-sm-2' checked={mode} onChange={handleInputChange}/>
                <Form.Check inline label="AP Hip X-Ray (Hip Surgery)" name="preop_xray[]" type='checkbox' id={`preop_xray-2`} className='col-sm-4' onChange={handleInputChange}/>
                <Form.Check inline label="AP & lateral & skyline X-Ray (Knee Surgery)" name="preop_xray[]" type='checkbox' id={`preop_xray-3`} className='col-sm-4' onChange={handleInputChange}/>
              </Card.Body>
            </Card>            
          </Col>
        </Row>
        <Row className='mb-3'>
          <Col xs={3}>
            <Form.Label>Total Cost</Form.Label>
            <Form.Control type="text" name="total_cost" value={mode ? '1450' : ''} className='form-control rounded-0' onChange={handleInputChange}/>
          </Col>
          <Col xs={9}>
            <Form.Label>Other Tests</Form.Label>
            <Form.Control as="textarea" name="other_tests" value={mode ? 'NA' : ''} rows={2} className='form-control rounded-0'  onChange={handleInputChange} />
          </Col>
        </Row>
        <Row className='mb-3'>
          <Col xs={12}>
            <Card className='rounded-0'>
              <Card.Header className='rounded-0'>Office Use Only</Card.Header>
              <Card.Body className='rounded-0'>
                <Row className='mb-3'>
                  <Col xs={2}>
                    <Form.Label>Date</Form.Label>
                    <Form.Control type="date" name="office_date" className='form-control rounded-0' onChange={handleInputChange}/>
                  </Col>
                  <Col xs={2}>
                    <Form.Label>Time</Form.Label>
                    <Form.Control type="time" name="office_time" className='form-control rounded-0' onChange={handleInputChange}/>
                  </Col>
                  <Col xs={4}>
                    <Form.Label>Formal ID</Form.Label>
                    <Form.Control type="text" name="formal_id" className='form-control rounded-0' onChange={handleInputChange}/>
                  </Col>
                  <Col xs={4}>
                    <Form.Label style={{marginTop: '34px'}}>&nbsp; </Form.Label>
                    <Form.Check inline label="Yes" name="formal_opt" type='radio' id={`formal_opt-1`} onChange={handleInputChange} />
                    <Form.Check inline label="No" name="formal_opt" type='radio' id={`formal_opt-1`} onChange={handleInputChange} />
                  </Col>
                </Row>
                <Row className='mb-3'>
                  <Col xs={4}>
                    <Form.Label>GC#</Form.Label>
                    <Form.Control type="text" name="gc" className='form-control rounded-0' onChange={handleInputChange} />
                  </Col>
                  <Col xs={4}>
                    <Form.Label>MR#</Form.Label>
                    <Form.Control type="text" name="mr" className='form-control rounded-0' onChange={handleInputChange} />
                  </Col>
                </Row>

              </Card.Body>
            </Card>            
          </Col>
        </Row>        
      </Container>

      <Container className={(formType == 2) ? 'p-0' : 'd-none'}>
        <Row>
          <Col xs={12}>
            <h6 className='fw-bold'>Patient Details</h6>
          </Col>
        </Row>
        <Row className='mb-3'>
          <Col xs={4}>
            <Form.Label>Patient Name</Form.Label>
            <Form.Control type="text" name="patient_name" value={admissionData.patient_name} onChange={handleInputChange} />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <h6 className='fw-bold'>Hospital Details</h6>
          </Col>
        </Row>
        <Row className='mb-3'>
          <Col xs={3}>
            <Form.Label>Hospital Code</Form.Label>
            <Form.Control type="text" name="hospital_code" value={mode ? 'H839K92' : ''} onChange={handleInputChange} />
          </Col>
          <Col xs={3}>
            <Form.Label>Hospital Name</Form.Label>
            <Form.Control type="text" name="hospital_name" value={mode ? 'NRK Hospitals' : ''} onChange={handleInputChange} />
          </Col>
          <Col xs={3}>
            <Form.Label>Admission Date</Form.Label>
            <Form.Control type="text" name="admission_date" value={mode ? '08-03-2025' : ''} onChange={handleInputChange} />
          </Col>
          <Col xs={3}>
            <Form.Label>Admission Time</Form.Label>
            <Form.Control type="text" name="admission_time" value={mode ? '10:30' : ''} onChange={handleInputChange} />
          </Col>
        </Row>
        <Row className='mb-3'>          
          <Col xs={3}>
            <Form.Label>Discharge Date</Form.Label>
            <Form.Control type="text" name="discharge_date" value={mode ? '' : ''} onChange={handleInputChange} />
          </Col>
          <Col xs={3}>
            <Form.Label>Discharge Time</Form.Label>
            <Form.Control type="text" name="discharge_time" value={mode ? '' : ''} onChange={handleInputChange} />
          </Col>
          <Col xs={6}>
            <Form.Label className='col-sm-12 mb-3'>Reimbursement method</Form.Label>
            <Form.Check inline label="FPP" name="reimbursement" type='radio' id={`reimbursement-1`} checked={mode} onChange={handleInputChange} />
            <Form.Check inline label="PP" name="reimbursement" type='radio' id={`reimbursement-2`} onChange={handleInputChange} />
            <Form.Check inline label="PER DIEM" name="reimbursement" type='radio' id={`reimbursement-3`} onChange={handleInputChange}/>
            <Form.Check inline label="HRS" name="reimbursement" type='radio' id={`reimbursement-4`} onChange={handleInputChange} />
            <Form.Check inline label="PUBLIC" name="reimbursement" type='radio' id={`reimbursement-5`} onChange={handleInputChange} />
            <Form.Check inline label="GOVT.LEVY ONLY" name="reimbursement" type='radio' id={`reimbursement-6`} onChange={handleInputChange} />
          </Col>
        </Row>
        <Row className='mb-3'>          
          <Col xs={3}>
            <Form.Label>Hospital Invoice Value</Form.Label>
            <Form.Control type="text" name="invoice_value" value={mode ? '2100' : ''} onChange={handleInputChange} />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Table>
              <thead>
                <tr>
                  <th className='col-3'>Ward Type</th>
                  <th className='col-2'>Ward Name/Number</th>
                  <th className='col-2'>Room Name/Number</th>
                  <th className='col-2'>UBI Unique Bed Identifier</th>
                  <th className='col-2'>No of Beds in Room</th>
                  <th className='col-1'>No of Days</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><Form.Check inline label="Private Room/Single Occupancy" name="ward_type[]" type='checkbox' id={`ward_type-1`}  className='pt-2'/></td>
                  <td><Form.Control type="text" name='ward_no_1' className='form-control rounded-0' onChange={handleInputChange}/></td>
                  <td><Form.Control type="text" name='room_no_1' className='form-control rounded-0' onChange={handleInputChange}/></td>
                  <td><Form.Control type="text" name='unique_no_1' className='form-control rounded-0' onChange={handleInputChange}/></td>
                  <td><Form.Control type="text" name='beds_1' className='form-control rounded-0' onChange={handleInputChange}/></td>
                  <td><Form.Control type="text" name='days_1' className='form-control rounded-0' onChange={handleInputChange}/></td>
                </tr>
                <tr>
                  <td><Form.Check inline label="Semi-Private Room/Single Occupancy" name="ward_type[]" type='checkbox' id={`ward_type-2`}  className='pt-2' checked={mode} onChange={handleInputChange}/></td>
                  <td><Form.Control type="text" name='ward_no_2' className='form-control rounded-0' value={mode ? '134' : ''}  onChange={handleInputChange}/></td>
                  <td><Form.Control type="text" name='room_no_2' className='form-control rounded-0' value={mode ? '26' : ''}  onChange={handleInputChange}/></td>
                  <td><Form.Control type="text" name='unique_no_2' className='form-control rounded-0' value={mode ? 'A' : ''} onChange={handleInputChange}/></td>
                  <td><Form.Control type="text" name='beds_2' className='form-control rounded-0' value={mode ? '4' : ''} onChange={handleInputChange}/></td>
                  <td><Form.Control type="text" name='days_2' className='form-control rounded-0' value={mode ? '3' : ''} onChange={handleInputChange}/></td>
                </tr>
                <tr>
                  <td><Form.Check inline label="Semi-Private Room/Multi Occupancy" name="ward_type[]" type='checkbox' id={`ward_type-3`}  className='pt-2' onChange={handleInputChange}/></td>
                  <td><Form.Control type="text" name='ward_no_3' className='form-control rounded-0' onChange={handleInputChange}/></td>
                  <td><Form.Control type="text" name='room_no_3' className='form-control rounded-0' onChange={handleInputChange}/></td>
                  <td><Form.Control type="text" name='unique_no_3' className='form-control rounded-0' onChange={handleInputChange}/></td>
                  <td><Form.Control type="text" name='beds_3' className='form-control rounded-0' onChange={handleInputChange}/></td>
                  <td><Form.Control type="text" name='days_3' className='form-control rounded-0' onChange={handleInputChange}/></td>
                </tr>
                <tr>
                  <td><Form.Check inline label="Day Ward" name="ward_type[]" type='checkbox' id={`ward_type-4`}  className='pt-2'/></td>
                  <td><Form.Control type="text" name='ward_no_4' className='form-control rounded-0' onChange={handleInputChange}/></td>
                  <td><Form.Control type="text" name='room_no_4' className='form-control rounded-0' onChange={handleInputChange}/></td>
                  <td><Form.Control type="text" name='unique_no_4' className='form-control rounded-0' onChange={handleInputChange}/></td>
                  <td><Form.Control type="text" name='beds_4' className='form-control rounded-0' onChange={handleInputChange}/></td>
                  <td><Form.Control type="text" name='days_4' className='form-control rounded-0' onChange={handleInputChange}/></td>
                </tr>
                <tr>
                  <td><Form.Check inline label="ICU/NICU" name="ward_type[]" type='checkbox' id={`ward_type-5`}  className='pt-2'/></td>
                  <td><Form.Control type="text" name='ward_no_5' className='form-control rounded-0' onChange={handleInputChange}/></td>
                  <td><Form.Control type="text" name='room_no_5' className='form-control rounded-0' onChange={handleInputChange}/></td>
                  <td><Form.Control type="text" name='unique_no_5' className='form-control rounded-0' onChange={handleInputChange}/></td>
                  <td><Form.Control type="text" name='beds_5' className='form-control rounded-0' onChange={handleInputChange}/></td>
                  <td><Form.Control type="text" name='days_5' className='form-control rounded-0' onChange={handleInputChange}/></td>
                </tr>
                <tr>
                  <td><Form.Check inline label="CCU" name="ward_type[]" type='checkbox' id={`ward_type-6`}  className='pt-2' onChange={handleInputChange}/></td>
                  <td><Form.Control type="text" name='ward_no_6' className='form-control rounded-0' onChange={handleInputChange}/></td>
                  <td><Form.Control type="text" name='room_no_6' className='form-control rounded-0' onChange={handleInputChange}/></td>
                  <td><Form.Control type="text" name='unique_no_6' className='form-control rounded-0' onChange={handleInputChange}/></td>
                  <td><Form.Control type="text" name='beds_6' className='form-control rounded-0' onChange={handleInputChange}/></td>
                  <td><Form.Control type="text" name='days_6' className='form-control rounded-0' onChange={handleInputChange}/></td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row className='mb-3'>          
          <Col xs={12}>
            <Form.Label className='col-sm-12 mb-1'>Treatment Settings (If the patient was not admitted to a ward in the hospital, please specify the treatment setting)</Form.Label>
            <Form.Check inline label="Theatre" name="treatment_settings" type='radio' id={`treatment_settings-1`}  onChange={handleInputChange}/>
            <Form.Check inline label="Side Room" name="treatment_settings" type='radio' id={`treatment_settings-2`}  onChange={handleInputChange}/>
            <Form.Check inline label="A&E Department" name="treatment_settings" type='radio' id={`treatment_settings-3`} checked={mode}  onChange={handleInputChange}/>
            <Form.Check inline label="Out-Patient Department" name="treatment_settings" type='radio' id={`treatment_settings-4`}  onChange={handleInputChange}/>
            <Form.Check inline label="Radiology Centre" name="treatment_settings" type='radio' id={`treatment_settings-5`}  onChange={handleInputChange}/>
            <Form.Check inline label="Consultant/GP Rooms" name="treatment_settings" type='radio' id={`treatment_settings-6`}  onChange={handleInputChange}/>
            <Form.Check inline label="Minor Injury Unit" name="treatment_settings" type='radio' id={`treatment_settings-7`}  onChange={handleInputChange}/>
          </Col>
        </Row>
        <Row className='mb-3'>          
          <Col xs={6}>
            <Form.Label className='col-sm-12 mb-1'>Was the patient transferred directly from another facility for this procedure?</Form.Label>
            <Form.Check inline label="Yes" name="transferred_directly" type='radio' id={`transferred_directly-1`}  className='col-sm-2' onChange={handleInputChange}/>
            <Form.Check inline label="No" name="transferred_directly" type='radio' id={`transferred_directly-2`}  className='col-sm-2' checked={mode} onChange={handleInputChange}/>            
          </Col>
          <Col xs={6}>
            <Form.Label>If yes, name other facility</Form.Label>
            <Form.Control type="text" name="facility_name" value="" onChange={handleInputChange} />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <h6 className='fw-bold'>Policy Details</h6>
          </Col>
        </Row>
        <Row className='mb-3'>          
          <Col xs={3}>
            <Form.Label>Patient Name</Form.Label>
            <Form.Control type="text" name='patientname' value={admissionData.patient_name} className='form-control rounded-0' readOnly />
          </Col>
          <Col xs={3}>
            <Form.Label>Policy Number</Form.Label>
            <Form.Control type="text" name='policy_no'  value={mode ? 'H829K201901' : ''} className='form-control rounded-0' readOnly/>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <h6 className='fw-bold'>History of Illness</h6>
          </Col>
        </Row>
        <Row className='mb-3'>          
          <Col xs={3}>
            <Form.Label>Name of the doctor first attended</Form.Label>
            <Form.Control type="text" name='first_doctor' value="James Caren" className='rounded-0' onChange={handleInputChange} />
          </Col>
          <Col xs={2}>
            <Form.Label>Date of first consultation</Form.Label>
            <Form.Control type="text" name='first_date'  value={mode ? '09-03-2025' : ''} className='rounded-0' onChange={handleInputChange}/>
          </Col>                    
        </Row>
        <Row className='mb-3'>          
          <Col xs={12}>
            <Form.Label>When was it first made known to you that this particular investigation/treatment (which is the subject of this claim) was required?</Form.Label>
            <Form.Control type="text" name='investigation_date'  value='' className='rounded-0' style={{width: '200px'}} onChange={handleInputChange}/>
          </Col>          
        </Row>
        <Row className='mb-3'>          
          <Col xs={5}>
            <Form.Label className='col-sm-12 mb-1'>Has this patient had this or a similar illness before?</Form.Label>
            <Form.Check inline label="Yes" name="similar_illness" type='radio' id={`similar_illness-1`}  className='col-sm-2' onChange={handleInputChange}/>
            <Form.Check inline label="No" name="similar_illness" type='radio' id={`similar_illness-2`}  className='col-sm-2' checked={mode} onChange={handleInputChange}/>
          </Col>
          <Col xs={7}>
            <Form.Label className='col-sm-12 mb-1'>If Yes, please give date and details date and text</Form.Label>
            <Form.Control type="text" name='illness_date'  value={mode ? '09-03-2025' : ''} className='rounded-0' style={{width: '30%', float: 'left'}} onChange={handleInputChange}/>
            <Form.Control type="text" name='illness_text'  value='' className='rounded-0' style={{width: '65%', float: 'left', marginLeft: '15px'}} onChange={handleInputChange}/>
          </Col>
        </Row>
        <Row className='mb-3'>          
          <Col xs={12}>
            <Form.Label>How many weeks did you wait for an out-patient appointment with your consultant following your GP referral?</Form.Label>
            <Form.Control type="text" name='wait_weeks'  value={mode ? '1' : ''} className='rounded-0' style={{width: '200px'}} onChange={handleInputChange}/>
          </Col>          
        </Row>
        <Row className='mb-3'>          
          <Col xs={12}>
            <Form.Label>When your consultant decided that admission to hospital was necessary, how many weeks were you waiting for your admission?</Form.Label>
            <Form.Control type="text" name='admission_wait_weeks'  value='' className='rounded-0' style={{width: '200px'}} onChange={handleInputChange}/>
          </Col>          
        </Row>
        <Row className='mb-3'>          
          <Col xs={12}>
            <Form.Label className='col-sm-12 mb-1'>Did you elect to be a private patient of the admitting consultant?</Form.Label>
            <Form.Check inline label="Yes" name="elect_private" type='radio' id={`elect_private-1`} className='col-sm-1' onChange={handleInputChange} />
            <Form.Check inline label="No" name="elect_private" type='radio' id={`elect_private-2`}  className='col-sm-1' checked={mode} onChange={handleInputChange}/>            
          </Col>
        </Row>
        <Row className='mb-3'>          
          <Col xs={12}>
            <Form.Label className='col-sm-12 mb-1'>If transferred from a public facility, did you elect to be a private patient of the admitting consultant in that facility?</Form.Label>
            <Form.Check inline label="Yes" name="public_facility" type='radio' id={`public_facility-1`} className='col-sm-1' onChange={handleInputChange} />
            <Form.Check inline label="No" name="public_facility" type='radio' id={`public_facility-2`}  className='col-sm-1' checked={mode} onChange={handleInputChange}/>            
          </Col>
        </Row>
        <Row className='mb-3'>          
          <Col xs={12}>
            <Form.Label className='col-sm-12 mb-1'>Is your admission/treatment related to a Clinical Research Study?</Form.Label>
            <Form.Check inline label="Yes" name="clinical_research" type='radio' id={`clinical_research-1`} className='col-sm-1' onChange={handleInputChange} />
            <Form.Check inline label="No" name="clinical_research" type='radio' id={`clinical_research-2`} className='col-sm-1' checked={mode} onChange={handleInputChange} />            
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <h6 className='fw-bold'>Injury Details</h6>
          </Col>
        </Row>
        <Row className='mb-3'>
          <Col xs={3}>
            <Form.Label>Date of injury</Form.Label>
            <Form.Control type="text" name='injury_date'  value='' className='rounded-0' onChange={handleInputChange}/>
          </Col>   
          <Col xs={9}>
            <Form.Label>Place of Injury</Form.Label>
            <Form.Control type="text" name='injury_place'  value='' className='rounded-0' onChange={handleInputChange}/>
          </Col>    
        </Row>
        <Row className='mb-3'>
          <Col xs={12}>
            <Form.Label>Brief description of how the injury occurred</Form.Label>
            <Form.Control as="textarea" name='injury_description'  value='' className='rounded-0' onChange={handleInputChange}/>
          </Col>         
        </Row>
        <Row className='mb-3'>          
          <Col xs={12}>
            <Form.Label className='col-sm-12 mb-1'>Do you intend to pursue a legal claim against a third party (parties)?</Form.Label>
            <Form.Check inline label="Yes" name="clinical_research" type='radio' id={`clinical_research-1`} className='col-sm-1' onChange={handleInputChange} />
            <Form.Check inline label="No" name="clinical_research" type='radio' id={`clinical_research-2`} className='col-sm-1' checked={mode} onChange={handleInputChange} />            
          </Col>
        </Row>
        <Row className='mb-3'>
          <Col xs={6}>
            <Form.Label>Name and address of solicitor (where applicable)</Form.Label>
            <Form.Control as="textarea" name='solicitor_address'  value='' className='rounded-0' onChange={handleInputChange}/>
          </Col>         
        </Row>
        
      </Container>

    </OffcanvasComponent>
    
  </>
  )
});

export default SubForm;