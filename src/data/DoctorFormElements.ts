import { FormField } from "@/types/form";

 export const DoctorFormElements: FormField[] = [
    {
      "type": "dropdown",
      "name": "designation_id",
      "label": "Destination",
      "options": [
        { "label": "Mr", "value": "mr" },
        { "label": "Dr", "value": "dr" },
        { "label": "Fr", "value": "fr" },
        { "label": "Master", "value": "master" },
        { "label": "Messrs", "value": "messrs" },
        { "label": "Miss", "value": "miss" },
      ],
      "required": true,
      "defaultValue": "mrs",
      "multiple": false, 
      "order": 1
    },
    {
      "type": "text",
      "name": "short_name",
      "label": "Short Name",
      "placeholder": "",
      "required": true,
      "validation": { "minLength": 2 },
      "order": 2
    },
    {
      "type": "text",
      "name": "name",
      "label": "Name",
      "placeholder": "",
      "required": true,
      "validation": { "minLength": 2 },
      "order": 3
    },
    {
      "type": "text",
      "name": "degree",
      "label": "Degree",
      "placeholder": "",
      "required": true,
      "validation": { "minLength": 2 },
      "order": 4
    },
    {
      "type": "dropdown",
      "name": "speciality_id",
      "label": "Speciality",
      "options": [
        { "label": "Orthopaedic", "value": "1" },
        { "label": "Radiology", "value": "2" }        
      ],
      "required": true,
      "defaultValue": "",
      "multiple": false, 
      "order": 5
    },
    {
      "type": "text",
      "name": "contact_person",
      "label": "Contact Person",
      "placeholder": "",
      "required": false,
      "validation": { "minLength": 2 },
      "order": 6
    },
    {
      "type": "text",
      "name": "contact_no",
      "label": "Contact No",
      "placeholder": "",
      "required": false,
      "validation": { "minLength": 2 },
      "order": 7
    },
    {
      "type": "checkbox",
      "name": "is_archive",
      "label": "Archive",
      "options": [
        { "label": "Yes", "value": "1" }        
      ],
      "required": true,
      "order": 8
    }
  ];