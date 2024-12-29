import { FormField } from "@/types/form";

export const UserFormElements: FormField[] = [
  {
    "type": "text",
    "name": "name",
    "label": "NAME",
    "placeholder": "",
    "required": true,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-12",
    "order": 1
  },
  {
    "type": "text",
    "name": "username",
    "label": "USERNAME",
    "placeholder": "",
    "required": true,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-12",
    "order": 2
  },
  {
    "type": "text",
    "name": "email",
    "label": "EMAIL",
    "placeholder": "",
    "required": true,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-12",
    "order": 3
  },
  {
    "type": "dropdown",
    "name": "role_id",
    "label": "ROLE",
    "options": [
      { "label": "Admin", "value": "1" },
      { "label": "Secretary", "value": "2" }
    ],
    "required": true,
    "defaultValue": "",
    "multiple": false,
    "colClass": "col-sm-12",
    "order": 4
  },
  {
    "type": "switch",
    "name": "is_active",
    "label": "STATUS",
    "options": [
      { "label": "", "value": "0" }
    ],
    "required": false,
    "colClass": "col-sm-12",
    "order": 5
  }
];