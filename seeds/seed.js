const { faker } = require("@faker-js/faker");

function createFile() {
  return {
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    path: faker.word.adjective(),
    uploadDate: faker.date.past(),
    userID: 2,
    courseID: 2,
  };
}
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
// console.log(createFile());
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  // await knex('').del()
  await knex("files").insert(Array(20).fill().map(createFile));
};
