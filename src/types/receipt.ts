interface ReceiptDetails {
    invoice_id: number;
    balance: string;
    tax_rate: string;
    waived_rate: string;
    net_total: string;
    paid: string;
}

export interface ReceiptModel {
    id?: number | null;
    patient_id: number;
    patients: [{value: number, label: string}];
    date: string;
    doctor_id: number;
    tags: string;
    payee_id: number;
    tax_id: number;
    purchaser_id: number;
    purchaser_plan_id: number;
    discount: string;
    tax_percentage: string;
    tax_rate: string;
    waived_rate: string;
    grand_total: string;
    net_total: string;
    balance: string;
    notes: string;
    receipt_details: ReceiptDetails[]
}