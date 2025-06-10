// pages/api/admin/contacts.js
import dbConnect from '../../../lib/mongodb';
import Contact from '../../../models/Contact';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET);
    await dbConnect();

    if (req.method === 'GET') {
      const contacts = await Contact.find().sort({ createdAt: -1 });
      res.status(200).json(contacts);
    } else if (req.method === 'PUT') {
      const { id, status } = req.body;
      const contact = await Contact.findByIdAndUpdate(id, { status }, { new: true });
      res.status(200).json(contact);
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}
