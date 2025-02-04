import { FormField } from "@/types/form";

export const PurchaserFormElements: FormField[] = [
  {
    "type": "text",
    "name": "name",
    "label": "NAME",
    "placeholder": "Name",
    "required": true,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-12",
    "order": 1
  },
  {
    "type": "dropdown",
    "name": "purchaser_type_id",
    "label": "PURCHASER_TYPE",
    "options": [],
    "required": true,
    "multiple": false,
    "colClass": "col-sm-12",
    "order": 2
  },  
  {
    "type": "switch",
    "name": "is_active",
    "label": "STATUS",
    "options": [
      { "label": "", "value": "0" }
    ],
    "required": false,
    "colClass": "col-sm-6",
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
    "colClass": "col-sm-6",
    "order": 4
  }
];