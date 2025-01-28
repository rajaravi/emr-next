import { FormField } from "@/types/form";

export const SurgeryFormElements: FormField[] = [
  {
    "type": 'typeaheadDynamic',
    "name": 'patient',
    "label": 'PATIENT',
    "options": [],
    "required": true,
    "colClass": "col-sm-4",
    "order": 1
  },
  {
    "type": "dropdown",
    "name": "encounter_id",
    "label": "EPISODE",
    "options": [],
    "required": false,
    "multiple": false,
    "colClass": "col-sm-4",
    "order": 2
  },
  {
    "type": "dropdown",
    "name": "doctor_id",
    "label": "DOCTOR",
    "options": [],
    "required": true,
    "multiple": false,
    "colClass": "col-sm-4",
    "order": 3
  },
  {
    "type": "dropdown",
    "name": "location_id",
    "label": "LOCATION",
    "options": [],
    "required": true,
    "multiple": false,
    "colClass": "col-sm-4",
    "order": 4
  },
  {
    "type": "date",
    "name": "date",
    "label": "DATE",
    "required": true,
    "disablePrevDate": true,
    "disableFutureDate": false,
    "colClass": "col-sm-4",
    "order": 5
  },
  {
    "type": "time",
    "name": "from_time",
    "label": "FROM_TIME",
    "placeholder": "",
    "required": false,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-2",
    "order": 6
  },
  {
    "type": "time",
    "name": "to_time",
    "label": "TO_TIME",
    "placeholder": "",
    "required": false,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-2",
    "order": 7
  },
  {
    "type": "date",
    "name": "admission_date",
    "label": "ADMISSION_DATE",
    "required": false,
    "disablePrevDate": true,
    "disableFutureDate": false,
    "colClass": "col-sm-4",
    "order": 8
  },
  {
    "type": "date",
    "name": "discharge_date",
    "label": "DISCHARGE_DATE",
    "required": false,
    "disablePrevDate": true,
    "disableFutureDate": false,
    "dateSelection": false, 
    "colClass": "col-sm-4",
    "order": 9
  },
  {
    "type": "time",
    "name": "discharge_time",
    "label": "DISCHARGE_TIME",
    "placeholder": "",
    "required": false,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-2",
    "order": 10
  },
  {
    "type": "textarea",
    "name": "notes",
    "label": "NOTES",
    "placeholder": "",
    "required": true,
    "rows": 3,
    "colClass": "col-sm-8",
    "order": 11
  },
  {
    "type": "dropdown",
    "name": "status_id",
    "label": "STATUS",
    "options": [],
    "required": true,
    "multiple": false,
    "colClass": "col-sm-4",
    "order": 12
  }
];