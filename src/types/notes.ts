export interface NotesTable {
    notes_id: string;
    date: Date;
    notes: string;
    status?: string;
}

export interface NotesModel {
    date: Date;
    notes: string;
    status?: string;
  }

export const sampleNotesRecords: NotesTable[] = [
    {
        notes_id: 'INV001',
        date: new Date('2024-08-01'),
        notes: 'Sample patient notes for the initial consultation.',
        status: 'open',
    },
    {
        notes_id: 'INV002',
        date: new Date('2024-08-05'),
        notes: 'Follow-up visit notes. Patient reports improvement.',
        status: 'closed',
    },
    {
        notes_id: 'INV003',
        date: new Date('2024-08-10'),
        notes: 'Diagnostic test results discussed with the patient.',
        status: 'open',
    },
    {
        notes_id: 'INV004',
        date: new Date('2024-08-15'),
        notes: 'Scheduled for further examination based on recent symptoms.',
        status: 'in progress',
    },
    {
        notes_id: 'INV005',
        date: new Date('2024-08-20'),
        notes: 'Treatment plan updated with additional medications.',
        status: 'closed',
    }
];
