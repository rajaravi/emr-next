import { FormField } from "@/types/form";

export const DrugFormElements: FormField[] = [
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
    "name": "trade_name",
    "label": "TRADE_NAME",
    "placeholder": "",
    "required": true,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-12",
    "order": 2
  },
  {
    "type": "text",
    "name": "generic_name",
    "label": "GENERIC_NAME",
    "placeholder": "",
    "required": true,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-12",
    "order": 3
  },
  {
    "type": "text",
    "name": "manufacturer",
    "label": "MANUFACTURER",
    "placeholder": "",
    "required": true,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-12",
    "order": 4
  }
];