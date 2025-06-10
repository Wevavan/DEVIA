// pages/api/admin/consultations.js
import dbConnect from '../../../lib/mongodb';
import Consultation from '../../../models/Consultation';

export default async function handler(req, res) {
  // Vérification de l'authentification admin
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ 
      success: false, 
      message: 'Accès non autorisé' 
    });
  }

  await dbConnect();

  switch (req.method) {
    case 'GET':
      return getConsultations(req, res);
    case 'PUT':
      return updateConsultation(req, res);
    case 'DELETE':
      return deleteConsultation(req, res);
    default:
      return res.status(405).json({ 
        success: false, 
        message: 'Méthode non autorisée' 
      });
  }
}

// GET - Récupérer les consultations avec filtres
async function getConsultations(req, res) {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      projectType,
      budget,
      source,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      dateFrom,
      dateTo
    } = req.query;

    // Construction des filtres
    const filters = {};
    
    if (status && status !== 'all') filters.status = status;
    if (priority && priority !== 'all') filters.priority = priority;
    if (projectType && projectType !== 'all') filters.projectType = projectType;
    if (budget && budget !== 'all') filters.budget = budget;
    if (source && source !== 'all') filters.source = source;
    
    // Filtre de recherche
    if (search) {
      filters.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { projectName: { $regex: search, $options: 'i' } },
        { projectDescription: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filtre de dates
    if (dateFrom || dateTo) {
      filters.createdAt = {};
      if (dateFrom) filters.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filters.createdAt.$lte = new Date(dateTo + 'T23:59:59.999Z');
    }

    // Options de pagination et tri
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Requête avec populate et projection
    const consultations = await Consultation
      .find(filters)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean(); // Pour de meilleures performances

    // Compter le total
    const total = await Consultation.countDocuments(filters);

    // Statistiques rapides
    const stats = await Consultation.aggregate([
      { $match: filters },
      {
        $group: {
          _id: null,
          totalConsultations: { $sum: 1 },
          avgQualificationScore: { $avg: '$qualificationScore' },
          avgConversionProbability: { $avg: '$conversionProbability' },
          statusCounts: {
            $push: '$status'
          },
          priorityCounts: {
            $push: '$priority'
          },
          totalEstimatedValue: { $sum: '$estimatedValue' }
        }
      },
      {
        $project: {
          totalConsultations: 1,
          avgQualificationScore: { $round: ['$avgQualificationScore', 1] },
          avgConversionProbability: { $round: ['$avgConversionProbability', 1] },
          totalEstimatedValue: 1,
          statusBreakdown: {
            pending: {
              $size: {
                $filter: {
                  input: '$statusCounts',
                  cond: { $eq: ['$$this', 'pending'] }
                }
              }
            },
            reviewed: {
              $size: {
                $filter: {
                  input: '$statusCounts',
                  cond: { $eq: ['$$this', 'reviewed'] }
                }
              }
            },
            contacted: {
              $size: {
                $filter: {
                  input: '$statusCounts',
                  cond: { $eq: ['$$this', 'contacted'] }
                }
              }
            },
            scheduled: {
              $size: {
                $filter: {
                  input: '$statusCounts',
                  cond: { $eq: ['$$this', 'scheduled'] }
                }
              }
            },
            completed: {
              $size: {
                $filter: {
                  input: '$statusCounts',
                  cond: { $eq: ['$$this', 'completed'] }
                }
              }
            },
            cancelled: {
              $size: {
                $filter: {
                  input: '$statusCounts',
                  cond: { $eq: ['$$this', 'cancelled'] }
                }
              }
            }
          },
          priorityBreakdown: {
            low: {
              $size: {
                $filter: {
                  input: '$priorityCounts',
                  cond: { $eq: ['$$this', 'low'] }
                }
              }
            },
            medium: {
              $size: {
                $filter: {
                  input: '$priorityCounts',
                  cond: { $eq: ['$$this', 'medium'] }
                }
              }
            },
            high: {
              $size: {
                $filter: {
                  input: '$priorityCounts',
                  cond: { $eq: ['$$this', 'high'] }
                }
              }
            },
            urgent: {
              $size: {
                $filter: {
                  input: '$priorityCounts',
                  cond: { $eq: ['$$this', 'urgent'] }
                }
              }
            }
          }
        }
      }
    ]);

    // Réponse avec métadonnées
    res.status(200).json({
      success: true,
      data: {
        consultations,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit),
          hasNextPage: skip + parseInt(limit) < total,
          hasPrevPage: parseInt(page) > 1
        },
        stats: stats[0] || {
          totalConsultations: 0,
          avgQualificationScore: 0,
          avgConversionProbability: 0,
          totalEstimatedValue: 0,
          statusBreakdown: {},
          priorityBreakdown: {}
        },
        filters: {
          applied: filters,
          available: {
            statuses: ['pending', 'reviewed', 'contacted', 'scheduled', 'completed', 'cancelled'],
            priorities: ['low', 'medium', 'high', 'urgent'],
            projectTypes: [
              'Site Web E-commerce',
              'Application Web',
              'Application Mobile',
              'Dashboard Analytics',
              'Intelligence Artificielle',
              'API & Backend',
              'Consultation SEO',
              'Maintenance & Support',
              'Autre'
            ],
            budgets: [
              'Moins de 5k€',
              '5k€ - 15k€',
              '15k€ - 30k€',
              '30k€ - 50k€',
              '50k€ - 100k€',
              'Plus de 100k€',
              'À discuter'
            ],
            sources: ['Google', 'Facebook', 'LinkedIn', 'Instagram', 'TikTok', 'Référencement', 'Direct', 'Autre']
          }
        }
      }
    });

  } catch (error) {
    console.error('Erreur récupération consultations:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des consultations'
    });
  }
}

// PUT - Mettre à jour une consultation
async function updateConsultation(req, res) {
  try {
    const { id } = req.query;
    const updates = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID de consultation requis'
      });
    }

    // Champs autorisés à la modification
    const allowedUpdates = [
      'status',
      'priority',
      'assignedTo',
      'scheduledDate',
      'consultationNotes',
      'followUpDate',
      'estimatedValue',
      'conversionProbability'
    ];

    const updateData = {};
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key) && updates[key] !== undefined) {
        updateData[key] = updates[key];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucune donnée valide à mettre à jour'
      });
    }

    // Mise à jour avec validation
    const consultation = await Consultation.findByIdAndUpdate(
      id,
      { 
        ...updateData,
        updatedAt: new Date(),
        ...(updateData.status === 'contacted' && { lastContactedAt: new Date() })
      },
      { 
        new: true, 
        runValidators: true 
      }
    );

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Consultation mise à jour avec succès',
      data: consultation
    });

  } catch (error) {
    console.error('Erreur mise à jour consultation:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour'
    });
  }
}

// DELETE - Supprimer une consultation
async function deleteConsultation(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID de consultation requis'
      });
    }

    const consultation = await Consultation.findByIdAndDelete(id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Consultation supprimée avec succès',
      data: { deletedId: id }
    });

  } catch (error) {
    console.error('Erreur suppression consultation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression'
    });
  }
}