import { FormField } from "@/types/form";

 export const PatientFormElements: FormField[] = [
    {
      "type": "dropdown",
      "name": "title",
      "label": "Title",
      "options": [
        { "label": "Br", "value": "br" },
        { "label": "Mr", "value": "mr" },
        { "label": "Canon", "value": "canon" },
        { "label": "Dr", "value": "dr" },
        { "label": "Fr", "value": "fr" },
        { "label": "Master", "value": "master" },
        { "label": "Messrs", "value": "messrs" },
        { "label": "Miss", "value": "miss" },
      ],
      "required": false,
      "defaultValue": "mrs",
      "multiple": false, 
      "order": 1
    },
    {
      "type": "text",
      "name": "firstName",
      "label": "First Name",
      "placeholder": "Enter your first name",
      "required": true,
      "validation": { "minLength": 2 },
      "order": 2
    },
    {
      "type": "text",
      "name": "surName",
      "label": "Surname",
      "placeholder": "Enter your surname",
      "required": true,
      "validation": { "minLength": 2 },
      "order": 3
    },
    {
      "type": "date",
      "name": "dob",
      "label": "Date of Birth",
      "required": true,
      "disablePrevDate": false,
      "disableFutureDate": true,
      "order": 4
    },
    {
      "type": "dropdown",
      "name": "gender",
      "label": "Gender",
      "options": [
        { "label": "Male", "value": "male" },
        { "label": "Female", "value": "female" },
        { "label": "Transgender", "value": "transgender" }
      ],
      "required": false,
      "defaultValue": "female",
      "multiple": false, 
      "order": 5
    },
    {
      "type": "text",
      "name": "address1",
      "label": "Address 1",
      "placeholder": "Enter your address",
      "required": false,
      "validation": { "minLength": 2 },
      "order": 6
    },
    {
      "type": "radio",
      "name": "sendEmail",
      "label": "Send Email",
      "options": [
        { "label": "Yes", "value": "1" },
        { "label": "No", "value": "0" }
      ],
      "required": false,
      "order": 7
    },
    // {
    //   "type": "checkbox",
    //   "name": "hobbies",
    //   "label": "Hobbies",
    //   "options": [
    //     { "label": "Reading", "value": "reading" },
    //     { "label": "Traveling", "value": "traveling" }
    //   ],
    //   "required": true,
    //   "order": 6
    // },
    {
      "type": "submit",
      "name": "submit",
      "value": "Submit",
      "order": 100
    }
  ];