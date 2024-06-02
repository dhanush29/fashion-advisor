import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import cookie from 'cookie';
import prisma from '../../../lib/prisma';
import { getRawTextFromImage } from '../../../lib/model'; 

const storage = multer.memoryStorage();
const upload = multer({ storage });

const runMiddleware = (req: NextApiRequest, res: NextApiResponse, fn: Function) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, since we're using multer
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    // Run multer middleware to handle the file upload
    await runMiddleware(req, res, upload.single('image'));

    const fileBuffer = (req as any).file.buffer;
  
    const cookies = cookie.parse(req.headers.cookie || '');
    const userId = cookies.user;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(userId),
      },
      select: {
        credits: true,
      },
    });
    
    if(user?.credits) {
        const suggestionText = await getRawTextFromImage(fileBuffer);

        const image = await prisma.image.create({
            data: {
              blob: fileBuffer,
              userId: parseInt(userId),
              suggestion: {
                create: {
                  text: suggestionText,
                }
              }
            },
            include: {
              suggestion: true,
            },
        });

        const updatedUser = await prisma.user.update({
          where: {
            id: parseInt(userId),
          },
          data: {
            credits: {
              decrement: 1,
            },
          },
        });

        res.status(200).json({ 
          message: 'Image uploaded successfully', 
          imageId: image.id, 
          suggestion: image.suggestion,
          credits: updatedUser.credits  
        }); 
    }
    else {
      res.status(400).json({ message: 'You are out of Credits' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
};

export default handler;
