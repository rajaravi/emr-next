import { FormField } from "@/types/form";

export const SOAPNoteFormElements: FormField[] = [
  {
    "type": "textarea",
    "name": "subjective",
    "label": "SUBJECTIVE",
    "placeholder": "",
    "required": false,
    "rows": 3,
    "order": 1
  },
  {
    "type": "textarea",
    "name": "objective",
    "label": "OBJECTIVE",
    "placeholder": "",
    "required": false,
    "rows": 3,
    "order": 2
  },
  {
    "type": "textarea",
    "name": "assesment",
    "label": "ASSESSMENT",
    "placeholder": "",
    "required": false,
    "rows": 3,
    "order": 3
  },
  {
    "type": "textarea",
    "name": "plan",
    "label": "PLAN",
    "placeholder": "",
    "required": false,
    "rows": 3,
    "order": 4
  }
];