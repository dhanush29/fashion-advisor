import { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const cookies = cookie.parse(req.headers.cookie || '');
      const userId = parseInt(cookies.user || '', 10);

      if (isNaN(userId)) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const images = await prisma.image.findMany({
        where: { userId: userId },
        select: { id: true, blob: true, suggestion: true },
      });

      const imagesWithBase64 = images.map((image : any)  => ({
        id: image.id,
        blob: image.blob.toString('base64'),
        suggestion: image.suggestion
      }));

      res.status(200).json(imagesWithBase64);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}