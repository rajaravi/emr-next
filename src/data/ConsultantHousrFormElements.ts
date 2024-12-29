import { FormField } from "@/types/form";

export const ConsultantHousrFormElements: FormField[] = [
  {
    "type": "text",
    "name": "description",
    "label": "DESCRIPTION",
    "placeholder": "",
    "required": true,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-5",
    "order": 1
  },
  {
    "type": "dropdown",
    "name": "consultant_id",
    "label": "CONSULTANT",
    "options": [],
    "required": true,
    "defaultValue": "",
    "multiple": false,
    "colClass": "col-sm-3",
    "order": 2
  },  
  {
    "type": "date",
    "name": "from_date",
    "label": "FROM_DATE",
    "required": true,
    "disablePrevDate": true,
    "disableFutureDate": false,
    "colClass": "col-sm-2",
    "order": 3
  },
  {
    "type": "date",
    "name": "to_date",
    "label": "TO_DATE",
    "required": true,
    "disablePrevDate": true,
    "disableFutureDate": false,
    "colClass": "col-sm-2",
    "order": 4
  }  
];