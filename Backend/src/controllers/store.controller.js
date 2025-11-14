const { Store, Rating, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.listStores = async (req, res) => {
  try {
    const { name, address } = req.query;
    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };

    const stores = await Store.findAll({
      where,
      attributes: {
        include: [
          [sequelize.literal(`(
            SELECT COALESCE(AVG("rating"),0)
            FROM "Ratings" AS r
            WHERE r."storeId" = "Store"."id"
          )`), 'avgRating'],
          [sequelize.literal(`(
            SELECT COUNT(1) FROM "Ratings" AS r WHERE r."storeId" = "Store"."id"
          )`), 'ratingsCount']
        ]
      }
    });

    return res.json(stores);
  } catch (err) {
    console.error('store.controller.listStores error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getStoreById = async (req, res) => {
  try {
    const { id } = req.params;
    const store = await Store.findByPk(id, {
      attributes: {
        include: [
          [sequelize.literal(`(
            SELECT COALESCE(AVG("rating"),0)
            FROM "Ratings" AS r
            WHERE r."storeId" = "Store"."id"
          )`), 'avgRating'],
          [sequelize.literal(`(
            SELECT COUNT(1) FROM "Ratings" AS r WHERE r."storeId" = "Store"."id"
          )`), 'ratingsCount']
        ]
      }
    });

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    return res.json(store);
  } catch (err) {
    console.error('store.controller.getStoreById error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
