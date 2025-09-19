import { NextApiRequest, NextApiResponse } from 'next';
import { initializeSocket, NextApiResponseServerIO } from '@/lib/socket';

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (req.method === 'GET' || req.method === 'POST') {
    initializeSocket(res);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
