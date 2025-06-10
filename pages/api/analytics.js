// pages/api/analytics.js
import dbConnect from '../../lib/mongodb';
import Analytics from '../../models/Analytics';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { type, page, ctaType, projectId } = req.body;
      
      const analytics = new Analytics({
        type,
        page,
        ctaType,
        projectId,
        userAgent: req.headers['user-agent'],
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
      });

      await analytics.save();
      res.status(200).json({ message: 'Analytics saved' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save analytics' });
    }
  } else if (req.method === 'GET') {
    try {
      const stats = await Analytics.aggregate([
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 }
          }
        }
      ]);

      const pageViews = await Analytics.countDocuments({ type: 'page_view' });
      const ctaClicks = await Analytics.countDocuments({ type: 'cta_click' });
      const projectClicks = await Analytics.countDocuments({ type: 'project_click' });

      res.status(200).json({
        pageViews,
        ctaClicks,
        projectClicks,
        stats
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  }
}