import { FormField } from "@/types/form";

export const InvoiceFormElements: FormField[] = [
  {
    "type": "date",
    "name": "date",
    "label": "DATE",
    "required": true,
    "defaultValue": "",
    "disablePrevDate": true,
    "colClass": "col-sm-4",
    "order": 1
  },
  {
    "type": 'typeaheadDynamic',
    "name": 'patients',
    "label": 'PATIENT',
    "options": [],
    "required": true,
    "colClass": "col-sm-4",
    "order": 2
  },
  {
    "type": "dropdown",
    "name": "doctor_id",
    "label": "DOCTOR",
    "options": [],
    "required": true,
    "multiple": false,
    "colClass": "col-sm-4",
    "order": 3
  },
  {
    "type": "dropdown",
    "name": "location_id",
    "label": "LOCATION",
    "options": [],
    "required": true,
    "multiple": false,
    "colClass": "col-sm-4",
    "order": 4
  },
  {
    "type": "dropdown",
    "name": "tags",
    "label": "TAGS",
    "options": [],
    "required": true,
    "colClass": "col-sm-4",
    "multiple": false,
    "order": 5
  },
  {
    "type": "dropdown",
    "name": "payee_id",
    "label": "PAYEE",
    "options": [],
    "required": true,
    "colClass": "col-sm-4",
    "multiple": false,
    "order": 6
  },
  {
    "type": "dropdown",
    "name": "tax_id",
    "label": "TAX",
    "options": [],
    "required": true,
    "colClass": "col-sm-4",
    "multiple": false,
    "order": 7
  },
  {
    "type": "dropdown",
    "name": "contact_id",
    "label": "THRID_PARTY",
    "options": [],
    "required": false,
    "colClass": "col-sm-4",
    "multiple": false,
    "order": 8
  }  
];