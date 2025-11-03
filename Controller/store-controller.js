const Expense = require("../models/Expenses");
exports.postExpense = async (req, res) => {
  const { title, amount, category, date } = req.body;

  try {
    const newExpense = new Expense({ title, amount, category, date });
    const savedExpense = await newExpense.save();
    console.log("Expense recorded successfully");
    res.status(201).json(savedExpense); // ✅ send full saved object to frontend
  } catch (err) {
    res.status(500).json({ error: "Failed to record expense" });
  }
};

exports.getExpense = async (req, res) => {
  Expense.find()
    .then((expenses) => {
      res.json(expenses); // send data to frontend
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
};

exports.deleteExpense = async (req, res) => {
  const expenseId = req.params.id;
  try {
    const deletedExpense = await Expense.findByIdAndDelete(expenseId);
    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.status(200).json({ message: "Expense deleted successfully" }); // ✅ Added response
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
