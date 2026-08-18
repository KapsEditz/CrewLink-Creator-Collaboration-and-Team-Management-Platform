const mongoose = require('mongoose');

// We create a sub-schema for individual tasks
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  // Which freelancer is supposed to do this specific task?
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } 
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  crew: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Keep as User or Freelancer depending on your setup
  
  // NEW MARKETPLACE FIELDS:
  isPublic: { type: Boolean, default: false },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  tasks: [taskSchema],
  status: { type: String, default: 'neutral' }
}, { timestamps: true });

// MAGIC TRICK: A virtual field that calculates progress dynamically!
// It looks at how many tasks are true, divides by total tasks, and gives you a %
projectSchema.virtual('progress').get(function() {
  if (!this.tasks || this.tasks.length === 0) return 0;
  
  const completedTasks = this.tasks.filter(task => task.isCompleted).length;
  return Math.round((completedTasks / this.tasks.length) * 100);
});


// Ensure virtuals are included when we send JSON to React
projectSchema.set('toJSON', { virtuals: true });
projectSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Project', projectSchema);