const express = require('express');
const router = express.Router();
const storeCtrl = require('../controllers/store.controller');

const { Store, Rating, sequelize } = require('../models');
const { Op } = require('sequelize');



// Public: list stores (with optional ?name= & ?address= filters)
router.get('/', storeCtrl.listStores);
router.get("/search",async (req, res) => {
    try {
      const { name, address, page = 1, limit = 20, sort = 'createdAt_DESC' } = req.query;
      const where = {};
  
      if (name) where.name = { [Op.iLike]: `%${name}%` };
      if (address) where.address = { [Op.iLike]: `%${address}%` };
  
      const [sortField, sortDir] = (sort || 'createdAt_DESC').split('_');
      const order = [[sortField, (sortDir && sortDir.toUpperCase()) === 'ASC' ? 'ASC' : 'DESC']];
  
      const offset = (Math.max(Number(page), 1) - 1) * Number(limit);
  
      const stores = await Store.findAll({
        where,
        attributes: {
          include: [
            // average rating (rounded to 2 decimals)
            [sequelize.literal(`(
              SELECT COALESCE(ROUND(AVG("rating")::numeric,2),0)
              FROM "Ratings" AS r
              WHERE r."storeId" = "Store"."id"
            )`), 'avgRating'],
            // rating count
            [sequelize.literal(`(
              SELECT COUNT(1) FROM "Ratings" AS r WHERE r."storeId" = "Store"."id"
            )`), 'ratingsCount']
          ]
        },
        order,
        limit: Number(limit),
        offset: Number(offset)
      });
  
      return res.json({ page: Number(page), limit: Number(limit), results: stores.length, data: stores });
    } catch (err) {
      console.error('store.searchStores error', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
});

// Get single store by ID (must come after /search to avoid route conflicts)
router.get('/:id', storeCtrl.getStoreById);

module.exports = router;

