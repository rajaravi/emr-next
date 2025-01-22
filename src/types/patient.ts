export interface Patient {
    id: number;
    designation_id: number;
    first_name: string;
    surname: string;
    full_name: string;
    address1: string;
    address2: string;
    address3: string;
    county: string;
    country: string;
    eircode: string;
    mrn_no: string;
    doctor_id: number;
    shared_doctor_ids: string;
    patient_type_id: number;
    dob: Date;
    gender_id: number;
    home_phone_no: string;
    work_phone_no: string;
    mobile_no: string;
    email: string;
    is_archive: boolean;
};

// Define headers with a show/hide toggle
export const typeaheadColumnConfig = [
  { key: 'id', name: 'Patient ID', show: false },
  { key: 'full_name', name: 'Patient Name', show: true },
  { key: 'mrn_no', name: 'MRN', show: true },
  { key: 'dob', name: 'DOB', show: true },
];

export const samplePatients: Patient[] = [
    {
      id: 1,
      designation_id: 101,
      first_name: "John",
      surname: "Doe",
      full_name: "John Doe",
      address1: "123 Main Street",
      address2: "Apartment 4B",
      address3: "",
      county: "Dublin",
      country: "Ireland",
      eircode: "D02YX77",
      mrn_no: "MRN123456",
      doctor_id: 201,
      shared_doctor_ids: "202,203,204",
      patient_type_id: 1,
      dob: new Date("1985-07-20"),
      gender_id: 1,
      home_phone_no: "01-2345678",
      work_phone_no: "01-8765432",
      mobile_no: "+353-86-1234567",
      email: "johndoe@example.com",
      is_archive: false
    },
    {
      id: 2,
      designation_id: 102,
      first_name: "Jane",
      surname: "Smith",
      full_name: "Jane Smith",
      address1: "456 Oak Avenue",
      address2: "",
      address3: "",
      county: "Galway",
      country: "Ireland",
      eircode: "H91X5Y4",
      mrn_no: "MRN654321",
      doctor_id: 202,
      shared_doctor_ids: "201,203",
      patient_type_id: 2,
      dob: new Date("1990-05-15"),
      gender_id: 2,
      home_phone_no: "091-123456",
      work_phone_no: "091-654321",
      mobile_no: "+353-87-7654321",
      email: "janesmith@example.com",
      is_archive: false
    },
    {
      id: 3,
      designation_id: 103,
      first_name: "Michael",
      surname: "Brown",
      full_name: "Michael Brown",
      address1: "789 Pine Street",
      address2: "Suite 10",
      address3: "",
      county: "Cork",
      country: "Ireland",
      eircode: "T12X5Y6",
      mrn_no: "MRN987654",
      doctor_id: 203,
      shared_doctor_ids: "202,204",
      patient_type_id: 1,
      dob: new Date("1978-03-12"),
      gender_id: 1,
      home_phone_no: "021-987654",
      work_phone_no: "021-123456",
      mobile_no: "+353-86-9876543",
      email: "michaelbrown@example.com",
      is_archive: true
    },
    {
      id: 4,
      designation_id: 104,
      first_name: "Emily",
      surname: "Davis",
      full_name: "Emily Davis",
      address1: "321 Birch Road",
      address2: "",
      address3: "Village Center",
      county: "Limerick",
      country: "Ireland",
      eircode: "V94X5Y7",
      mrn_no: "MRN456789",
      doctor_id: 204,
      shared_doctor_ids: "201,202,203",
      patient_type_id: 2,
      dob: new Date("1982-11-30"),
      gender_id: 2,
      home_phone_no: "061-456789",
      work_phone_no: "061-987654",
      mobile_no: "+353-87-6543210",
      email: "emilydavis@example.com",
      is_archive: false
    },
    {
      id: 5,
      designation_id: 105,
      first_name: "Liam",
      surname: "Wilson",
      full_name: "Liam Wilson",
      address1: "654 Elm Street",
      address2: "",
      address3: "",
      county: "Waterford",
      country: "Ireland",
      eircode: "X91X5Y8",
      mrn_no: "MRN123789",
      doctor_id: 205,
      shared_doctor_ids: "201,202",
      patient_type_id: 1,
      dob: new Date("1995-02-25"),
      gender_id: 1,
      home_phone_no: "051-123789",
      work_phone_no: "051-789123",
      mobile_no: "+353-85-1234567",
      email: "liamwilson@example.com",
      is_archive: true
    }
  ];
  
