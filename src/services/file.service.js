const ApiError = require("../app.error");
const knex = require("../database/knex");
const Paginator = require("./paginator");
function makeFileService() {
  function readFileService(payload) {
    const file = {
      title: payload.title,
      description: payload.description,
      path: payload.path,
      uploadDate: Date.now(),
      userID: payload.userID,
      courseID: payload.courseID,
    };
    Object.keys(file).forEach(
      (key) => file[key] === undefined && delete file[key]
    );
    return file;
  }
  async function createFile(payload) {
    const file = readFileService(payload);
    const { id } = await knex("files").insert(file);
    return { id, ...file };
  }

  async function getFileByID(id) {
    return knex("files").where("FileID", id).select("*").first();
  }

  async function getFileByFilter(query) {
    const { title, courseName, page = 1, limit = 5 } = query;
    const paginator = new Paginator(page, limit);
    let results = await knex("files")
      .join("courses", "courses.courseID", "=", "files.courseID")
      .join("users", "users.userID", "=", "files.userID")
      .where((builder) => {
        if (title !== undefined) {
          builder.where("title", "like", `%${title}%`);
        }
        if (courseName !== undefined) {
          builder.where("courseName", "like", `%${courseName}%`);
        }
      })
      .select(
        knex.raw("count(fileID) OVER() as recordCount"),
        "fileID",
        "title",
        "courseName",
        "fullName",
        "email"
      )
      .limit(this.limit)
      .offset(this.offset);
    // console.log(recordCount);
    let totalRecords = 0;
    results = results.map((result) => {
      totalRecords = result.recordCount;
      delete result.recordCount;
      return result;
    });
    return {
      metadata: paginator.getMetaData(totalRecords),
      files: results,
    };
    // return results;
  }

  return {
    readFileService,
    createFile,
    getFileByID,
    getFileByFilter,
  };
}

module.exports = makeFileService;
