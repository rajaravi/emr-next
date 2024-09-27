import { samplePatients } from '@/types/patient';
import type { NextApiRequest, NextApiResponse } from 'next';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

type Data = {
  success: boolean;
  data?: {};
  error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'GET') {
    const formData = samplePatients.map((patient: { patient_id: any; display_name: any; }) => ({
        value: patient.patient_id,
        label: patient.display_name
    }))
    res.status(200).json({ success: true, data: formData });
  } else {
    res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
}
