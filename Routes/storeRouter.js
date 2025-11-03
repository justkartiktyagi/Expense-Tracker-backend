const express = require("express");
const {
  postExpense,
  getExpense,
  deleteExpense,
} = require("../Controller/store-controller");
const storeRouter = express.Router();
storeRouter.post("/", postExpense);
storeRouter.get("/", getExpense);
storeRouter.delete("/:id", deleteExpense);
module.exports = { storeRouter };
