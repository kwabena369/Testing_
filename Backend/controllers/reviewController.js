const Review = require('../models/review');

exports.createReview = async (req, res) => {
  try {
    // console.log("@@@@",req.body,"@@@@")
let content = req.body
    const review = await Review.create(
      {
  reviewText : content.reviewText,
  organizationId:content.organizationId,
  rating :content.rating,
  userId : content.userId  
      }
    );
    console.log("@@@@",review,"@@@@")
    res.status(201).json(review);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error creating review' });
  }
};

// controllers/reviewController.js
exports.getReviews = async (req, res) => {
  try {
    console.log("someone is here",req.query.organizationId)

    const where = {};
    if (req.query.organizationId) {
      where.organizationId = req.query.organizationId;
    }
    
    const reviews = await Review.findAll({
      where,
     organizationId : req.query.organizationId
    });
    
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reviews' });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, reviewText } = req.body;
    
    const review = await Review.findByPk(id);
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Check if the user owns this review
    if (review.userId !== req.body.userId) {
      return res.status(403).json({ error: 'Unauthorized to edit this review' });
    }

    await review.update({ rating, reviewText });
    
    res.status(200).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating review' });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { id,userId } = req.params;
    const review = await Review.findByPk(id);
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Check if the user owns this review
    console.log(review.userId,userId)
    
    if (review.userId !== parseInt(userId)) {
      return res.status(403).json({ error: 'Unauthorized to delete this review' });
    }

    await review.destroy();
    res.status(200).json({
      status : true
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting review' });
  }
};
