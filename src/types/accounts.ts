export interface AccountTable {
    inv_no: string;
    inv_date: Date;
    doctor_name: string;
    patient_name: string;
    bill_to: string;
    amount: string;
    balance: string;
}

export interface TableRow {
    date: string;
    code: string;
    procedure: string;
    quantity: number;
    cost: number;
    total: number;
}

interface Procedure {
  date: string;
  code: number;
  procedure: string;
  quantity: number;
  cost: number;
  total: number;
}

export interface InvoiceModel {
  invDate: string;
  doctor: string;
  incomeCategory: string;
  billTo: string;
  patientName: string;
  tax: string;
  procedures: Procedure[];
  subTotal: number;
  discount: number;
  taxAmount: number;
  netTotal: number;
}

export const sampleAccountRecords: AccountTable[] = [
    {
        inv_no: 'INV001',
        inv_date: new Date('2024-08-01'),
        doctor_name: 'Dr. John Smith',
        patient_name: 'Jane Doe',
        bill_to: 'Insurance Company A',
        amount: '$150.00',
        balance: '$50.00'
    },
    {
        inv_no: 'INV002',
        inv_date: new Date('2024-08-03'),
        doctor_name: 'Dr. Emily Davis',
        patient_name: 'Robert Brown',
        bill_to: 'Self-Pay',
        amount: '$200.00',
        balance: '$0.00'
    },
    {
        inv_no: 'INV003',
        inv_date: new Date('2024-08-05'),
        doctor_name: 'Dr. Alice Johnson',
        patient_name: 'Michael White',
        bill_to: 'Insurance Company B',
        amount: '$300.00',
        balance: '$100.00'
    },
    {
        inv_no: 'INV004',
        inv_date: new Date('2024-08-07'),
        doctor_name: 'Dr. Richard Lee',
        patient_name: 'Anna Black',
        bill_to: 'Medicare',
        amount: '$250.00',
        balance: '$75.00'
    },
    {
        inv_no: 'INV005',
        inv_date: new Date('2024-08-09'),
        doctor_name: 'Dr. Laura Wilson',
        patient_name: 'James Green',
        bill_to: 'Insurance Company C',
        amount: '$400.00',
        balance: '$200.00'
    }
];
