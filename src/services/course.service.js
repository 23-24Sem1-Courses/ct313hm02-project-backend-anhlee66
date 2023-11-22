const knex = require("../database/knex");
function makeCourseService() {
  async function createCourse(payload) {
    const course = readCourseService(payload);
    const { id } = await knex("courses").insert(course);
    return { id, ...course };
  }

  function readCourseService(payload) {
    const course = {
      courseName: payload.name,
      description: payload.description,
    };
    Object.keys(course).forEach(
      (key) => course[key] === undefined && delete course[key]
    );
    return course;
  }

  async function updateCourse(id, payload) {
    const course = readCourseService(payload);
    return await knex("courses").where("CourseID", id).update(course);
  }

  async function getAllCourse() {
    const course = await knex("courses").select("*");
    return course;
  }
  return {
    createCourse,
    readCourseService,
    updateCourse,
    getAllCourse,
  };
}

module.exports = makeCourseService;
