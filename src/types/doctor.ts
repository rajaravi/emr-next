

interface References {
  reference_value: string;
  reference_id: number;
}

export interface DoctorModel {
    id?: number | null;
    designation_id: number;
    speciality_id: number;
    name: string;
    short_name: string;
    degree: string;
    contact_person?: string | null;
    contact_no?: string;
    is_archive: boolean;
    references: References[];
}
export interface DoctorTable {
    name: string;
    doctor_id: number;
    speciality: string;    
    contact_name: string;
    contact_no: string;
};

export const sampleDoctors: DoctorTable[] = [
    {
        name: 'Pádraig Donlon',
        doctor_id: 3,
        speciality: 'Orthopaedic Surgeon',
        contact_name: 'Aoibhinn Haren',
        contact_no: '3539889002',
    },
    {
        name: 'Millie Phelan',
        doctor_id: 4,
        speciality: 'General Practioner',
        contact_name: 'Cathal Raferty',
        contact_no: '3538002029',
    },
    {
        name: 'Hunter Jennings',
        doctor_id: 5,
        speciality: 'Anesthesit',
        contact_name: 'Cathy Lee',
        contact_no: '3538920829',
    },
];

export const doctorList = {
    "success": true,
    "data": {
        "current_page": 1,
        "per_page": 10,
        "total": 5,
        "list": [
            {
                "id": 1,
                "designation_id": 1,
                "name": "Zack Morris",
                "short_name": "Zack",
                "degree": "MBBS FRCS",
                "speciality_id": 2,
                "contact_person": "Aiden O'Shannon",
                "contact_no": "9940406824",
                "is_archive": true,
                "created_at": "13-05-2024 11:33:54",
                "speciality": {
                    "id": 2,
                    "name": "Dermatology",
                    "is_archive": true,
                    "created_user_id": 1,
                    "updated_user_id": 1,
                    "deleted_user_id": null,
                    "created_at": "29-06-2024 17:09:22",
                    "updated_at": "2024-11-08T12:31:29.000000Z",
                    "deleted_at": null
                },
                "references": [
                    {
                        "id": 7,
                        "doctor_id": 1,
                        "reference_id": 1,
                        "reference_value": "F67J02",
                        "created_user_id": 1,
                        "updated_user_id": null,
                        "deleted_user_id": null,
                        "created_at": "2024-07-26T08:30:00.000000Z",
                        "updated_at": "2024-07-26T08:30:00.000000Z",
                        "deleted_at": null
                    },
                    {
                        "id": 9,
                        "doctor_id": 1,
                        "reference_id": 2,
                        "reference_value": "G35H75",
                        "created_user_id": 1,
                        "updated_user_id": null,
                        "deleted_user_id": null,
                        "created_at": "2024-07-26T08:30:00.000000Z",
                        "updated_at": "2024-07-26T08:30:00.000000Z",
                        "deleted_at": null
                    },
                    {
                        "id": 11,
                        "doctor_id": 1,
                        "reference_id": 1,
                        "reference_value": "fererewrew",
                        "created_user_id": 1,
                        "updated_user_id": null,
                        "deleted_user_id": null,
                        "created_at": "2024-07-26T08:30:00.000000Z",
                        "updated_at": "2024-07-26T08:30:00.000000Z",
                        "deleted_at": null
                    },
                    {
                        "id": 13,
                        "doctor_id": 1,
                        "reference_id": 2,
                        "reference_value": "3we434",
                        "created_user_id": 1,
                        "updated_user_id": null,
                        "deleted_user_id": null,
                        "created_at": "2024-07-26T08:30:00.000000Z",
                        "updated_at": "2024-07-26T08:30:00.000000Z",
                        "deleted_at": null
                    }
                ]
            },
            {
                "id": 8,
                "designation_id": null,
                "name": "James Caren",
                "short_name": "James",
                "degree": "MBBS",
                "speciality_id": null,
                "contact_person": "Aiden O'Shannon",
                "contact_no": "9940406824",
                "is_archive": true,
                "created_at": "26-07-2024 06:49:01",
                "speciality": null,
                "references": []
            },
            {
                "id": 14,
                "designation_id": 2,
                "name": "dsf",
                "short_name": "dsfd",
                "degree": "sad",
                "speciality_id": 1,
                "contact_person": "sdaf",
                "contact_no": "sdaf",
                "is_archive": true,
                "created_at": "08-11-2024 14:31:29",
                "speciality": {
                    "id": 1,
                    "name": "Consultant",
                    "is_archive": true,
                    "created_user_id": 1,
                    "updated_user_id": 1,
                    "deleted_user_id": null,
                    "created_at": "13-05-2024 11:32:56",
                    "updated_at": "2024-11-08T12:31:19.000000Z",
                    "deleted_at": null
                },
                "references": [
                    {
                        "id": 14,
                        "doctor_id": 14,
                        "reference_id": 2,
                        "reference_value": "xsdf",
                        "created_user_id": 1,
                        "updated_user_id": null,
                        "deleted_user_id": null,
                        "created_at": "2024-11-08T14:31:29.000000Z",
                        "updated_at": "2024-11-08T14:31:29.000000Z",
                        "deleted_at": null
                    },
                    {
                        "id": 17,
                        "doctor_id": 14,
                        "reference_id": 4,
                        "reference_value": "xsdfg",
                        "created_user_id": 1,
                        "updated_user_id": null,
                        "deleted_user_id": null,
                        "created_at": "2024-11-08T14:31:29.000000Z",
                        "updated_at": "2024-11-08T14:31:29.000000Z",
                        "deleted_at": null
                    }
                ]
            },
            {
                "id": 16,
                "designation_id": 1,
                "name": "Subramanian",
                "short_name": "Subhu",
                "degree": "MBBS FRCS",
                "speciality_id": 1,
                "contact_person": "Vidhu",
                "contact_no": "99379879793",
                "is_archive": true,
                "created_at": "08-11-2024 16:03:35",
                "speciality": {
                    "id": 1,
                    "name": "Consultant",
                    "is_archive": true,
                    "created_user_id": 1,
                    "updated_user_id": 1,
                    "deleted_user_id": null,
                    "created_at": "13-05-2024 11:32:56",
                    "updated_at": "2024-11-08T12:31:19.000000Z",
                    "deleted_at": null
                },
                "references": []
            },
            {
                "id": 18,
                "designation_id": 1,
                "name": "dfsdf",
                "short_name": "ddsf",
                "degree": "sdffsdf",
                "speciality_id": 1,
                "contact_person": "dfsdf",
                "contact_no": "dsfdsf",
                "is_archive": true,
                "created_at": "08-11-2024 16:20:34",
                "speciality": {
                    "id": 1,
                    "name": "Consultant",
                    "is_archive": true,
                    "created_user_id": 1,
                    "updated_user_id": 1,
                    "deleted_user_id": null,
                    "created_at": "13-05-2024 11:32:56",
                    "updated_at": "2024-11-08T12:31:19.000000Z",
                    "deleted_at": null
                },
                "references": [
                    {
                        "id": 19,
                        "doctor_id": 18,
                        "reference_id": 2,
                        "reference_value": "sdfsdf",
                        "created_user_id": 1,
                        "updated_user_id": null,
                        "deleted_user_id": null,
                        "created_at": "2024-11-08T16:20:34.000000Z",
                        "updated_at": "2024-11-08T16:20:34.000000Z",
                        "deleted_at": null
                    }
                ]
            }
        ]
    },
    "message": "Doctors list"
}

