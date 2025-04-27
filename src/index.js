const express = require("express");
const { sequelize, User } = require("./models");
require("dotenv").config();

const app = express();
app.use(express.json());

// Tạo router cho các routes
const userRouter = express.Router();

// Định nghĩa tất cả các route liên quan đến user
userRouter.post("/users", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

userRouter.get("/users", async (req, res) => {
  const users = await User.findAll({
    order: [["createdAt", "ASC"]],
  });
  res.json(users);
});

userRouter.get("/users/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) res.json(user);
  else res.status(404).json({ error: "User not found" });
});

userRouter.put("/users/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    await user.update(req.body);
    res.json(user);
  } else res.status(404).json({ error: "User not found" });
});

userRouter.delete("/users/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    await user.destroy();
    res.json({ message: "User deleted" });
  } else res.status(404).json({ error: "User not found" });
});

// Sử dụng tiền tố 'api/' cho tất cả các route trong router này
app.use("/api", userRouter);

// Start server
const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // Sync DB
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.error("Unable to connect to database:", err);
  }
};

start();
