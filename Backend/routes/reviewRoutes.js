// routes/reviews.js
const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.post('/', reviewController.createReview);
router.get('/', reviewController.getReviews);
router.put('/:id', reviewController.updateReview);
router.delete('/:id/:userId', reviewController.deleteReview);

module.exports = router;