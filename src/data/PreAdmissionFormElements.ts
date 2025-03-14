import { FormField } from "@/types/form";

export const PreAdmissionFormElements: FormField[] = [
  {
    "type": "text",
    "name": "patient_name",
    "label": "Patient Name",
    "required": false,
    "colClass": "col-sm-6",
    "order": 1
  },
  {
    "type": "text",
    "name": "doctor_name",
    "label": "Doctor Name",
    "required": false,
    "colClass": "col-sm-6",    
    "order": 2
  },
  {
    "type": "dropdown",
    "name": "status",
    "label": "Status",
    "options": [
      { "label": "Open", "value": "open" },
      { "label": "Close", "value": "close" },
    ],
    "required": true,
    "defaultValue": "open",
    "multiple": false,
    "order": 2
  },
  {
    "type": "textarea",
    "name": "notes",
    "label": "Notes",
    "placeholder": "Please enter your notes here...",
    "required": true,
    "rows": 6,
    "order": 6
  }
];