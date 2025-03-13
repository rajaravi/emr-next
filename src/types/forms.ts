export interface FormsTable {
    id: string;
    date: string;
    form_type: string;
    name: string;
    status?: string;
}

export interface FormsModel {
    date: Date;
    form: string;
  }

export const sampleFormRecords: FormsTable[] = [
    {
        id: '1',
        date: '2025-03-11',
        form_type: 'Admission Form',
        name: 'Pre-Admission Form'
    },
    {
        id: '2',
        date: '2025-03-11',
        form_type: 'Insurance Form',
        name: 'VHI Claim'
    }
];
