import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  success: boolean;
  data?: {};
  error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'GET') {
    const formData = {
      title: ["mr"],
      firstName: 'John raja',
      surName: 'Doe',
      gender: ["male"],
      dob: '1989-11-19',
      address1: 'Dublin, Ireland',
      sendEmail: '0'
    };
    
    res.status(200).json({ success: true, data: formData });
  } else {
    res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
}
