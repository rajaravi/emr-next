
export interface Patient {
    doctor: string;
    patient_id: number;
    display_name: string;
    dob: Date;
    address_1: string;
    home_phone: string;
    mobile: string;
};

export const samplePatients: Patient[] = [
    {
        doctor: 'Dr. Johnson',
        patient_id: 3,
        display_name: 'Alice Smith',
        dob: new Date('1978-08-10'),
        address_1: '789 Oak St',
        home_phone: '555-6789',
        mobile: '555-8765'
    },
    {
        doctor: 'Dr. Johnson',
        patient_id: 4,
        display_name: 'Bob Johnson',
        dob: new Date('1985-05-22'),
        address_1: '123 Maple Ave',
        home_phone: '555-1234',
        mobile: '555-4321'
    },
    {
        doctor: 'Dr. Johnson',
        patient_id: 5,
        display_name: 'Cathy Lee',
        dob: new Date('1990-11-14'),
        address_1: '456 Pine Rd',
        home_phone: '555-5678',
        mobile: '555-8765'
    },
    {
        doctor: 'Dr. Smith',
        patient_id: 6,
        display_name: 'David Brown',
        dob: new Date('1975-02-28'),
        address_1: '321 Birch Blvd',
        home_phone: '555-7890',
        mobile: '555-0987'
    },
    {
        doctor: 'Dr. Smith',
        patient_id: 7,
        display_name: 'Emily Davis',
        dob: new Date('1988-09-30'),
        address_1: '654 Cedar Ln',
        home_phone: '555-2345',
        mobile: '555-5432'
    },
    {
        doctor: 'Dr. Smith',
        patient_id: 8,
        display_name: 'Franklin White',
        dob: new Date('1993-07-19'),
        address_1: '987 Elm St',
        home_phone: '555-3456',
        mobile: '555-6543'
    },
    {
        doctor: 'Dr. Lee',
        patient_id: 9,
        display_name: 'Grace Green',
        dob: new Date('1982-12-05'),
        address_1: '321 Maple St',
        home_phone: '555-4567',
        mobile: '555-7654'
    },
    {
        doctor: 'Dr. Lee',
        patient_id: 10,
        display_name: 'Hank Miller',
        dob: new Date('1979-03-18'),
        address_1: '654 Oak Rd',
        home_phone: '555-5678',
        mobile: '555-8765'
    },
    {
        doctor: 'Dr. Lee',
        patient_id: 11,
        display_name: 'Irene Black',
        dob: new Date('1991-06-23'),
        address_1: '789 Birch Ave',
        home_phone: '555-6789',
        mobile: '555-9876'
    },
    {
        doctor: 'Dr. Lee',
        patient_id: 12,
        display_name: 'Irene Black1',
        dob: new Date('1991-06-23'),
        address_1: '789 Birch Ave',
        home_phone: '555-6789',
        mobile: '555-9876'
    },
    {
        doctor: 'Dr. Lee',
        patient_id: 13,
        display_name: 'Irene Black12',
        dob: new Date('1991-06-23'),
        address_1: '789 Birch Ave',
        home_phone: '555-6789',
        mobile: '555-9876'
    },
];