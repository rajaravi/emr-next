import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  success: boolean;
  token?: string;
  error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    console.log("🚀 ~ handler ~ email, password:", email, password)

    // Dummy authentication logic for demonstration
    if (email === 'test@example.com' && password === 'admin') {
      // Simulate successful login
      res.status(200).json({ success: true, token: 'dummy-token' });
    } else {
      // Simulate failed login
      res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
}
