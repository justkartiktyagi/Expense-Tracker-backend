const express = require("express");
const {
  postExpense,
  getExpense,
  deleteExpense,
} = require("../Controller/store-controller");
const authMiddleware = require("../middleware/authMiddleware");
const storeRouter = express.Router();
storeRouter.post("/", authMiddleware, postExpense);
storeRouter.get("/", authMiddleware, getExpense);
storeRouter.delete("/:id", authMiddleware, deleteExpense);
module.exports = { storeRouter };
