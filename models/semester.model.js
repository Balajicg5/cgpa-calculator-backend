const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  credits: {
    type: Number,
    required: true
  },
  grade: {
    type: Number,
    required: true
  }
});

const SemesterSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  number: {
    type: Number,
    required: true
  },
  courses: [CourseSchema],
  gpa: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate GPA before saving
SemesterSchema.pre('save', function(next) {
  if (this.courses.length === 0) {
    this.gpa = 0;
    return next();
  }

  let totalPoints = 0;
  let totalCredits = 0;
  
  this.courses.forEach(course => {
    totalPoints += course.credits * course.grade;
    totalCredits += course.credits;
  });
  
  this.gpa = (totalPoints / totalCredits).toFixed(2);
  next();
});

module.exports = mongoose.model('Semester', SemesterSchema);
