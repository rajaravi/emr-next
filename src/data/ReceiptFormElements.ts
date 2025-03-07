import { FormField } from "@/types/form";

export const ReceiptFormElements: FormField[] = [
  {
    "type": "date",
    "name": "date",
    "label": "DATE",
    "required": false,
    "disablePrevDate": true,
    "disableFutureDate": false,
    "dateSelection": true, 
    "colClass": "col-sm-3",
    "order": 1
  },
  {
    "type": 'typeaheadDynamic',
    "name": 'patients',
    "label": 'PATIENT',
    "options": [],
    "required": true,
    "colClass": "col-sm-3",
    "order": 2
  },
  {
    "type": "dropdown",
    "name": "doctor_id",
    "label": "DOCTOR",
    "options": [],
    "required": true,
    "multiple": false,
    "colClass": "col-sm-3",
    "order": 3
  },
  {
    "type": "dropdown",
    "name": "payment_types",
    "label": "PAYMENT_TYPE",
    "options": [],
    "required": true,
    "multiple": false,
    "colClass": "col-sm-3",
    "order": 4
  },  
  {
    "type": "dropdown",
    "name": "tags",
    "label": "TAG",
    "options": [],
    "required": false,
    "colClass": "col-sm-3",
    "multiple": false,
    "order": 5
  },
  {
    "type": "dropdown",
    "name": "payee_id",
    "label": "PAYEE",
    "options": [],
    "required": true,
    "colClass": "col-sm-3",
    "multiple": false,
    "order": 6
  },
  {
    "type": "dropdown",
    "name": "contact_id",
    "label": "CONTACT",
    "options": [],
    "required": false,
    "colClass": "col-sm-3",
    "multiple": false,
    "order": 8
  },
  {
    "type": "dropdown",
    "name": "purchaser_id",
    "label": "THRID_PARTY",
    "options": [],
    "required": false,
    "colClass": "col-sm-3",
    "multiple": false,
    "order": 9
  }  
];