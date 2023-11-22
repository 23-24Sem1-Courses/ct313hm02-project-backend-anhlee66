const knex = require("knex");
const app = require("../app");
const ApiError = require("../app.error");
const DIR = "D:/Development/NodeJS/DocSharing/Server";

const makeFileService = require("../services/file.service");
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
  console.log(files);
  return res.send(files);
}

async function getFileByID(req, res, next) {
  try {
    const fileService = makeFileService();
    const file = await fileService.getFileByID(req.params.id);
    console.log(req.params.id);
    if (!file) {
      return next(new ApiError(404, "Resource Not Found"));
    }
    return res.send(file);
  } catch (error) {
    console.log(error);
    return next(new ApiError(400, "Error occur getting file"));
  }
}

function uploadFile(req, res, next) {
  try {
    // console.log("body", req.files.file);
    // console.log(req.files.file);

    if (!req.files || Object.keys(req.files).length == 0) {
      return res.status(400).send({ message: "No file were uploaded" });
    }
    const file = req.files.file;
    console.log(file);
    // if (!file.title) file.title = file.
    // console.log(file);
    const uploadFileName = `${DIR}/upload/${file.name}`;
    // console.log(uploadPath)
    // res.send({ message: "Oke" });
    file.mv(uploadFileName, (err) => {
      if (err) return res.status(500).send(err);
      console.log(`Save to ${uploadFileName}`);
      return res.status(200).send({ message: `${file.name}` });
    });
  } catch (error) {
    // console.log(error);
  }
}
function downloadFile(req, res, next) {
  const fileName = req.params.name;
  const folderPath = `${DIR}/upload/${fileName}`;
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
