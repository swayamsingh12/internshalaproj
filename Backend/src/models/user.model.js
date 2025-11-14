module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING(400) },
    role: { type: DataTypes.ENUM('admin','normal','store_owner'), defaultValue: 'normal' }
  }, {});
  
  User.associate = models => {
    User.hasMany(models.Store, { foreignKey: 'ownerId', as: 'stores' });
    User.hasMany(models.Rating, { foreignKey: 'userId', as: 'ratings' });
  };
  return User;
};
