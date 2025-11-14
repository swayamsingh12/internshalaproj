const { Rating, Store } = require('../models');

exports.submitRating = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const storeId = req.params.storeId;
    const { rating } = req.body;

    // Validate rating
    const r = Number(rating);
    if (!Number.isInteger(r) || r < 1 || r > 5) {
      return res.status(400).json({ error: 'Rating must be an integer between 1 and 5' });
    }

    // Check store exists
    const store = await Store.findByPk(storeId);
    if (!store) return res.status(404).json({ error: 'Store not found' });

    
    const existing = await Rating.findOne({ where: { userId, storeId } });
    if (existing) {
      return res.status(409).json({ error: 'You already rated this store — use PUT to update' });
    }

    // Create rating
    const created = await Rating.create({ rating: r, userId, storeId });
    return res.status(201).json(created);
  } catch (err) {
    console.error('rating.submitRating error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
