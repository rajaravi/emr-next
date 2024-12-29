import { FormField } from "@/types/form";

export const ProcedureFormElements: FormField[] = [
  {
    "type": "text",
    "name": "name",
    "label": "NAME",
    "placeholder": "Name",
    "required": true,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-6",
    "order": 1
  },
  {
    "type": "text",
    "name": "code",
    "label": "CODE",
    "placeholder": "Code",
    "required": true,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-6",
    "order": 2
  },
  {
    "type": "text",
    "name": "fee",
    "label": "FEE",
    "placeholder": "Fee",
    "required": true,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-6",
    "order": 3
  },
  {
    "type": "color",
    "name": "color_code",
    "label": "COLOR_CODE",
    "placeholder": "Color code",
    "required": true,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-2",
    "value": "#FF961F",
    "order": 4
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
    "order": 5
  }
];