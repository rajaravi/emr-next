import { doctorList } from '@/types/doctor';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  success: boolean;
  data?: {};
  error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'GET') {
    res.status(200).json({ success: true, data: doctorList });
  } else {
    res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
}
