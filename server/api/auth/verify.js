import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    
  const allowedOrigins = [
  "https://react-restaurant-virid-nine.vercel.app",
  "http://localhost:5173",
];
const origin = req.headers.origin;
if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ verified: true, data: decoded });
  } catch (err) {
    res.status(401).json({ message: "Token not verified", error: err.message });
  }
}