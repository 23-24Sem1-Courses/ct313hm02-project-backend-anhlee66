const bcrypt = require("bcrypt");
const ApiError = require("../app.error");
const knex = require("../database/knex");
const { fa } = require("@faker-js/faker");

function makeUserService() {
  function readUserService(payload) {
    const user = {
      email: payload.email,
      fullName: payload.fullName,
      password: payload.password,
      yearOfBirth: payload.yearOfBirth,
      profilePicture: payload.profilePicture,
      organization: payload.organization,
    };
    Object.keys(user).forEach(
      (key) => user[key] == undefined && delete user[key]
    );
    return user;
  }
  async function createUser(payload) {
    const user = readUserService(payload);
    const SaltRound = 10;
    const salt = bcrypt.genSaltSync(SaltRound);
    const hash = bcrypt.hashSync(user.password, salt);
    user.password = hash;
    // console.log(user.password);
    const { id } = await knex("users").insert(user);
    return { id, ...user };
  }

  async function login(req) {
    const users = await getAllUser();
    const loginUser = readUserService(req.body);
    const findUser = users.find((user) => user.email == loginUser.email);
    if (!findUser) {
      return false;
    }
    let comparePass = bcrypt.compareSync(loginUser.password, findUser.password);
    if (comparePass) {
      req.session.user = loginUser;
      console.log(JSON.stringify(loginUser));
      return true;
    }
    return false;
  }
  async function getAllUser() {
    let results = await knex("users").select("email", "password");
    return results;
  }

  async function getUserID(user) {
    return await knex("users").select("userID").where("email", "like", user);
  }
  async function getUserInfo(email) {
    try {
      return await knex("users").select("*").where("email", email);
    } catch (error) {
      console.log(error);
    }
  }

  async function updateUser(id, user) {
    try {
      const userInfo = readUserService(user);
      console.log(id, user);
      return await knex("users").where("userID", id).update(userInfo);
    } catch (error) {
      console.log(error);
    }
  }
  return {
    readUserService,
    createUser,
    getAllUser,
    getUserInfo,
    getUserID,
    login,
    updateUser,
  };
}

module.exports = makeUserService;
