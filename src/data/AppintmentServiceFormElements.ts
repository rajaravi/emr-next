import { FormField } from "@/types/form";

export const AppintmentServiceFormElements: FormField[] = [
  {
    "type": "text",
    "name": "code",
    "label": "CODE",
    "placeholder": "Code",
    "required": true,
    "validation": { "minLength": 2, "maxLength": 4 },
    "colClass": "col-sm-3",
    "order": 1
  },
  {
    "type": "text",
    "name": "name",
    "label": "NAME",
    "placeholder": "Name",
    "required": true,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-6",
    "order": 2
  },
  {
    "type": "color",
    "name": "color_code",
    "label": "COLOR_CODE",
    "placeholder": "Color code",
    "required": true,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-3",
    "value": "#FF961F",
    "order": 3
  },
  {
    "type": "text",
    "name": "fee",
    "label": "FEE",
    "placeholder": "Fee",
    "required": true,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-3",
    "order": 4
  },
  {
    "type": "text",
    "name": "duration",
    "label": "DURATION",
    "placeholder": "Duration",
    "required": true,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-3",
    "order": 5
  },
  {
    "type": "switch",
    "name": "is_available_online",
    "label": "AVAILABLE_ONLINE",
    "options": [
      { "label": "", "value": "0" }
    ],
    "required": false,
    "colClass": "col-sm-3",
    "order": 6
  },
  {
    "type": "switch",
    "name": "is_archive",
    "label": "ARCHIVE",
    "options": [
      { "label": "", "value": "0" }
    ],
    "required": false,
    "colClass": "col-sm-3",
    "order": 7
  },
  {
    "type": "textarea",
    "name": "notes",
    "label": "NOTES",
    "placeholder": "Please enter your notes here...",
    "required": false,
    "rows": 3,
    "order": 8
  }
];