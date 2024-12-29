import { FormField } from "@/types/form";

export const DoctorFormElements: FormField[] = [
  {
    "type": "dropdown",
    "name": "designation_id",
    "label": "DESTINATION",
    "options": [
      { "label": "Mr", "value": "1" },
      { "label": "Dr", "value": "2" },
      { "label": "Fr", "value": "3" },
      { "label": "Master", "value": "4" },
      { "label": "Messrs", "value": "5" },
      { "label": "Miss", "value": "6" },
    ],
    "required": true,
    "defaultValue": "mrs",
    "multiple": false,
    "colClass": "col-sm-6",
    "order": 1
  },
  {
    "type": "text",
    "name": "short_name",
    "label": "SHORT_NAME",
    "placeholder": "Short Name",
    "required": true,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-6",
    "order": 2
  },
  {
    "type": "text",
    "name": "name",
    "label": "NAME",
    "placeholder": "Name",
    "required": true,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-6",
    "order": 3
  },
  {
    "type": "text",
    "name": "degree",
    "label": "DEGREE",
    "placeholder": "Degree",
    "required": true,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-6",
    "order": 4
  },
  {
    "type": "dropdown",
    "name": "speciality_id",
    "label": "SPECIALITY",
    "options": [
      { "label": "Orthopaedic", "value": "1" },
      { "label": "Radiology", "value": "2" }
    ],
    "required": true,
    "defaultValue": "",
    "multiple": false,
    "colClass": "col-sm-6",
    "order": 5
  },
  {
    "type": "text",
    "name": "contact_person",
    "label": "CONTACT_PERSON",
    "placeholder": "Contact Person",
    "required": false,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-6",
    "order": 6
  },
  {
    "type": "text",
    "name": "contact_no",
    "label": "CONTACT_NO",
    "placeholder": "Contact No",
    "required": false,
    "validation": { "minLength": 2 },
    "colClass": "col-sm-6",
    "order": 7
  },
  {
    "type": "switch",
    "name": "is_archive",
    "label": "ARCHIVE",
    "options": [
      { "label": "", "value": "0" }
    ],
    "required": false,
    "colClass": "col-sm-6",
    "order": 8
  }
];