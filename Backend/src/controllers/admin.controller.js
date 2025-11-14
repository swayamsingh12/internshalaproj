const { User, Store, Rating, sequelize } = require("../models");
const { Op } = require("sequelize");
const authService = require("../services/auth.service");

exports.stats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();

    return res.json({
      totalUsers,
      totalStores,
      totalRatings
    });
  } catch (err) {
    console.error("admin.controller.stats error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "Missing required fields" });

    // Hash password before storing
    const hashedPassword = await authService.hash(password);
    const user = await User.create({ 
      name, 
      email, 
      address, 
      password: hashedPassword, 
      role: role || "normal" 
    });
    return res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    console.error("admin.controller.createUser error", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;
    if (!name) return res.status(400).json({ error: "Missing store name" });

    const store = await Store.create({ name, email, address, ownerId: ownerId || null });
    return res.status(201).json(store);
  } catch (err) {
    console.error("admin.controller.createStore error", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const { q } = req.query; 
    const where = {};
    
    
    if (q) {
      where.email = { [Op.iLike]: `%${q}%` };
    }

    const users = await User.findAll({
      where,
      attributes: ['id','name','email','address','role']
    });
    return res.json(users);
  } catch (err) {
    console.error("admin.controller.listUsers error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    console.log(req.user);
    const userEmail = req.user.email; 
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword)
      return res.status(400).json({ error: "Missing passwords" });

    const user = await User.findOne({ where: { email: userEmail } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const ok = await authService.compare(currentPassword, user.password);
    if (!ok)
      return res.status(401).json({ error: "Current password incorrect" });

    const hashed = await authService.hash(newPassword);
    user.password = hashed;
    await user.save();

    return res.json({ ok: true, msg: "Password updated" });
  } catch (err) {
    console.error("auth.updatePassword error", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.getAllStores = async (req, res) => {
  try {
    const stores = await Store.findAll({
      attributes: {
        include: [
          [sequelize.literal(`(
            SELECT COALESCE(ROUND(AVG("rating")::numeric,2),0)
            FROM "Ratings" AS r
            WHERE r."storeId" = "Store"."id"
          )`), 'avgRating'],
          [sequelize.literal(`(
            SELECT COUNT(1) FROM "Ratings" AS r WHERE r."storeId" = "Store"."id"
          )`), 'ratingsCount']
        ]
      },
      order: [['createdAt', 'DESC']]
    });
    return res.json(stores);
  } catch (err) {
    console.error("admin.controller.getAllStores error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateStore = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, address, ownerId } = req.body;

    const store = await Store.findByPk(id);
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    // Update fields if provided
    if (name !== undefined) store.name = name;
    if (email !== undefined) store.email = email;
    if (address !== undefined) store.address = address;
    if (ownerId !== undefined) store.ownerId = ownerId || null;

    await store.save();

    return res.json(store);
  } catch (err) {
    console.error("admin.controller.updateStore error", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.deleteStore = async (req, res) => {
  try {
    const { id } = req.params;

    const store = await Store.findByPk(id);
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    
    await Rating.destroy({ where: { storeId: id } });

    
    await store.destroy();

    return res.json({ ok: true, msg: "Store deleted successfully" });
  } catch (err) {
    console.error("admin.controller.deleteStore error", err);
    return res.status(500).json({ error: err.message });
  }
};
