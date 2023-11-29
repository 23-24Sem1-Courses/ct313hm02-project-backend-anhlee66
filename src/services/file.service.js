const { da } = require("@faker-js/faker");
const ApiError = require("../app.error");
const knex = require("../database/knex");
const Paginator = require("./paginator");
function makeFileService() {
  function readFileService(payload) {
    const file = {
      title: payload.title,
      description: payload.description,
      path: payload.path,
      thumbnail: payload.thumbnail,
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
    return await knex("files").where("fileID", id).select("*").first();
  }

  async function getFileByFilter(query) {
    const { title, courseName, email, page = 1, limit = 5, search } = query;
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
        if (email !== undefined) {
          builder.where("email", "like", email);
        }
        if (search !== undefined) {
          const words = search.trim().split(" ");
          let key = "";
          words.forEach((word, index) => {
            key =
              key +
              `(title LIKE '%${word}%' OR fullName LIKE '%${word}%' OR courseName LIKE '%${word}%') AND `;
          });
          key = key.substring(0, key.length - 5);
          // console.log(key);
          builder.whereRaw(key);
        }
      })
      .select(
        knex.raw("count(fileID) OVER() as recordsCount"),
        "fileID",
        "title",
        "courseName",
        "fullName",
        "path",
        "uploadDate",
        "email",
        "thumbnail"
      )
      .limit(paginator.limit)
      .offset(paginator.offset);
    // console.log(recordCount);
    let totalRecords = 0;
    results = results.map((result) => {
      totalRecords = result.recordsCount;
      delete result.recordsCount;
      return result;
    });
    return {
      metadata: paginator.getMetaData(totalRecords),
      files: results,
    };
    // return results;
  }
  async function saveFile(file) {
    try {
      return await knex("files").insert(file);
    } catch (error) {
      console.log(error);
    }
  }
  async function deleteFile(id) {
    try {
      const status = await knex("files").where("fileID", id).del();
      return status;
    } catch (error) {
      console.log(error);
    }
  }
  async function getLike(fileID) {
    try {
      return await knex("favourite")
        .count("fileID as like")
        .whereRaw(`fileID=${fileID} AND status='true'`)
        .first();
    } catch (error) {
      console.log(error);
    }
  }
  async function checkLike(fileID, userID) {
    try {
      const status = await knex("favourite")
        .select("status")
        .whereRaw(`fileID=${fileID} AND userID=${userID}`)
        .first();
      return status;
    } catch (error) {
      console.log(error);
    }
  }
  async function hasLike(fileID, userID) {
    return await knex("favourite")
      .select("fileID", "userID")
      .whereRaw(`fileID=${fileID} AND userID=${userID}`)
      .distinct();
  }
  async function updateLike(fileID, userID, value) {
    try {
      const data = await hasLike(fileID, userID);
      if (data.length > 0) {
        console.log(data);
        return await knex("favourite")
          .update("status", value)
          .whereRaw(`fileID=${fileID} AND userID=${userID}`);
      } else {
        console.log("create");
        return await knex("favourite").insert({
          fileID,
          userID,
          status: value,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  // async
  return {
    readFileService,
    createFile,
    getFileByID,
    getFileByFilter,
    saveFile,
    deleteFile,
    getLike,
    checkLike,
    updateLike,
    hasLike,
  };
}

module.exports = makeFileService;
