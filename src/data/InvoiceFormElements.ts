import { FormField } from "@/types/form";

export const InvoiceFormElements: FormField[] = [
  {
    "type": "date",
    "name": "invDate",
    "label": "Date",
    "required": true,
    "defaultValue": "",
    "disablePrevDate": true,
    "colClass": "col-sm-6",
    "order": 1
  },
  {
    "type": "dropdown",
    "name": "doctor",
    "label": "Doctor",
    "options": [],
    "required": true,
    "multiple": false,
    "colClass": "col-sm-6",
    "order": 2
  },
  {
    "type": "dropdown",
    "name": "incomeCategory",
    "label": "Income Category",
    "options": [],
    "required": true,
    "colClass": "col-sm-6",
    "multiple": false,
    "order": 3
  },
  {
    "type": "dropdown",
    "name": "billTo",
    "label": "Bill To",
    "options": [],
    "required": true,
    "colClass": "col-sm-6",
    "multiple": false,
    "order": 4
  },
  {
    "type": 'typeaheadDynamic',
    "name": 'patientName',
    "label": 'Patient Name',
    "options": [],
    "required": false,
    "colClass": "col-sm-6",
    "order": 5
  },
  {
    "type": "dropdown",
    "name": "tax",
    "label": "Tax",
    "options": [],
    "required": true,
    "defaultValue": "tax1",
    "multiple": false,
    "colClass": "col-sm-6",
    "order": 6
  }
];