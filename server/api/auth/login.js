import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../models/User.model.js';

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

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "login not found" });

    const isFound = await bcrypt.compare(password, user.password);
    if (!isFound) return res.status(401).json({ message: "invalid passwords" });

    const token = jwt.sign(
      {
        _id: user._id,
        name: `${user.lastName},${user.firstName}`,
        email: user.email,
        phone: user.phone,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, user });
  } catch (err) {
    console.error("login error", err);
    res.status(500).json({ message: "server error", error: err.message });
  }
}
