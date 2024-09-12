export interface ProcedureTable {
    s_no: number;
    code: number;
    procedure_name: string;
    rate: number;
}

export const sampleProcedureTable: ProcedureTable[] = [
    { s_no: 1, code: 2778, procedure_name: 'Above knee amputation', rate: 463 },
    { s_no: 2, code: 1234, procedure_name: 'Appendectomy', rate: 950 },
    { s_no: 3, code: 5678, procedure_name: 'Cataract Surgery', rate: 1200 },
    { s_no: 4, code: 9101, procedure_name: 'Coronary Bypass Surgery', rate: 15000 },
    { s_no: 5, code: 1122, procedure_name: 'Hip Replacement', rate: 10000 },
    { s_no: 6, code: 3344, procedure_name: 'Knee Arthroscopy', rate: 3500 },
    { s_no: 7, code: 5566, procedure_name: 'Laparoscopic Cholecystectomy', rate: 5000 },
    { s_no: 8, code: 7788, procedure_name: 'Pacemaker Implantation', rate: 20000 },
    { s_no: 9, code: 9900, procedure_name: 'Spinal Fusion', rate: 18000 },
    { s_no: 10, code: 1111, procedure_name: 'Tonsillectomy', rate: 1200 },
    { s_no: 11, code: 2222, procedure_name: 'Angioplasty', rate: 8000 },
    { s_no: 12, code: 3333, procedure_name: 'Breast Biopsy', rate: 1800 },
    { s_no: 13, code: 4444, procedure_name: 'Carpal Tunnel Release', rate: 2500 },
    { s_no: 14, code: 5555, procedure_name: 'Cystoscopy', rate: 1500 },
    { s_no: 15, code: 6666, procedure_name: 'Gastric Bypass Surgery', rate: 20000 },
    { s_no: 16, code: 7777, procedure_name: 'Hemorrhoidectomy', rate: 3200 },
    { s_no: 17, code: 8888, procedure_name: 'Hernia Repair', rate: 3000 },
    { s_no: 18, code: 9999, procedure_name: 'Kidney Transplant', rate: 30000 },
    { s_no: 19, code: 1212, procedure_name: 'Liver Biopsy', rate: 2800 },
    { s_no: 20, code: 3434, procedure_name: 'Prostatectomy', rate: 14000 }
];
