const Semester = require('../models/semester.model');

// @desc    Get all semesters for a user
// @route   GET /api/semesters
// @access  Private
exports.getSemesters = async (req, res, next) => {
  try {
    const semesters = await Semester.find({ user: req.user.id });
    
    res.status(200).json({
      success: true,
      count: semesters.length,
      data: semesters
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single semester
// @route   GET /api/semesters/:id
// @access  Private
exports.getSemester = async (req, res, next) => {
  try {
    const semester = await Semester.findById(req.params.id);
    
    if (!semester) {
      return res.status(404).json({
        success: false,
        error: 'Semester not found'
      });
    }
    
    // Make sure user owns the semester
    if (semester.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this semester'
      });
    }
    
    res.status(200).json({
      success: true,
      data: semester
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new semester
// @route   POST /api/semesters
// @access  Private
exports.createSemester = async (req, res, next) => {
  try {
    // Add user to request body
    req.body.user = req.user.id;
    
    const semester = await Semester.create(req.body);
    
    res.status(201).json({
      success: true,
      data: semester
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update semester
// @route   PUT /api/semesters/:id
// @access  Private
exports.updateSemester = async (req, res, next) => {
  try {
    let semester = await Semester.findById(req.params.id);
    
    if (!semester) {
      return res.status(404).json({
        success: false,
        error: 'Semester not found'
      });
    }
    
    // Make sure user owns the semester
    if (semester.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this semester'
      });
    }
    
    semester = await Semester.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: semester
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete semester
// @route   DELETE /api/semesters/:id
// @access  Private
exports.deleteSemester = async (req, res, next) => {
  try {
    const semester = await Semester.findById(req.params.id);
    
    if (!semester) {
      return res.status(404).json({
        success: false,
        error: 'Semester not found'
      });
    }
    
    // Make sure user owns the semester
    if (semester.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this semester'
      });
    }
    
    await semester.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Calculate CGPA
// @route   GET /api/semesters/cgpa
// @access  Private
exports.calculateCGPA = async (req, res, next) => {
  try {
    const semesters = await Semester.find({ user: req.user.id });
    
    if (semesters.length === 0) {
      return res.status(200).json({
        success: true,
        cgpa: 0
      });
    }
    
    let totalPoints = 0;
    let totalCredits = 0;
    
    semesters.forEach(semester => {
      semester.courses.forEach(course => {
        totalPoints += course.credits * course.grade;
        totalCredits += course.credits;
      });
    });
    
    const cgpa = (totalPoints / totalCredits).toFixed(2);
    
    res.status(200).json({
      success: true,
      cgpa,
      totalSemesters: semesters.length
    });
  } catch (error) {
    next(error);
  }
};