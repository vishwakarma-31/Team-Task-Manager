const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    maxLength: 200
  },
  description: {
    type: String,
    trim: true,
    maxLength: 1000
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

projectSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'project'
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;