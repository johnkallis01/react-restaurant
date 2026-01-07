import jwt from 'jsonwebtoken';

export default async function handler(req,res) {
    res.setHeader("Access-Control-Allow-Origin", "https://react-restaurant-virid-nine.vercel.app");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });
    const token = authHeader.split(' ')[1];
    // eslint-disable-next-line no-undef
    const SECRET_KEY=process.env.JWT_SECRET;
    try{
            const decoded = jwt.verify(token,SECRET_KEY);
            // console.log('decoded', decoded)
            res.status(200).json({
                verified: true,
                data: decoded
            });
        }catch(err){
            res.status(401).json({message: 'error token not verfied',error: err.message})
        }
}