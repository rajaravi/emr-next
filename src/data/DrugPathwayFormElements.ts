import { FormField } from "@/types/form";

export const DrugPathwayFormElements: FormField[] = [
  {
    "type": "text",
    "name": "code",
    "label": "CODE",
    "placeholder": "",
    "required": true,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-12",
    "order": 1
  },
  {
    "type": "text",
    "name": "name",
    "label": "NAME",
    "placeholder": "",
    "required": true,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-12",
    "order": 2
  },
  {
    "type": "switch",
    "name": "is_default",
    "label": "DEFAULT",
    "options": [
      { "label": "", "value": "0" }
    ],
    "required": false,
    "colClass": "col-sm-12",
    "order": 3
  },
  {
    "type": "switch",
    "name": "is_archive",
    "label": "ARCHIVE",
    "options": [
      { "label": "", "value": "0" }
    ],
    "required": false,
    "colClass": "col-sm-12",
    "order": 4
  }
];