import { FormField } from "@/types/form";

export const AppointmentFormElements: FormField[] = [
  {
    "type": 'typeaheadDynamic',
    "name": 'patients',
    "label": 'PATIENT',
    "options": [],
    "required": true,
    "colClass": "col-sm-6",
    "order": 1
  },
  {
    "type": "dropdown",
    "name": "encounter_id",
    "label": "EPISODE",
    "options": [],
    "required": false,
    "multiple": false,
    "colClass": "col-sm-6",
    "order": 2
  },
  {
    "type": "dropdown",
    "name": "doctor_id",
    "label": "DOCTOR",
    "options": [],
    "required": true,
    "multiple": false,
    "colClass": "col-sm-6",
    "order": 3
  },
  {
    "type": "dropdown",
    "name": "location_id",
    "label": "LOCATION",
    "options": [],
    "required": true,
    "multiple": false,
    "colClass": "col-sm-6",
    "order": 4
  },
  {
    "type": "dropdown",
    "name": "appointment_type_id",
    "label": "APPOINTMENT_TYPE",
    "options": [],
    "required": true,
    "multiple": false,
    "colClass": "col-sm-6",
    "order": 5
  },
  {
    "type": "date",
    "name": "date",
    "label": "DATE",
    "required": true,
    "disablePrevDate": true,
    "disableFutureDate": false,
    "dateSelection": true, 
    "colClass": "col-sm-3",
    "order": 6
  },
  {
    "type": "textarea",
    "name": "notes",
    "label": "NOTES",
    "placeholder": "",
    "required": true,
    "rows": 4,
    "order": 9
  },
  {
    "type": "dropdown",
    "name": "status_id",
    "label": "STATUS",
    "options": [],
    "required": true,
    "multiple": false,
    "colClass": "col-sm-6",
    "order": 10
  }
];