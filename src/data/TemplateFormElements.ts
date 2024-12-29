import { FormField } from "@/types/form";

 export const TemplateFormElements: FormField[] = [
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
    "type": "dropdown",
    "name": "doctor_id",
    "label": "DOCTOR",
    "options": [
      { "label": "Subhu", "value": "1" },
      { "label": "Kumar", "value": "2" },
    ],
    "required": true,
    "multiple": false, 
    "colClass": "col-sm-3",
    "order": 2
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
    "order": 3
  }
];