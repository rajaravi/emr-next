import { FormField } from "@/types/form";

 export const NotesFormElements: FormField[] = [
    
    {
      "type": "date",
      "name": "date",
      "label": "Date",
      "required": true,
      "disablePrevDate": true,
      "disableFutureDate": false,
      "order": 1
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