// pages/api/consultations.js
import dbConnect from '../../lib/mongodb';
import Consultation from '../../models/Consultation';
import TimeSlot from '../../models/TimeSlot';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const {
        firstName,
        lastName,
        email,
        phone,
        company,
        projectType,
        projectName,
        projectDescription,
        budget,
        timeline,
        consultationDate,
        consultationTime,
        consultationType,
        source,
        sourceSection
      } = req.body;

      // Validation des champs requis
      const requiredFields = {
        firstName,
        lastName,
        email,
        phone,
        projectType,
        budget,
        timeline,
        consultationDate,
        consultationTime,
        consultationType
      };

      for (const [field, value] of Object.entries(requiredFields)) {
        if (!value) {
          return res.status(400).json({ 
            success: false,
            message: `Le champ ${field} est requis`,
            field 
          });
        }
      }

      // Vérifier que le créneau est disponible
      const timeSlot = await TimeSlot.findOne({
        date: new Date(consultationDate),
        time: consultationTime,
        isAvailable: true,
        isBooked: false
      });

      if (!timeSlot) {
        return res.status(400).json({ 
          success: false,
          message: 'Ce créneau n\'est plus disponible. Veuillez choisir un autre créneau.',
          code: 'SLOT_NOT_AVAILABLE'
        });
      }

      // Vérifier les doublons (même email pour la même date/heure)
      const existingConsultation = await Consultation.findOne({
        email,
        consultationDate: new Date(consultationDate),
        consultationTime,
        status: { $nin: ['cancelled'] }
      });

      if (existingConsultation) {
        return res.status(400).json({ 
          success: false,
          message: 'Vous avez déjà une consultation prévue à cette date et heure.',
          code: 'DUPLICATE_BOOKING'
        });
      }

      // Créer la consultation
      const consultation = new Consultation({
        firstName,
        lastName,
        email,
        phone,
        company,
        projectType,
        projectName,
        projectDescription,
        budget,
        timeline,
        consultationDate: new Date(consultationDate),
        consultationTime,
        consultationType,
        source: source || 'website',
        sourceSection: sourceSection || 'general',
        status: 'pending',
        priority: 'medium'
      });

      // Sauvegarder la consultation
      await consultation.save();

      // Réserver le créneau
      await timeSlot.book(consultation._id);

      console.log('📋 Nouvelle consultation créée:', {
        id: consultation._id,
        nom: `${consultation.firstName} ${consultation.lastName}`,
        email: consultation.email,
        projet: consultation.projectType,
        score: consultation.qualificationScore,
        créneau: `${consultationDate} ${consultationTime}`
      });

      // Envoyer les emails si la configuration est présente
      if (process.env.NODEMAILER_EMAIL && process.env.NODEMAILER_PASSWORD) {
        try {
          await sendEmails(consultation);
          console.log('✅ Emails envoyés avec succès');
        } catch (emailError) {
          console.error('⚠️ Erreur envoi email:', emailError.message);
          // Ne pas faire échouer la requête si l'email échoue
        }
      } else {
        console.log('⚠️ Configuration email manquante - emails non envoyés');
      }

      // Envoyer la réponse de succès
      res.status(201).json({
        success: true,
        message: 'Consultation créée avec succès',
        consultation: {
          id: consultation._id,
          firstName: consultation.firstName,
          lastName: consultation.lastName,
          email: consultation.email,
          consultationDate: consultation.consultationDate,
          consultationTime: consultation.consultationTime,
          consultationType: consultation.consultationType,
          projectType: consultation.projectType,
          status: consultation.status,
          qualificationScore: consultation.qualificationScore,
          conversionProbability: consultation.conversionProbability
        }
      });

    } catch (error) {
      console.error('❌ Erreur création consultation:', error);

      // Si c'est une erreur de validation Mongoose
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          success: false,
          message: 'Erreur de validation',
          errors: validationErrors
        });
      }

      // Si c'est une erreur de duplication
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'Cette consultation existe déjà',
          code: 'DUPLICATE_ENTRY'
        });
      }

      // Erreur générale
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Une erreur est survenue'
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

