import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import cookie from 'cookie';
import prisma from '../../../lib/prisma';

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

const suggestionslist =[
  "Try experimenting with layering different textures and fabrics to add depth to your outfit. Mixing materials like denim, knitwear, and linen can create interesting visual contrasts.",
  "Consider incorporating statement accessories such as bold jewelry, a standout watch, or an eye-catching hat to elevate a simple ensemble and add a pop of personality.",
  "Experiment with asymmetrical silhouettes or unexpected hemlines to add intrigue to your look. A top with an asymmetric neckline or a tunic with an angled hem can create visual interest.",
  "Play with proportions by pairing oversized pieces with more fitted items. For example, balance out a voluminous sweater with slim-fitting pants or a tailored jacket.",
  "Don't be afraid to mix patterns and prints, but remember to keep the scale and color palette cohesive. Try pairing a striped shirt with checkered pants or incorporating a geometric scarf into a polka-dot ensemble.",
  "Incorporate a touch of metallics into your outfit for a hint of glamour. Whether it's metallic shoes, a shimmering top, or metallic accessories, it can instantly elevate your look.",
  "Experiment with color blocking by pairing contrasting hues together in bold blocks. This can create a striking visual impact and add vibrancy to your outfit.",
  "Invest in versatile pieces that can easily transition from day to night. A classic blazer, versatile jumpsuit, or tailored pants can be dressed up or down with the right accessories.",
  "Play with proportions by experimenting with oversized or cropped silhouettes. Pair oversized pants with a fitted top or a cropped jacket with high-waisted bottoms for a fashion-forward look.",
  "Finally, don't forget the power of confidence! No matter what you're wearing, wearing it with confidence is the key to making any outfit look stylish and chic.",
  "Experiment with monochromatic outfits by wearing different shades of the same color. This can create a sleek, cohesive look.",
  "Try incorporating classic pieces such as a well-fitted white shirt, dark jeans, or a neutral-toned trench coat into your wardrobe. These items are timeless and versatile.",
  "Opt for sustainable fashion by choosing eco-friendly fabrics and ethically made clothing. This not only helps the environment but also supports ethical fashion practices.",
  "Add a touch of vintage to your wardrobe by incorporating second-hand or retro pieces. Vintage clothing can add unique character and style to your look.",
  "Play with different lengths by combining long coats or cardigans with shorter tops or pants. This layering technique can add dimension to your outfit.",
  "Use belts to cinch in loose garments or to add a stylish detail to your look. A belt can transform an oversized shirt or dress into a more structured ensemble.",
  "Incorporate athletic wear into your everyday outfits for a sporty and comfortable style. Items like track pants, hoodies, and sneakers can be both fashionable and functional.",
  "Experiment with gender-fluid fashion brands that offer unisex clothing lines. These brands design pieces that can be worn by anyone, regardless of gender.",
  "Add pops of color to a neutral outfit with bright accessories like scarves, hats, or shoes. This can liven up a simple look and draw attention to key details.",
  "Play with unconventional materials like faux leather, mesh, or neoprene to add an edgy, modern twist to your wardrobe."
];

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
  
    // Parse cookies
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
        // Select a random suggestion
        const randomIndex = Math.floor(Math.random() * suggestionslist.length);
        const selectedSuggestion = suggestionslist[randomIndex];

        // Save the image and the suggestion to the database
        const image = await prisma.image.create({
            data: {
              blob: fileBuffer,
              userId: parseInt(userId),
              suggestion: {
                create: {
                  text: selectedSuggestion,
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

        setTimeout(() => {
            res.status(200).json({ 
              message: 'Image uploaded successfully', 
              imageId: image.id, 
              suggestion: image.suggestion
            });
          }, 5000); 
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
