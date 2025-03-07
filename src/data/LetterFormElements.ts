import { FormField } from "@/types/form";

export const LetterFormElements: FormField[] = [
  {
    "type": "date",
    "name": "date",
    "label": "DATE",
    "required": false,
    "disablePrevDate": true,
    "disableFutureDate": false,
    "dateSelection": true, 
    "colClass": "col-sm-3",
    "order": 1
  },
  {
    "type": "dropdown",
    "name": "encounter_id",
    "label": "ENCOUNTER",
    "options": [],
    "required": false,
    "multiple": false,
    "colClass": "col-sm-3",
    "order": 2
  },
  {
    "type": "dropdown",
    "name": "doctor_id",
    "label": "DOCTOR",
    "options": [],
    "required": true,
    "multiple": false,
    "colClass": "col-sm-3",
    "order": 3
  },
  {
    "type": "dropdown",
    "name": "category_id",
    "label": "CATEGORY",
    "options": [],
    "required": true,
    "multiple": false,
    "colClass": "col-sm-3",
    "order": 4
  },
  {
    "type": "dropdown",
    "name": "template_id",
    "label": "TEMPLATE",
    "options": [],
    "required": true,
    "multiple": false,
    "colClass": "col-sm-3",
    "order": 5
  },
  {
    "type": "textarea",
    "name": "description",
    "label": "DESCRIPTION",
    "placeholder": "",
    "required": true,
    "rows": 2,
    "colClass": "col-sm-9",
    "order": 6
  }
];