import { FormField } from "@/types/form";

export const NoteFormElements: FormField[] = [
  {
    "type": "date",
    "name": "date",
    "label": "DATE",
    "required": false,
    "disablePrevDate": false,
    "disableFutureDate": false,
    "order": 1
  },
  {
    "type": "dropdown",
    "name": "status_id",
    "label": "STATUS",
    "options": [],
    "required": true,
    "defaultValue": "open",
    "multiple": false,
    "order": 2
  },
  {
    "type": "textarea",
    "name": "notes",
    "label": "NOTES",
    "placeholder": "Please enter your notes here...",
    "required": true,
    "rows": 6,
    "order": 3
  }
];