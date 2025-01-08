import { samplePatients } from '@/types/patient';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  success: boolean;
  data?: {};
  error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'GET') {
    const formData = samplePatients.map((patient: { id: any; full_name: string; email: string }) => ({
      value: patient.id,
      label: patient.full_name,
      patient_id: patient.id,
      display_name: patient.full_name,
      email: patient.email
    }))
    res.status(200).json({ success: true, data: formData });
  } else {
    res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
}
