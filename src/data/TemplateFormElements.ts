import { FormField } from "@/types/form";

 export const TemplateFormElements: FormField[] = [
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
    "name": "doctor_id",
    "label": "DOCTOR",
    "options": [
      {"label": "James Caren", "value": "8"},
      {"label": "Subramanian", "value": "16"}, 
      {"label": "sample", "value": "18"},
      {"label": "Caoimhe Saoirse", "value": "21"},
      {"label": "Fionn Ronan", "value": "22"},
      {"label": "Brian Nolan", "value": "23"},
      {"label": "Joseph MacCormack", "value": "24"},
      {"label": "Jones Jack", "value": "25"},
      {"label": "Subhu", "value": "26"}
    ],
    "required": true,
    "multiple": false, 
    "colClass": "col-sm-3",
    "order": 2
  },
  {
    "type": "switch",
    "name": "is_archive",
    "label": "ARCHIVE",
    "options": [
      { "label": "", "value": "0" }
    ],
    "required": false,
    "colClass": "col-sm-3",
    "order": 3
  }
];