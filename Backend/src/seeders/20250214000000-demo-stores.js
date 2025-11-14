"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      "Stores",
      [
        {
          id: Sequelize.literal("uuid_generate_v4()"),
          name: "FreshMart Supermarket",
          email: "freshmart@example.com",
          address: "Main Street 101, New Delhi",
          ownerId: null,   // Set valid user UUID later if needed
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: Sequelize.literal("uuid_generate_v4()"),
          name: "TechZone Electronics",
          email: "techzone@example.com",
          address: "Sector 22, Gurgaon",
          ownerId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: Sequelize.literal("uuid_generate_v4()"),
          name: "GreenLeaf Organic Store",
          email: "greenleaf@example.com",
          address: "MG Road, Bangalore",
          ownerId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: Sequelize.literal("uuid_generate_v4()"),
          name: "UrbanStyle Fashion",
          email: "urbanstyle@example.com",
          address: "Park Street 12, Kolkata",
          ownerId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Stores", null, {});
  },
};
