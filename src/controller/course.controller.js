const makeCourseService = require("../services/course.service");
const courseService = require("../services/course.service");

async function createCourse(req, res, next) {
  const courseService = makeCourseService();
  const course = await courseService.createCourse(req.body);
  return res.send(course);
}

async function getAllCourse(req, res, next) {
  const courseService = makeCourseService();
  const courseList = await courseService.getAllCourse();
  return res.send(courseList);
}

async function updateCourse(req, res, next) {
  const courseService = makeCourseService();
  const course = await courseService.updateCourse(req.params.id, req.body);
  console.log(req.params.id);
  return res.send({ message: "Update course" });
}
module.exports = {
  createCourse,
  getAllCourse,
  updateCourse,
};
