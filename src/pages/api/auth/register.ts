import { NextApiRequest, NextApiResponse } from 'next';
import { registerUser } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, email, password } = req.body;
    try {
      const user = await registerUser(username, email, password);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: 'User registration failed' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
