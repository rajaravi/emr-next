import { FormField } from "@/types/form";

 export const InvoiceFormElements: FormField[] = [
  {
    "type": "date",
    "name": "invDate",
    "label": "Date",
    "required": true,
    "defaultValue": "",
    "disablePrevDate": true,
    "order": 1
  },
  {
    "type": "dropdown",
    "name": "doctor",
    "label": "Doctor",
    "options": [
      { "label": "Dr. Smith", "value": "dr_smith" },
      { "label": "Dr. John", "value": "dr_john" }
    ],
    "required": true,
    "defaultValue": "dr_smith",
    "multiple": false,
    "order": 2
  },
  {
    "type": "dropdown",
    "name": "incomeCategory",
    "label": "Income Category",
    "options": [
      { "label": "Category 1", "value": "cat1" },
      { "label": "Category 2", "value": "cat2" }
    ],
    "required": true,
    "defaultValue": "cat1",
    "multiple": false,
    "order": 3
  },
  {
    "type": "dropdown",
    "name": "billTo",
    "label": "Bill To",
    "options": [
      { "label": "Client A", "value": "client_a" },
      { "label": "Client B", "value": "client_b" }
    ],
    "required": true,
    "defaultValue": "client_a",
    "multiple": false,
    "order": 4
  },
  {
    "type": "dropdown",
    "name": "patientName",
    "label": "Patient Name",
    "options": [
      { "label": "Patient 1", "value": "patient1" },
      { "label": "Patient 2", "value": "patient2" }
    ],
    "required": true,
    "defaultValue": "practice1",
    "multiple": false,
    "order": 5
  },
  {
    "type": "dropdown",
    "name": "tax",
    "label": "Tax",
    "options": [
      { "label": "Tax 1", "value": "tax1" },
      { "label": "Tax 2", "value": "tax2" }
    ],
    "required": true,
    "defaultValue": "tax1",
    "multiple": false,
    "order": 6
  }
];