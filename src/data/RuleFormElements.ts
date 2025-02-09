import { FormField } from "@/types/form";

export const RuleFormElements: FormField[] = [
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
    "name": "module_id",
    "label": "MODULE",
    "options": [],
    "required": true,
    "multiple": false,
    "colClass": "col-sm-6",
    "order": 2
  }
];