const { Store, Rating, User, sequelize } = require('../models');


exports.listMyStores = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const stores = await Store.findAll({
      where: { ownerId },
      attributes: {
        include: [
          // avgRating (rounded to 2 decimals)
          [sequelize.literal(`(
            SELECT COALESCE(ROUND(AVG(r."rating")::numeric,2),0)
            FROM "Ratings" r
            WHERE r."storeId" = "Store"."id"
          )`), 'avgRating'],
          // ratings count
          [sequelize.literal(`(
            SELECT COUNT(1) FROM "Ratings" r WHERE r."storeId" = "Store"."id"
          )`), 'ratingsCount']
        ]
      },
      include: [
        {
          model: Rating,
          as: 'ratings',
          separate: true, // Use separate query to allow limit
          limit: 5, // Get latest 5 ratings
          order: [['createdAt', 'DESC']],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.json(stores);
  } catch (err) {
    console.error('owner.listMyStores error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.listStoreRaters = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { storeId } = req.params;

    // verify the owner actually owns this store
    const store = await Store.findOne({ where: { id: storeId, ownerId } });
    if (!store) return res.status(403).json({ error: 'Forbidden or store not found' });

    // get ratings for the store with user info
    const ratings = await Rating.findAll({
      where: { storeId },
      attributes: ['id', 'rating', 'createdAt', 'updatedAt', 'userId'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'address']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Calculate average rating using aggregate
    const avgRatingData = await Rating.findAll({
      where: { storeId },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'avgRating']
      ],
      raw: true
    });
    const avgRating = avgRatingData[0]?.avgRating ? parseFloat(avgRatingData[0].avgRating) : 0;

    // Format a friendly response
    const out = ratings.map(r => ({
      id: r.id,
      rating: r.rating,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      user: r.user ? { 
        id: r.user.id, 
        name: r.user.name, 
        email: r.user.email, 
        address: r.user.address 
      } : { id: r.userId }
    }));

    return res.json({
      store: {
        id: store.id,
        name: store.name,
        address: store.address,
        email: store.email,
        avgRating: avgRating
      },
      ratings: out
    });
  } catch (err) {
    console.error('owner.listStoreRaters error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.storeAverage = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { storeId } = req.params;

    // verify ownership
    const store = await Store.findOne({ where: { id: storeId, ownerId } });
    if (!store) return res.status(403).json({ error: 'Forbidden or store not found' });

    const result = await Rating.findOne({
      where: { storeId },
      attributes: [[sequelize.literal('COALESCE(ROUND(AVG("rating")::numeric,2),0)'), 'avgRating']],
      raw: true
    });

    return res.json({ storeId, avgRating: result ? Number(result.avgRating) : 0 });
  } catch (err) {
    console.error('owner.storeAverage error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// simple wrapper to the auth logout (optional)
exports.logout = (req, res) => {
  
  return res.json({ ok: true, msg: 'Logged out (client should delete token)' });
};
