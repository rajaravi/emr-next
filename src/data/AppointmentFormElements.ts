import { FormField } from "@/types/form";

export const AppointmentFormElements: FormField[] = [
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
    "colClass": "col-sm-6",
    "order": 6
  },
  {
    "type": "text",
    "name": "from_time",
    "label": "FROM_TIME",
    "placeholder": "",
    "required": false,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-6",
    "order": 7
  },
  {
    "type": "textarea",
    "name": "notes",
    "label": "NOTES",
    "placeholder": "",
    "required": true,
    "rows": 6,
    "order": 8
  },
  {
    "type": "dropdown",
    "name": "status_id",
    "label": "STATUS",
    "options": [],
    "required": true,
    "multiple": false,
    "colClass": "col-sm-6",
    "order": 9
  }
];