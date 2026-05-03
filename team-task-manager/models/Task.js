const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: {
  type: String,
  default: ""
},
  projectId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Project",
    required: true
  },

  
  assignedTo: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
}],

  status: {
    type: String,
    enum: ["todo", "in-progress", "done"],
    default: "todo"
  },

  dueDate: {
    type: Date
  }

}, { timestamps: true }); // 🔥 adds createdAt automatically

module.exports = mongoose.model("Task", taskSchema);