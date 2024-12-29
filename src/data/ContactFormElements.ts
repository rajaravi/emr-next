import { FormField } from "@/types/form";

export const ContactFormElements: FormField[] = [
  {
    "type": "dropdown",
    "name": "designation_id",
    "label": "DESTINATION",
    "options": [],
    "required": true,
    "defaultValue": "mrs",
    "multiple": false,
    "colClass": "col-sm-6",
    "order": 1
  },
  {
    "type": "text",
    "name": "firstname",
    "label": "FIRSTNAME",
    "placeholder": "First Name",
    "required": true,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-6",
    "order": 2
  },
  {
    "type": "text",
    "name": "surname",
    "label": "SURNAME",
    "placeholder": "Surname",
    "required": true,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-6",
    "order": 3
  },
  {
    "type": "text",
    "name": "organization",
    "label": "ORGANIZATION",
    "placeholder": "Organization",
    "required": true,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-6",
    "order": 4
  },
  {
    "type": "dropdown",
    "name": "profession_id",
    "label": "PROFESSION",
    "options": [],
    "required": true,
    "defaultValue": "",
    "multiple": false, 
    "colClass": "col-sm-6",
    "order": 5
  },
  {
    "type": "text",
    "name": "address1",
    "label": "ADDRESS1",
    "placeholder": "Address 1",
    "required": true,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-6",
    "order": 6
  },
  {
    "type": "text",
    "name": "address2",
    "label": "ADDRESS2",
    "placeholder": "Address 2",
    "required": false,
    "validation": {},
    "colClass": "col-sm-6",
    "order": 7
  },
  {
    "type": "text",
    "name": "address3",
    "label": "ADDRESS3",
    "placeholder": "Address 3",
    "required": false,
    "validation": {},
    "colClass": "col-sm-6",
    "order": 8
  },
  {
    "type": "text",
    "name": "county",
    "label": "COUNTY",
    "placeholder": "County",
    "required": false,
    "validation": {},
    "colClass": "col-sm-6",
    "order": 9
  },
  {
    "type": "text",
    "name": "eircode",
    "label": "EIRCODE",
    "placeholder": "Eir code",
    "required": false,
    "validation": {},
    "colClass": "col-sm-6",
    "order": 10
  },
  {
    "type": "text",
    "name": "phone",
    "label": "PHONE",
    "placeholder": "Phone",
    "required": false,
    "validation": {},
    "colClass": "col-sm-6",
    "order": 11
  },
  {
    "type": "text",
    "name": "mobile",
    "label": "MOBILE",
    "placeholder": "Mobile",
    "required": true,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-6",
    "order": 12
  },
  {
    "type": "email",
    "name": "email",
    "label": "EMAIL",
    "placeholder": "Email",
    "required": true,
    "pattern": "^[^\s@]+@[^\s@]+\.[^\s@]+$",
    "colClass": "col-sm-6",
    "order": 13
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
    "order": 14
  }
];