// Fonction pour envoyer les emails (inchangée de votre version)
async function sendEmails(consultation) {
  // CORRECTION : utiliser createTransport (pas createTransporter)
  const transporter = nodemailer.createTransport({
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
        .steps { background: #ecfdf5; border: 1px solid #10b981; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .steps h3 { margin: 0 0 15px 0; color: #065f46; }
        .steps ol { margin: 0; padding-left: 20px; }
        .steps li { margin-bottom: 8px; color: #047857; }
        .footer { background: #f1f5f9; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
        .footer p { margin: 5px 0; }
        .contact-info { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0; }
        .contact-info h3 { margin: 0 0 10px 0; color: #92400e; }
        .contact-info p { margin: 0; color: #b45309; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Consultation Confirmée !</h1>
          <p>Votre demande a été reçue avec succès</p>
        </div>
        
        <div class="content">
          <h2>Bonjour ${consultation.firstName} ! 👋</h2>
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
              <span class="detail-label">Budget envisagé :</span>
              <span class="detail-value">${getBudgetLabel(consultation.budget)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Timeline :</span>
              <span class="detail-value">${consultation.timeline}</span>
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
          
          <div class="steps">
            <h3>🔄 Prochaines étapes</h3>
            <ol>
              <li><strong>Analyse de votre demande</strong> - Dans les prochaines heures</li>
              <li><strong>Contact personnel</strong> - Sous 24h maximum</li>
              <li><strong>Confirmation du rendez-vous</strong> - Ensemble nous finaliserons les détails</li>
              <li><strong>Préparation personnalisée</strong> - Audit préliminaire de vos besoins</li>
            </ol>
          </div>

          ${consultation.projectDescription ? `
          <div class="card">
            <h3>📝 Votre description</h3>
            <p style="margin: 0; font-style: italic; color: #475569;">"${consultation.projectDescription}"</p>
          </div>
          ` : ''}
          
          <div class="contact-info">
            <h3>📞 Besoin de modifier votre rendez-vous ?</h3>
            <p>Contactez-moi directement par email ou téléphone. Je serai ravi de m'adapter à vos contraintes.</p>
          </div>
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

  // Email pour l'admin avec design moderne
  const adminEmailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Nouvelle demande de consultation</title>
      <style>
        body { font-family: system-ui, sans-serif; margin: 0; padding: 20px; background: #f8fafc; }
        .container { max-width: 700px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #dc2626, #ea580c); color: white; padding: 30px; }
        .header h1 { margin: 0 0 10px 0; font-size: 26px; }
        .score-badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: bold; }
        .content { padding: 30px; }
        .priority { display: inline-block; padding: 6px 15px; border-radius: 25px; font-size: 11px; font-weight: bold; text-transform: uppercase; margin-bottom: 20px; }
        .priority-urgent { background: #fee2e2; color: #dc2626; border: 2px solid #fca5a5; }
        .priority-high { background: #fed7aa; color: #ea580c; border: 2px solid #fdba74; }
        .priority-medium { background: #fef3c7; color: #d97706; border: 2px solid #fcd34d; }
        .priority-low { background: #dcfce7; color: #16a34a; border: 2px solid #86efac; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 25px 0; }
        .info-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; }
        .info-card h3 { margin: 0 0 15px 0; color: #1e293b; font-size: 16px; }
        .info-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .info-label { font-weight: 600; color: #64748b; }
        .info-value { color: #1e293b; font-weight: 500; }
        .description { background: #f0f9ff; border: 1px solid #0ea5e9; border-left: 4px solid #0ea5e9; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .description h3 { margin: 0 0 10px 0; color: #0c4a6e; }
        .description p { margin: 0; color: #075985; font-style: italic; line-height: 1.6; }
        .action-required { background: #fffbeb; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 25px 0; }
        .action-required h3 { margin: 0 0 10px 0; color: #92400e; }
        .action-required p { margin: 5px 0; color: #b45309; }
        .quick-actions { display: flex; gap: 10px; margin-top: 20px; }
        .action-btn { display: inline-block; background: #3b82f6; color: white; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; font-size: 14px; }
        .action-btn:hover { background: #2563eb; }
        .action-btn.email { background: #059669; }
        .action-btn.phone { background: #dc2626; }
        .analytics { background: #f3f4f6; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .analytics h3 { margin: 0 0 15px 0; color: #374151; }
        .score-bar { background: #e5e7eb; height: 8px; border-radius: 4px; overflow: hidden; margin: 10px 0; }
        .score-fill { height: 100%; transition: width 0.3s ease; }
        .score-excellent { background: #059669; }
        .score-good { background: #0891b2; }
        .score-medium { background: #d97706; }
        .score-low { background: #dc2626; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚨 Nouvelle Demande de Consultation</h1>
          <div class="score-badge">Score de qualification : ${consultation.qualificationScore}%</div>
        </div>
        
        <div class="content">
          <div class="priority priority-${consultation.priority}">
            ${consultation.priority === 'urgent' ? '🔥' : consultation.priority === 'high' ? '⚡' : consultation.priority === 'medium' ? '📋' : '📝'} 
            Priorité ${consultation.priority.toUpperCase()}
          </div>
          
          <div class="info-grid">
            <div class="info-card">
              <h3>👤 Contact Client</h3>
              <div class="info-row">
                <span class="info-label">Nom :</span>
                <span class="info-value"><strong>${consultation.firstName} ${consultation.lastName}</strong></span>
              </div>
              <div class="info-row">
                <span class="info-label">Email :</span>
                <span class="info-value">${consultation.email}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Téléphone :</span>
                <span class="info-value">${consultation.phone}</span>
              </div>
              ${consultation.company ? `
              <div class="info-row">
                <span class="info-label">Entreprise :</span>
                <span class="info-value">${consultation.company}</span>
              </div>
              ` : ''}
            </div>
            
            <div class="info-card">
              <h3>🚀 Projet</h3>
              <div class="info-row">
                <span class="info-label">Type :</span>
                <span class="info-value">${getProjectTypeLabel(consultation.projectType)}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Budget :</span>
                <span class="info-value">${getBudgetLabel(consultation.budget)}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Timeline :</span>
                <span class="info-value">${consultation.timeline}</span>
              </div>
              ${consultation.projectName ? `
              <div class="info-row">
                <span class="info-label">Nom :</span>
                <span class="info-value">${consultation.projectName}</span>
              </div>
              ` : ''}
            </div>
          </div>
          
          <div class="info-grid">
            <div class="info-card">
              <h3>📅 Consultation Souhaitée</h3>
              <div class="info-row">
                <span class="info-label">Type :</span>
                <span class="info-value">${getConsultationTypeLabel(consultation.consultationType)}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Date :</span>
                <span class="info-value">${formatDate(consultationDate)}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Heure :</span>
                <span class="info-value">${consultation.consultationTime}</span>
              </div>
            </div>
            
            <div class="info-card">
              <h3>📊 Tracking</h3>
              <div class="info-row">
                <span class="info-label">Source :</span>
                <span class="info-value">${consultation.source}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Section :</span>
                <span class="info-value">${consultation.sourceSection}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Statut :</span>
                <span class="info-value">${consultation.status}</span>
              </div>
            </div>
          </div>
          
          ${consultation.projectDescription ? `
          <div class="description">
            <h3>📝 Description du projet</h3>
            <p>"${consultation.projectDescription}"</p>
          </div>
          ` : ''}
          
          <div class="analytics">
            <h3>📈 Analytics & Scoring</h3>
            <div class="info-row">
              <span class="info-label">Score de Qualification :</span>
              <span class="info-value"><strong>${consultation.qualificationScore}%</strong></span>
            </div>
            <div class="score-bar">
              <div class="score-fill ${
                consultation.qualificationScore >= 80 ? 'score-excellent' :
                consultation.qualificationScore >= 60 ? 'score-good' :
                consultation.qualificationScore >= 40 ? 'score-medium' : 'score-low'
              }" style="width: ${consultation.qualificationScore}%"></div>
            </div>
            
            <div class="info-row">
              <span class="info-label">Probabilité de Conversion :</span>
              <span class="info-value"><strong>${consultation.conversionProbability}%</strong></span>
            </div>
            <div class="score-bar">
              <div class="score-fill score-good" style="width: ${consultation.conversionProbability}%"></div>
            </div>
          </div>
          
          <div class="action-required">
            <h3>⏰ Action Requise</h3>
            <p><strong>Contacter le prospect sous 24h maximum</strong></p>
            <p>Priorité ${consultation.priority} - Réponse attendue rapidement</p>
            <p>Probabilité de conversion : <strong>${consultation.conversionProbability}%</strong></p>
            
            <div class="quick-actions">
              <a href="mailto:${consultation.email}" class="action-btn email">📧 Répondre par Email</a>
              <a href="tel:${consultation.phone}" class="action-btn phone">📞 Appeler</a>
              <a href="http://localhost:3000/admin/dashboard" class="action-btn">🔗 Dashboard</a>
            </div>
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
      from: `"DevIA Pro - Consultation Gratuite" <${process.env.NODEMAILER_EMAIL}>`,
      to: consultation.email,
      subject: `✅ Consultation confirmée pour le ${formatDate(consultationDate)} à ${consultation.consultationTime}`,
      html: clientEmailHtml,
      text: `Bonjour ${consultation.firstName},\n\nVotre consultation gratuite a été confirmée pour le ${formatDate(consultationDate)} à ${consultation.consultationTime}.\n\nJe vous contacterai sous 24h pour finaliser les détails.\n\nÀ bientôt !\nDevIA Pro`
    }),

    // Email de notification pour l'admin
    transporter.sendMail({
      from: `"Site DevIA Pro" <${process.env.NODEMAILER_EMAIL}>`,
      to: process.env.NODEMAILER_EMAIL,
      subject: `🔥 CONSULTATION ${consultation.priority.toUpperCase()} - ${consultation.firstName} ${consultation.lastName} (${consultation.qualificationScore}%)`,
      html: adminEmailHtml,
      text: `NOUVELLE CONSULTATION - Score: ${consultation.qualificationScore}%\n\nContact: ${consultation.firstName} ${consultation.lastName}\nEmail: ${consultation.email}\nTéléphone: ${consultation.phone}\nProjet: ${getProjectTypeLabel(consultation.projectType)}\nBudget: ${getBudgetLabel(consultation.budget)}\nDate: ${formatDate(consultationDate)} à ${consultation.consultationTime}\nPriorité: ${consultation.priority.toUpperCase()}`
    })
  ];

  await Promise.all(emailPromises);
}