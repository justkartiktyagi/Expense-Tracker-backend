const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const { storeRouter } = require("./Routes/storeRouter");
const MONGO_URL =
  "mongodb+srv://expensetracker:expensetracker@cluster0.53qjbx5.mongodb.net/expenses?retryWrites=true&w=majority&appName=Cluster0";
// ✅ This parses JSON bodies (API requests)
app.use(cors()); // ✅ allow all origins
app.use(express.json());

// ✅ This parses HTML <form> submissions
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use("/expense", storeRouter);

const PORT = 3000;
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));
