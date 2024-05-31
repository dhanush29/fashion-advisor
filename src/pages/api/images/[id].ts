import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const imageId = parseInt(id as string, 10);
      if (isNaN(imageId)) {
        return res.status(400).json({ error: 'Invalid image ID' });
      }

      const image = await prisma.image.findUnique({
        where: { id: imageId },
      });

      if (!image) {
        return res.status(404).json({ error: 'Image not found' });
      }

      res.setHeader('Content-Type', 'image/png');
      res.send(image.blob);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
