import { FormField } from "@/types/form";

export const PatientFormElements: FormField[] = [
  {
    "type": "dropdown",
    "name": "designation_id",
    "label": "DESIGNATION",
    "options": [],
    "required": false,
    "multiple": false, 
    "colClass": "col-sm-3",
    "order": 1
  },
  {
    "type": "text",
    "name": "address1",
    "label": "ADDRESS1",
    "placeholder": "Enter your address 1",
    "required": false,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-3",
    "order": 2
  },
  {
    "type": "text",
    "name": "mrn_no",
    "label": "MRNNO",
    "placeholder": "Enter your MRN",
    "required": false,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-3",
    "order": 3
  },
  {
    "type": "dropdown",
    "name": "gender",
    "label": "GENDER",
    "options": [
      { "label": "Male", "value": "1" },
      { "label": "Female", "value": "2" },
      { "label": "Transgender", "value": "3" },
      { "label": "Others", "value": "4" },
    ],
    "required": false,
    "defaultValue": "female",
    "multiple": false,
    "colClass": "col-sm-3",
    "order": 4
  },
  {
    "type": "text",
    "name": "first_name",
    "label": "FIRSTNAME",
    "placeholder": "Enter your first name",
    "required": true,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-3",
    "order": 5
  },
  {
    "type": "text",
    "name": "address2",
    "label": "ADDRESS2",
    "placeholder": "Enter your address 2",
    "required": false,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-3",
    "order": 6
  },
  {
    "type": "date",
    "name": "dob",
    "label": "DOB",
    "required": true,
    "disablePrevDate": false,
    "disableFutureDate": true,
    "colClass": "col-sm-3",
    "order": 7
  },
  {
    "type": "dropdown",
    "name": "doctor_id",
    "label": "DOCTOR",
    "options": [],
    "required": false,
    "multiple": false,
    "colClass": "col-sm-3",
    "order": 8
  },
  {
    "type": "text",
    "name": "surname",
    "label": "SURNAME",
    "placeholder": "Enter your surname",
    "required": true,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-3",
    "order": 9
  },
  {
    "type": "text",
    "name": "address3",
    "label": "ADDRESS3",
    "placeholder": "Enter your address 3",
    "required": false,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-3",
    "order": 10
  },
  {
    "type": "text",
    "name": "home_phone_no",
    "label": "HOME_PHONENO",
    "placeholder": "",
    "required": false,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-3",
    "order": 11
  },
  {
    "type": "dropdown",
    "name": "patient_type_id",
    "label": "PATIENT_TYPE",
    "options": [],
    "required": false,
    "multiple": false,
    "colClass": "col-sm-3",
    "order": 12
  },
  {
    "type": "text",
    "name": "full_name",
    "label": "FULLNAME",
    "placeholder": "Enter your fullname",
    "required": true,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-3",
    "order": 13
  },
  {
    "type": "text",
    "name": "county",
    "label": "COUNTY",
    "placeholder": "Enter your county",
    "required": false,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-3",
    "order": 14
  },
  {
    "type": "text",
    "name": "work_phone_no",
    "label": "WORK_PHONENO",
    "placeholder": "",
    "required": false,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-3",
    "order": 15
  },
  {
    "type": "text",
    "name": "shared_doctor_ids",
    "label": "SHARED_DOCTORS",
    "placeholder": "",
    "required": false,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-3",
    "order": 16
  },
  {
    "type": "text",
    "name": "occupation",
    "label": "OCCUPATION",
    "placeholder": "",
    "required": false,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-3",
    "order": 17
  },
  {
    "type": "text",
    "name": "country",
    "label": "COUNTRY",
    "placeholder": "Enter your country",
    "required": false,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-3",
    "order": 18
  },
  {
    "type": "text",
    "name": "eircode",
    "label": "EIRCODE",
    "placeholder": "Enter your EIR code",
    "required": false,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-3",
    "order": 19
  },
  {
    "type": "dropdown",
    "name": "marital_status_id",
    "label": "MARITAL_STATUS",
    "options": [
      { "label": "Single", "value": "1" },
      { "label": "Married", "value": "2" },
    ],
    "required": false,
    "multiple": false,
    "colClass": "col-sm-3",
    "order": 20
  },
  {
    "type": "text",
    "name": "mobile_no",
    "label": "MOBILE_NO",
    "placeholder": "",
    "required": false,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-3",
    "order": 21
  },
  {
    "type": "switch",
    "name": "send_sms",
    "label": "SEND_SMS",
    "options": [
      { "label": "", "value": "0" }
    ],
    "required": false,
    "colClass": "col-sm-3",
    "order": 22
  },
  {
    "type": "text",
    "name": "email",
    "label": "EMAIL",
    "placeholder": "",
    "required": false,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-3",
    "order": 23
  },
  {
    "type": "switch",
    "name": "send_email",
    "label": "SEND_EMAIL",
    "options": [
      { "label": "", "value": "0" }
    ],
    "required": false,
    "colClass": "col-sm-3",
    "order": 24
  },
  {
    "type": "text",
    "name": "religion",
    "label": "RELIGION",
    "placeholder": "",
    "required": false,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-3",
    "order": 25
  },
  {
    "type": "textarea",
    "name": "notes",
    "label": "NOTES",
    "placeholder": "Please enter your notes",
    "required": false,
    "rows": 3,
    "colClass": "col-sm-3",
    "order": 26
  },
  {
    "type": "textarea",
    "name": "clinical_notes",
    "label": "CLINICAL_NOTES",
    "placeholder": "Please enter your notes",
    "required": false,
    "rows": 3,
    "colClass": "col-sm-3",
    "order": 27
  },
  {
    "type": "switch",
    "name": "rip",
    "label": "RIP",
    "options": [
      { "label": "", "value": "0" }
    ],
    "required": false,
    "colClass": "col",
    "order": 28
  },
  {
    "type": "switch",
    "name": "is_archive",
    "label": "ARCHIVE",
    "options": [
      { "label": "", "value": "0" }
    ],
    "required": false,
    "colClass": "col",
    "order": 29
  },
  {
    "type": "submit",
    "name": "submit",
    "value": "Submit",
    "order": 100
  }
];