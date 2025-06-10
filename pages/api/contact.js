// pages/api/contact.js
import dbConnect from '../../lib/mongodb';
import Contact from '../../models/Contact';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const contact = new Contact(req.body);
    await contact.save();

    // Send email notification
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: process.env.NODEMAILER_EMAIL,
      subject: `Nouvelle demande de contact - ${contact.name}`,
      html: `
        <h2>Nouvelle demande de contact</h2>
        <p><strong>Nom:</strong> ${contact.name}</p>
        <p><strong>Email:</strong> ${contact.email}</p>
        <p><strong>Téléphone:</strong> ${contact.phone}</p>
        <p><strong>Société:</strong> ${contact.company || 'Non spécifiée'}</p>
        <p><strong>Type de projet:</strong> ${contact.projectType}</p>
        <p><strong>Budget:</strong> ${contact.budget || 'Non spécifié'}</p>
        <p><strong>Date souhaitée:</strong> ${contact.preferredDate}</p>
        <p><strong>Heure souhaitée:</strong> ${contact.preferredCallTime}</p>
        <p><strong>Message:</strong> ${contact.message || 'Aucun message'}</p>
      `,
    });

    res.status(200).json({ message: 'Contact saved successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
