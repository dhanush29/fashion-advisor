import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import cookie from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    try{
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
        console.log(user?.credits)
        res.status(200).json({ 
            credits: user?.credits 
        });
    }
    catch (error){
        res.json({ error });
    }
}