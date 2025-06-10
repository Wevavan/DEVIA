// pages/api/admin/login.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  // Simple admin check (en production, utilisez une base de données)
  const adminEmail = 'admin@devweb-ia.fr';
  const adminPassword = 'admin123'; // En production, hachez ce mot de passe

  if (email === adminEmail && password === adminPassword) {
    const token = jwt.sign(
      { email: adminEmail, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
}