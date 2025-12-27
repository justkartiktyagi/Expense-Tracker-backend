const Expense = require("../models/Expenses");
exports.postExpense = async (req, res) => {
  const { title, amount, category, date } = req.body;

  try {
    const newExpense = await Expense.create({
      title,
      amount,
      category,
      date,
      user: req.user.id,
    });
    console.log("Expense recorded successfully");
    res.status(201).json(newExpense); // ✅ send full saved object to frontend
  } catch (err) {
    res.status(500).json({ error: "Failed to record expense" });
  }
};

exports.getExpense = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expenseId = req.params.id;

    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    if (expense.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    await Expense.findByIdAndDelete(expenseId);

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete expense" });
  }
};
