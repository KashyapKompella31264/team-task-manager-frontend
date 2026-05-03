const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Models
const User = require("./models/User");
const Project = require("./models/Project");
const Task = require("./models/Task");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ================= AUTH MIDDLEWARE =================
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ================= AUTH ROUTES =================

// SIGNUP
app.post("/signup", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      role
    });

    await user.save();

    res.json({ message: "User created successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, role: user.role });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= PROJECT ROUTES =================

// Create Project (Admin only)
app.post("/project", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { name, members } = req.body;

    const project = new Project({
  name,
  members: [req.user.id] // auto add creator
});
    await project.save();

    res.json(project);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Projects
app.get("/projects", authMiddleware, async (req, res) => {
  const projects = await Project.find().populate("members");
  res.json(projects);
});

// ================= TASK ROUTES =================

// Create Task
app.post("/task", authMiddleware, async (req, res) => {
  try {
    const { title, description, projectId, dueDate, assignedTo } = req.body;

    const task = new Task({
      title,
      description,
      projectId,
      dueDate,
      assignedTo: assignedTo || [req.user.id]
    });

    await task.save();

    res.json(task);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Get Tasks
app.get("/tasks", authMiddleware, async (req, res) => {
  const tasks = await Task.find()
    .populate("assignedTo","email")
    .populate("projectId");

  res.json(tasks);
});


//getting users
app.get("/users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({ role: "member" }).select("_id email");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Update Task Status
app.put("/task/:id", authMiddleware, async (req, res) => {
  try {
    const { title, description, status, assignedTo, dueDate } = req.body;

    const updateFields = {};

    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (status !== undefined) updateFields.status = status;
    if (assignedTo !== undefined) {
  updateFields.assignedTo = Array.isArray(assignedTo) ? assignedTo : [assignedTo];
}
    if (dueDate !== undefined) updateFields.dueDate = dueDate;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    res.json(task);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= DB CONNECTION =================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});