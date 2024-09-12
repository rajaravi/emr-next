
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