import { FormField } from "@/types/form";

export const ScanFormElements: FormField[] = [
    {
        "type": "date",
        "name": "date",
        "label": "DATE",
        "required": true,
        "disablePrevDate": true,
        "disableFutureDate": false,
        "dateSelection": true, 
        "colClass": "col-sm-2",
        "order": 1
    },
    {
        "type": "dropdown",
        "name": "doctor_id",
        "label": "DOCTOR",
        "options": [],
        "required": true,
        "multiple": false,
        "colClass": "col-sm-5",
        "order": 2
    },
    {
        "type": "dropdown",
        "name": "category_id",
        "label": "CATEGORY",
        "options": [],
        "required": true,
        "multiple": false,
        "colClass": "col-sm-5",
        "order": 3
    },
    {
        "type": "textarea",
        "name": "description",
        "label": "DESCRIPTION",
        "placeholder": "",
        "required": true,
        "rows": 2,
        "colClass": "col-sm-12",
        "order": 4
    }

];