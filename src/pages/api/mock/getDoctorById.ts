import { doctorById } from '@/types/doctor';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  success: boolean;
  data?: {};
  error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
    res.status(200).json({ success: true, data: doctorById });
  } else {
    res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
}
