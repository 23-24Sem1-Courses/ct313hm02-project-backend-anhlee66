const express = require("express");
const userController = require("../controller/user.controller");
const fileController = require("../controller/file.controller");
const courseController = require("../controller/course.controller");
const { methodNotAllowed } = require("../controller/error.controller");
const router = express.Router();

router.route("/signup").post(userController.register).all(methodNotAllowed);

router.route("/login").post(userController.login).all(methodNotAllowed);
router.route("/logout").get(userController.logout);

router.route("/user").get(userController.getUserInfo);
router.route("/user/:id").post(userController.updateUser);

router.route("/file/upload").post(fileController.uploadFile);
router.route("/file/download/:id").get(fileController.downloadFile);
router
  .route("/file")
  .post(fileController.createFile)
  .get(fileController.getFileByFilter);

router
  .route("/file/:id")
  .get(fileController.getFileByID)
  .delete(fileController.deleteFile);
router.route("/file/:id/like").get(fileController.getLike);
router
  .route("/like")
  .get(fileController.checkLike)
  .post(fileController.updateLike);

router
  .route("/course")
  .post(courseController.createCourse)
  .get(courseController.getAllCourse);

router.route("/course/:id").post(courseController.updateCourse);
// .get(courseController.)

// router.route("/image/:image").get(fileController.getImage);

module.exports = router;
