const express = require('express');
const {
  getSemesters,
  getSemester,
  createSemester,
  updateSemester,
  deleteSemester,
  calculateCGPA
} = require('../controllers/semester.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Protect all routes
router.use(authMiddleware);

router.route('/')
  .get(getSemesters)
  .post(createSemester);

router.route('/cgpa')
  .get(calculateCGPA);

router.route('/:id')
  .get(getSemester)
  .put(updateSemester)
  .delete(deleteSemester);

module.exports = router;