export const doctorById = {
    "success": true,
    "data": {
        "data": {
            "id": 1,
            "designation_id": 1,
            "name": "Zack Morris",
            "short_name": "Zack",
            "degree": "MBBS FRCS",
            "speciality_id": 2,
            "contact_person": "Aiden O'Shannon",
            "contact_no": "9940406824",
            "is_archive": true,
            "created_at": "13-05-2024 11:33:54",
            "speciality": {
                "id": 2,
                "name": "Dermatology",
                "is_archive": true,
                "created_user_id": 1,
                "updated_user_id": 1,
                "deleted_user_id": null,
                "created_at": "29-06-2024 17:09:22",
                "updated_at": "2024-11-08T12:31:29.000000Z",
                "deleted_at": null
            },
            "references": [
                {
                    "id": 7,
                    "doctor_id": 1,
                    "reference_id": 1,
                    "reference_value": "F67J02",
                    "created_user_id": 1,
                    "updated_user_id": null,
                    "deleted_user_id": null,
                    "created_at": "2024-07-26T08:30:00.000000Z",
                    "updated_at": "2024-07-26T08:30:00.000000Z",
                    "deleted_at": null
                },
                {
                    "id": 9,
                    "doctor_id": 1,
                    "reference_id": 2,
                    "reference_value": "G35H75",
                    "created_user_id": 1,
                    "updated_user_id": null,
                    "deleted_user_id": null,
                    "created_at": "2024-07-26T08:30:00.000000Z",
                    "updated_at": "2024-07-26T08:30:00.000000Z",
                    "deleted_at": null
                },
                {
                    "id": 11,
                    "doctor_id": 1,
                    "reference_id": 1,
                    "reference_value": "fererewrew",
                    "created_user_id": 1,
                    "updated_user_id": null,
                    "deleted_user_id": null,
                    "created_at": "2024-07-26T08:30:00.000000Z",
                    "updated_at": "2024-07-26T08:30:00.000000Z",
                    "deleted_at": null
                },
                {
                    "id": 13,
                    "doctor_id": 1,
                    "reference_id": 2,
                    "reference_value": "3we434",
                    "created_user_id": 1,
                    "updated_user_id": null,
                    "deleted_user_id": null,
                    "created_at": "2024-07-26T08:30:00.000000Z",
                    "updated_at": "2024-07-26T08:30:00.000000Z",
                    "deleted_at": null
                }
            ],
            "custom_field": []
        },
        "designations": [
            {
                "id": 1,
                "doctor_id": null,
                "description": "Mr",
                "reference": null,
                "sample": null
            },
            {
                "id": 2,
                "doctor_id": null,
                "description": "Ms",
                "reference": null,
                "sample": null
            },
            {
                "id": 3,
                "doctor_id": null,
                "description": "Dr",
                "reference": null,
                "sample": null
            }
        ],
        "specialities": [
            {
                "id": 3,
                "name": "Pathology",
                "is_archive": false,
                "created_at": "29-06-2024 17:09:42"
            },
            {
                "id": 5,
                "name": "Surgery",
                "is_archive": false,
                "created_at": "29-06-2024 17:10:22"
            },
            {
                "id": 13,
                "name": "effsdfsdf",
                "is_archive": false,
                "created_at": "03-07-2024 07:30:48"
            },
            {
                "id": 15,
                "name": "naresh kk",
                "is_archive": false,
                "created_at": "04-07-2024 07:06:59"
            },
            {
                "id": 18,
                "name": "rwedsffds78687",
                "is_archive": false,
                "created_at": "04-07-2024 13:41:03"
            },
            {
                "id": 20,
                "name": "oopsjjkskhsf",
                "is_archive": false,
                "created_at": "04-07-2024 13:48:32"
            },
            {
                "id": 21,
                "name": "saddasdsdadas s ddasd",
                "is_archive": false,
                "created_at": "04-07-2024 14:04:20"
            },
            {
                "id": 28,
                "name": "8979DSIOUSODF",
                "is_archive": false,
                "created_at": "22-07-2024 12:20:38"
            },
            {
                "id": 34,
                "name": "cs asd asdd",
                "is_archive": false,
                "created_at": "22-07-2024 13:06:24"
            },
            {
                "id": 36,
                "name": "sample 378",
                "is_archive": false,
                "created_at": "23-07-2024 05:42:35"
            },
            {
                "id": 37,
                "name": "sadasd",
                "is_archive": false,
                "created_at": "13-10-2024 16:53:45"
            },
            {
                "id": 38,
                "name": "sample testing",
                "is_archive": false,
                "created_at": "14-10-2024 07:40:02"
            },
            {
                "id": 39,
                "name": "Rajhkhsjkd",
                "is_archive": false,
                "created_at": "24-10-2024 17:32:20"
            },
            {
                "id": 43,
                "name": "sad",
                "is_archive": false,
                "created_at": "28-10-2024 11:36:21"
            },
            {
                "id": 44,
                "name": "sad",
                "is_archive": false,
                "created_at": "28-10-2024 11:36:53"
            },
            {
                "id": 45,
                "name": "sad",
                "is_archive": false,
                "created_at": "28-10-2024 11:36:53"
            }
        ],
        "references": [
            {
                "id": 1,
                "name": "IMCS",
                "is_archive": false,
                "created_at": "13-05-2024 11:34:08"
            },
            {
                "id": 2,
                "name": "VHI",
                "is_archive": false,
                "created_at": "08-11-2024 05:10:42"
            },
            {
                "id": 3,
                "name": "LAYA",
                "is_archive": false,
                "created_at": "08-11-2024 05:10:42"
            },
            {
                "id": 4,
                "name": "IRISH",
                "is_archive": false,
                "created_at": "08-11-2024 05:10:42"
            }
        ]
    },
    "message": "Doctor form data"
}