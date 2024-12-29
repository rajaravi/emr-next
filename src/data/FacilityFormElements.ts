import { FormField } from "@/types/form";

export const FacilityFormElements: FormField[] = [    
  {
    "type": "text",
    "name": "name",
    "label": "NAME",
    "placeholder": "",
    "required": true,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-6",
    "order": 1
  },
  {
    "type": "text",
    "name": "contact_name",
    "label": "CONTACT_NAME",
    "placeholder": "",
    "required": true,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-6",
    "order": 2
  },
  {
    "type": "text",
    "name": "address1",
    "label": "ADDRESS1",
    "placeholder": "",
    "required": true,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-6",
    "order": 3
  },
  {
    "type": "text",
    "name": "address2",
    "label": "ADDRESS2",
    "placeholder": "",
    "required": false,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-6",
    "order": 4
  },
  {
    "type": "text",
    "name": "address3",
    "label": "ADDRESS3",
    "placeholder": "",
    "required": false,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-6",
    "order": 5
  },
  {
    "type": "text",
    "name": "county",
    "label": "COUNTY",
    "placeholder": "",
    "required": true,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-6",
    "order": 6
  },
  {
    "type": "text",
    "name": "country",
    "label": "COUNTRY",
    "placeholder": "",
    "required": true,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-6",
    "order": 7
  },
  {
    "type": "text",
    "name": "eircode",
    "label": "EIRCODE",
    "placeholder": "",
    "required": true,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-6",
    "order": 8
  },
  {
    "type": "text",
    "name": "phone_no",
    "label": "PHONE_NO",
    "placeholder": "",
    "required": false,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-6",
    "order": 9
  },
  {
    "type": "text",
    "name": "mobile_no",
    "label": "MOBILE_NO",
    "placeholder": "",
    "required": false,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-6",
    "order": 10
  },
  {
    "type": "text",
    "name": "location",
    "label": "LOCATION",
    "placeholder": "",
    "required": false,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-6",
    "order": 11
  },
  {
    "type": "switch",
    "name": "is_archive",
    "label": "ARCHIVE",
    "options": [
      { "label": "", "value": "0" }
    ],
    "required": false,
    "colClass": "col-sm-6",
    "order": 12
  }
];