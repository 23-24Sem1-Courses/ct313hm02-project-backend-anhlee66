const express = require("express");
const app = require("./src/app");

require("dotenv").config();
const PORT = process.env.PORT;
const HOST = process.env.HOST;
app.listen(PORT, () => console.log(`Running the server on ${HOST}:${PORT}`));
