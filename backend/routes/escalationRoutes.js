const express = require('express');
const router = express.Router();
const {
  getAllEscalations,
  createEscalation,
  updateEscalation,
  deleteEscalation,
} = require('../controllers/escalationController');

router.get('/', getAllEscalations);
router.post('/', createEscalation);
router.put('/:id', updateEscalation);
router.delete('/:id', deleteEscalation);

module.exports = router;
