// const knex = require("knex");
const app = require("../app");
const path = require("path");
const ApiError = require("../app.error");
const DIR = "D:/uploads";

const makeFileService = require("../services/file.service");
const makeUserService = require("../services/user.service");
async function createFile(req, res, next) {
  if (!req.body.title) {
    return next(new ApiError(400, "Title Cannot empty"));
  }
  try {
    const fileService = makeFileService();
    const file = await fileService.createFile(req.body);
    return res.send(file);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Error occur Create file"));
  }
}

async function getFileByFilter(req, res) {
  const fileService = makeFileService();
  const files = await fileService.getFileByFilter(req.query);
  // console.log(files);
  return res.send(files);
}

async function getFileByID(req, res, next) {
  try {
    const fileService = makeFileService();
    const { path } = await fileService.getFileByID(req.params.id);
    console.log(req.params.id);
    if (!path) {
    }
    const option = {
      root: DIR,
    };
    // const fileName = `${DIR}/${path}`;
    const fileName =
      "D:/Development/NodeJS/DocSharing/ct313hm02-project-backend-anhlee66/public/thumbnail.png";
    // const fileName = "D:/pass.txt";
    // console.log(fileName);
    return res.sendFile(fileName);
  } catch (error) {
    console.log(error);
    return next(new ApiError(404, "Resource Not Found"));
  }
}

async function uploadFile(req, res, next) {
  try {
    if (!req.files || Object.keys(req.files).length == 0) {
      return res.status(400).send({ message: "No file were uploaded" });
    }
    const userService = makeUserService();
    const file = req.files.file;
    const { title, description, user, courseID } = req.body;
    const userID = await userService.getUserID(user).then((id) => id[0].userID);

    const data = {
      title: title != "undefined" ? title : path.parse(file.name).name,
      description: description ? description : " No description",
      path: `${path.parse(file.name).name}_${Date.now().toString()}${
        path.parse(file.name).ext
      }`,
      uploadDate: Date(),
      userID,
      courseID,
    };
    // console.log(data);

    const uploadFileName = `${DIR}/${data.path}`;
    // console.log(uploadPath)
    // res.send({ message: "Oke" });
    file.mv(uploadFileName, async (err) => {
      if (err) return res.status(500).send(err);
      console.log(`Save to ${uploadFileName}`);
      const fileService = makeFileService();
      const result = await fileService.saveFile(data);
      if (result)
        return res
          .status(200)
          .send({ message: `Upload file ${file.name} successfully` });
    });
  } catch (error) {
    console.log(error);
  }
}

function downloadFile(req, res, next) {
  const fileName = req.params.name;
  const folderPath = `${DIR}/${fileName}`;
  // console.log(req.params.name);
  console.log(folderPath);
  res.download(folderPath, (err) => {
    if (err) console.log(err);
  });
  return res.send({ message: "Download File" });
}

module.exports = {
  createFile,
  getFileByFilter,
  getFileByID,
  uploadFile,
  downloadFile,
};
