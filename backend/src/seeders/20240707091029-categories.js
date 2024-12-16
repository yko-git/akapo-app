"use strict";

const data = [
  {
    key: "illust",
    name: "イラスト・絵画",
  },
  {
    key: "crafts",
    name: "工作",
  },
  {
    key: "other",
    name: "その他",
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("categories", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("categories", null, {});
  },
};
