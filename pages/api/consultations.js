// pages/api/consultations.js
import dbConnect from '../../lib/mongodb';
import Consultation from '../../models/Consultation';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      // Créer la consultation
      const consultation = new Consultation(req.body);
      await consultation.save();

      // Configurer Nodemailer
      const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: process.env.NODEMAILER_EMAIL,
          pass: process.env.NODEMAILER_PASSWORD,
        },
      });

      // Préparer les données pour les emails
      const consultationDate = new Date(consultation.consultationDate);
      const formatDate = (date) => {
        return date.toLocaleDateString('fr-FR', { 
          weekday: 'long', 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        });
      };

      const getProjectTypeLabel = (type) => {
        const types = {
          'site-web-vitrine': 'Site Web Vitrine',
          'site-web-ecommerce': 'Site E-commerce',
          'application-web': 'Application Web',
          'integration-ia': 'Intégration IA',
          'chatbot-ia': 'Chatbot IA',
          'automatisation': 'Automatisation',
          'optimisation-seo': 'Optimisation SEO',
          'refonte-site': 'Refonte de Site',
          'maintenance': 'Maintenance',
          'autre': 'Autre Projet'
        };
        return types[type] || type;
      };

      const getBudgetLabel = (budget) => {
        const budgets = {
          'moins-2k': 'Moins de 2 000€',
          '2k-5k': '2 000€ - 5 000€',
          '5k-10k': '5 000€ - 10 000€',
          '10k-20k': '10 000€ - 20 000€',
          '20k-50k': '20 000€ - 50 000€',
          'plus-50k': 'Plus de 50 000€',
          'a-discuter': 'À discuter'
        };
        return budgets[budget] || budget;
      };

      const getConsultationTypeLabel = (type) => {
        const types = {
          'telephone': 'Appel Téléphonique',
          'visio-zoom': 'Visioconférence Zoom',
          'entretien-physique': 'Rendez-vous Physique'
        };
        return types[type] || type;
      };

      // Email de confirmation pour le client
      const clientEmailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirmation de votre consultation</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4); padding: 40px 30px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 28px; font-weight: bold; }
            .header p { color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px; }
            .content { padding: 40px 30px; }
            .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin: 20px 0; }
            .card h3 { margin: 0 0 16px 0; color: #1e293b; font-size: 18px; }
            .detail-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
            .detail-row:last-child { border-bottom: none; }
            .detail-label { font-weight: 600; color: #64748b; }
            .detail-value { color: #1e293b; font-weight: 500; }
            .highlight { background: linear-gradient(135deg, #dbeafe, #ede9fe); border: 1px solid #a5b4fc; border-radius: 8px; padding: 16px; margin: 20px 0; text-align: center; }
            .highlight strong { color: #3730a3; font-size: 18px; }
            .button { display: inline-block; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; margin: 20px 0; }
            .footer { background: #f1f5f9; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Consultation Confirmée !</h1>
              <p>Votre demande a été reçue avec succès</p>
            </div>
            
            <div class="content">
              <h2>Bonjour ${consultation.firstName} !</h2>
              <p>Merci pour votre confiance ! Votre demande de consultation gratuite a été enregistrée et je vous contacterai très prochainement pour confirmer les détails.</p>
              
              <div class="highlight">
                <strong>📅 Rendez-vous prévu le ${formatDate(consultationDate)} à ${consultation.consultationTime}</strong>
              </div>
              
              <div class="card">
                <h3>📋 Récapitulatif de votre demande</h3>
                <div class="detail-row">
                  <span class="detail-label">Contact :</span>
                  <span class="detail-value">${consultation.firstName} ${consultation.lastName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Email :</span>
                  <span class="detail-value">${consultation.email}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Téléphone :</span>
                  <span class="detail-value">${consultation.phone}</span>
                </div>
                ${consultation.company ? `
                <div class="detail-row">
                  <span class="detail-label">Entreprise :</span>
                  <span class="detail-value">${consultation.company}</span>
                </div>
                ` : ''}
              </div>
              
              <div class="card">
                <h3>🚀 Détails du projet</h3>
                <div class="detail-row">
                  <span class="detail-label">Type de projet :</span>
                  <span class="detail-value">${getProjectTypeLabel(consultation.projectType)}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Budget :</span>
                  <span class="detail-value">${getBudgetLabel(consultation.budget)}</span>
                </div>
                ${consultation.projectName ? `
                <div class="detail-row">
                  <span class="detail-label">Nom du projet :</span>
                  <span class="detail-value">${consultation.projectName}</span>
                </div>
                ` : ''}
              </div>
              
              <div class="card">
                <h3>📞 Modalités de consultation</h3>
                <div class="detail-row">
                  <span class="detail-label">Type :</span>
                  <span class="detail-value">${getConsultationTypeLabel(consultation.consultationType)}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Date :</span>
                  <span class="detail-value">${formatDate(consultationDate)}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Heure :</span>
                  <span class="detail-value">${consultation.consultationTime}</span>
                </div>
              </div>
              
              <h3>🔄 Prochaines étapes</h3>
              <p><strong>1.</strong> Je vais analyser votre demande dans les prochaines heures</p>
              <p><strong>2.</strong> Vous recevrez un appel ou email de ma part sous 24h maximum</p>
              <p><strong>3.</strong> Nous confirmerons ensemble les détails de notre rendez-vous</p>
              
              <p style="margin-top: 30px;">
                Si vous avez des questions ou souhaitez modifier votre demande, n'hésitez pas à me contacter directement.
              </p>
            </div>
            
            <div class="footer">
              <p><strong>DevIA Pro</strong> - Expert en Développement Web & Intelligence Artificielle</p>
              <p>📧 contact@devia-pro.fr | 📞 +33 6 62 70 45 80</p>
              <p>Vous recevez cet email car vous avez demandé une consultation sur notre site web.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Email pour l'admin
      const adminEmailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Nouvelle demande de consultation</title>
          <style>
            body { font-family: system-ui, sans-serif; margin: 0; padding: 20px; background: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #dc2626, #ea580c); color: white; padding: 20px; }
            .content { padding: 20px; }
            .priority { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
            .priority-high { background: #fee2e2; color: #dc2626; }
            .priority-medium { background: #fef3c7; color: #d97706; }
            .priority-low { background: #dcfce7; color: #16a34a; }
            .score { font-size: 24px; font-weight: bold; color: #059669; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th, td { text-align: left; padding: 8px; border-bottom: 1px solid #e5e7eb; }
            th { background: #f9fafb; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚨 Nouvelle Consultation</h1>
              <p>Score de qualification : <span class="score">${consultation.qualificationScore}%</span></p>
            </div>
            
            <div class="content">
              <div style="margin-bottom: 20px;">
                <span class="priority priority-${consultation.priority}">Priorité ${consultation.priority}</span>
              </div>
              
              <table>
                <tr><th>Contact</th><td><strong>${consultation.firstName} ${consultation.lastName}</strong></td></tr>
                <tr><th>Email</th><td>${consultation.email}</td></tr>
                <tr><th>Téléphone</th><td>${consultation.phone}</td></tr>
                ${consultation.company ? `<tr><th>Entreprise</th><td>${consultation.company}</td></tr>` : ''}
                <tr><th>Projet</th><td>${getProjectTypeLabel(consultation.projectType)}</td></tr>
                <tr><th>Budget</th><td>${getBudgetLabel(consultation.budget)}</td></tr>
                <tr><th>Consultation</th><td>${getConsultationTypeLabel(consultation.consultationType)}</td></tr>
                <tr><th>Date souhaitée</th><td>${formatDate(consultationDate)} à ${consultation.consultationTime}</td></tr>
                <tr><th>Source</th><td>${consultation.source} → ${consultation.sourceSection}</td></tr>
              </table>
              
              ${consultation.projectDescription ? `
                <h3>Description du projet :</h3>
                <p style="background: #f9fafb; padding: 15px; border-radius: 6px; border-left: 4px solid #3b82f6;">${consultation.projectDescription}</p>
              ` : ''}
              
              <div style="margin-top: 20px; padding: 15px; background: #fef3c7; border-radius: 6px;">
                <p><strong>⏰ Action requise :</strong> Contacter le prospect sous 24h</p>
                <p><strong>🎯 Probabilité de conversion :</strong> ${consultation.conversionProbability}%</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      // Envoyer les emails
      const emailPromises = [
        // Email de confirmation pour le client
        transporter.sendMail({
          from: `"DevIA Pro" <${process.env.NODEMAILER_EMAIL}>`,
          to: consultation.email,
          subject: `✅ Consultation confirmée pour le ${formatDate(consultationDate)}`,
          html: clientEmailHtml,
          text: `Bonjour ${consultation.firstName},\n\nVotre consultation gratuite a été confirmée pour le ${formatDate(consultationDate)} à ${consultation.consultationTime}.\n\nJe vous contacterai sous 24h pour finaliser les détails.\n\nÀ bientôt !\nDevIA Pro`
        }),

        // Email de notification pour l'admin
        transporter.sendMail({
          from: `"Site Web DevIA" <${process.env.NODEMAILER_EMAIL}>`,
          to: process.env.NODEMAILER_EMAIL,
          subject: `🔥 Nouvelle consultation - ${consultation.firstName} ${consultation.lastName} (Score: ${consultation.qualificationScore}%)`,
          html: adminEmailHtml,
          text: `Nouvelle demande de consultation:\n\nContact: ${consultation.firstName} ${consultation.lastName}\nEmail: ${consultation.email}\nTéléphone: ${consultation.phone}\nProjet: ${getProjectTypeLabel(consultation.projectType)}\nBudget: ${getBudgetLabel(consultation.budget)}\nDate: ${formatDate(consultationDate)} à ${consultation.consultationTime}\nScore: ${consultation.qualificationScore}%`
        })
      ];

      await Promise.all(emailPromises);

      res.status(200).json({ 
        success: true, 
        message: 'Consultation créée et emails envoyés',
        consultationId: consultation._id
      });

    } catch (error) {
      console.error('Erreur création consultation:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur lors de la création de la consultation',
        error: error.message 
      });
    }

  } else if (req.method === 'GET') {
    try {
      // Récupérer les consultations avec pagination et filtres
      const { 
        page = 1, 
        limit = 10, 
        status, 
        priority, 
        search 
      } = req.query;

      const query = {};
      
      // Filtres
      if (status && status !== 'all') query.status = status;
      if (priority && priority !== 'all') query.priority = priority;
      
      // Recherche
      if (search) {
        query.$or = [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { company: { $regex: search, $options: 'i' } },
          { projectName: { $regex: search, $options: 'i' } }
        ];
      }

      const consultations = await Consultation.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      const total = await Consultation.countDocuments(query);
      const stats = await Consultation.getStats();

      res.status(200).json({
        success: true,
        data: {
          consultations,
          stats,
          pagination: {
            current: page,
            pages: Math.ceil(total / limit),
            total
          }
        }
      });

    } catch (error) {
      console.error('Erreur récupération consultations:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur lors de la récupération des consultations' 
      });
    }

  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).json({ message: 'Méthode non autorisée' });
  }
}