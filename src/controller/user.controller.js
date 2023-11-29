const { route } = require("../app");
const ApiError = require("../app.error");
const makeUserService = require("../services/user.service");
const DIR = "D:/ct313hm02-project-backend-anhlee66/public/avatar/";
async function register(req, res, next) {
  try {
    const userService = makeUserService();
    const userList = userService.getAllUser();
    if ((await userList).find((userItem) => userItem.email == req.body.email)) {
      console.log("already");
      return res.status(300).send({ message: "already" });
      // return next(new ApiError(400, "Email has been used"));
    }
    const info = {
      email: req.body.email,
      fullName: req.body.name,
      password: req.body.password,
    };
    console.log(info);
    const user = await userService.createUser(info);
    return res.send(user);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "An error occur when create user"));
  }
}

async function login(req, res, next) {
  res.render("login");
  const docService = makeUserService();
  const login = await docService.login(req);

  if (login) {
    req.session.regenerate((error) => {
      if (error) next(error);
      req.session.user = req.body.email;
      req.session.save((error) => {
        if (error) next(error);
        console.log(`Logged in ${req.body.email}`);
        res.status(200).send({ message: "Logged in" });
        // res.redirect("/");
      });
    });
  } else return res.status(301).send({ message: "Cannot Authenticate" });
}

function logout(req, res, next) {
  console.log(isAuthenticated(req));
  if (isAuthenticated(req) == false) {
    return res.send({ message: "Not login" });
  }

  const user = req.session.user;
  req.session.user = null;
  req.session.save((error) => {
    if (error) next(error);
    req.session.regenerate((error) => {
      if (error) next(error);
      console.log("logout");
      res.redirect("/");
    });
  });
}
async function getUserInfo(req, res) {
  const userService = makeUserService();
  const user = await userService.getUserInfo(req.query.email);
  return res.send(user);
}

async function updateUser(req, res) {
  try {
    const userService = makeUserService();
    const { fullName, birthday, organization } = req.body;
    let profilePicture = null;
    if (!req.files) {
      profilePicture = null;
    } else {
      const avatar = req.files.profilePicture;
      // if (avatar) console.log(avatar);
      // else console.log("null");
      profilePicture = avatar.name;
      const path = `${DIR}${avatar.name}`;
      avatar.mv(path, async (err) => {
        if (err) return res.status(500).send(err);
        console.log(`Save to ${path}`);
      });
    }
    // if (!profilePicture) {
    //   userInfo = { fullName, birthday, organization };
    // } else
    const userInfo = { fullName, birthday, profilePicture, organization };
    const user = await userService.updateUser(req.params.id, userInfo);
    if (user) {
      // console.log(`Save to ${profilePicture}`);
      return res
        .status(200)
        .send({ message: `Update user "${fullName}" successfully` });
    }
  } catch (error) {
    console.log(error);
  }
}

function isAuthenticated(req, res, next) {
  console.log(req.session.user);
  if (req.session.user) return true;
  return false;
}
module.exports = {
  register,
  login,
  logout,
  getUserInfo,
  updateUser,
};
