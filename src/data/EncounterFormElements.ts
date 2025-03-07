import { FormField } from "@/types/form";

export const EncounterFormElements: FormField[] = [
    {
        "type": "date",
        "name": "start_date",
        "label": "START_DATE",
        "required": false,
        "disablePrevDate": true,
        "disableFutureDate": false,
        "dateSelection": true, 
        "colClass": "col-sm-6",
        "order": 1
    },
    {
        "type": "text",
        "name": "name",
        "label": "NAME",
        "placeholder": "",
        "required": true,
        "validation": { "minLength": 2 },
        "colClass": "col-sm-12",
        "order": 2
    },  
    {
        "type": "switch",
        "name": "is_active",
        "label": "STATUS",
        "options": [
        { "label": "", "value": "0" }
        ],
        "required": false,
        "colClass": "col-sm-12",
        "order": 3
    }
];