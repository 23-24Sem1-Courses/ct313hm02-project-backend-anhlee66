// const knex = require("knex");
const app = require("../app");
const path = require("path");
const ApiError = require("../app.error");
const DIR = `${__dirname}/../../public/files`;

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
    const id = req.params.id;
    const file = await fileService.getFileByID(id);
    return res.send(file);
  } catch (error) {
    console.log(error);
  }
}

async function fileView(req, res) {
  try {
    const path = req.params.path;
  } catch (error) {
    console.log(error);
  }
}
// async function getFileByID(req, res, next) {
//   try {
//     const fileService = makeFileService();
//     const { path } = await fileService.getFileByID(req.params.id);
//     console.log(req.params.id);
//     if (!path) {
//     }
//     const option = {
//       root: DIR,
//     };
//     // const fileName = `${DIR}/${path}`;
//     // const fileName =
//     // "D:/Development/NodeJS/DocSharing/ct313hm02-project-backend-anhlee66/public/thumbnail.png";
//     const fileName = "D:/pass.txt";
//     // console.log(fileName);
//     return res.sendFile(fileName);
//   } catch (error) {
//     console.log(error);
//     return next(new ApiError(404, "Resource Not Found"));
//   }
// }

async function uploadFile(req, res, next) {
  try {
    if (!req.files || Object.keys(req.files).length == 0) {
      return res.status(400).send({ message: "No file were uploaded" });
    }
    const userService = makeUserService();
    const file = req.files.file;
    const { title, description, user, courseID } = req.body;
    const userID = await userService.getUserID(user).then((id) => id[0].userID);
    const d = new Date();
    const data = {
      title: title != "undefined" ? title : path.parse(file.name).name,
      description: description ? description : " No description",
      path: `/files/${path.parse(file.name).name}_${Date.now().toString()}${
        path.parse(file.name).ext
      }`,
      uploadDate: `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`,
      userID,
      courseID,
    };
    // console.log(data);

    const uploadFileName = `${__dirname}/../../public${data.path}`;
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

async function downloadFile(req, res, next) {
  try {
    const fileService = makeFileService();
    const id = req.params.id;
    const file = await fileService.getFileByID(id);
    console.log(file);

    const fileName = `${DIR}/${file.path}`;
    console.log(fileName);
    // const folderPath = `${DIR}/${fileName}`;
    // console.log(req.params.name);
    // console.log(folderPath);
    // res.set("Content-Disposition", "image/png");
    return res.download(fileName);
  } catch (error) {
    console.log(error);
  }
}

async function deleteFile(req, res) {
  const fileService = makeFileService();
  const id = req.params.id;
  const { title } = await fileService.getFileByID(id);
  console.log(title);
  const status = await fileService.deleteFile(id);
  // const status = 1;
  console.log("status", status, id);
  if (status) {
    return res.send({ message: `Delete file "${title}" successfully` });
  }
}
async function getImage(req, res) {
  const image = req.params.image;
  if (image) {
    res.set("Content-Type", "image/png");
    const imageName = `${DIR}/${image}`;
    console.log("goi qua image", imageName);

    return res.send(imageName);
  }
}

async function getLike(req, res) {
  const fileID = req.params.id;
  const fileService = makeFileService();
  console.log(fileID);
  const like = await fileService.getLike(fileID);
  return res.send(like);
}
async function checkLike(req, res) {
  const fileService = makeFileService();
  const fileID = req.query.fileID;
  const userID = req.query.userID;
  console.log("-", userID, fileID);
  const status = await fileService.checkLike(fileID, userID);
  return res.send(status);
}
async function updateLike(req, res) {
  const fileService = makeFileService();
  const fileID = req.body.fileID;
  const userID = req.body.userID;
  const value = req.body.value;
  // console.log(fileID, userID, value);
  const result = await fileService.updateLike(fileID, userID, value);
  console.log(result);
  if (result) {
    return res.send({ message: "oke" });
  }
}

module.exports = {
  createFile,
  getFileByFilter,
  getFileByID,
  uploadFile,
  downloadFile,
  deleteFile,
  getImage,
  fileView,
  getLike,
  checkLike,
  updateLike,
};
