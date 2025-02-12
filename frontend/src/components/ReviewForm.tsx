import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Label } from '@radix-ui/react-label';
import { Textarea } from './ui/textarea';
import { Review, ReviewService } from '../service/api';
import { Star, AlertCircle, Loader2, LogIn } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { Card } from './ui/card';
import { useNavigate } from 'react-router-dom';

interface ReviewFormProps {
  organizationId: number;
  onReviewSubmitted?: (review: Review) => void;
  onError?: (error: Error) => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  organizationId,
  onReviewSubmitted,
  onError
}) => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [characterCount, setCharacterCount] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const minCharacters = 10;

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!userId) {
      setError('Please log in to submit a review');
      return;
    }

    if (comment.length < minCharacters) {
      setError(`Please write at least ${minCharacters} characters`);
      return;
    }

    setIsSubmitting(true);

    try {
      const newReview = await ReviewService.create({
        rating,
        reviewText: comment,
        organizationId,
        userId: parseInt(userId)
      });

      setRating(5);
      setComment('');
      setCharacterCount(0);
      onReviewSubmitted?.(newReview);
    } catch (error) {
      console.error('Review submission failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit review';
      setError(errorMessage);
      onError?.(error as Error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarClick = (value: number) => {
    if (!userId) {
      setError('Please log in to rate');
      return;
    }
    setRating(value);
    setError(null);
  };

  const handleStarHover = (value: number | null) => {
    setHoveredRating(value);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!userId) {
      setError('Please log in to write a review');
      return;
    }
    setComment(e.target.value);
    setCharacterCount(e.target.value.length);
    if (error && e.target.value.length >= minCharacters) {
      setError(null);
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  if (!userId) {
    return (
      <Card className="overflow-hidden">
        <div className="p-6 text-center space-y-4">
          <LogIn className="w-12 h-12 mx-auto text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900">Sign in to Review</h3>
          <p className="text-gray-600">Please log in or create an account to share your experience</p>
          <Button
            onClick={handleLoginClick}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Sign In to Continue
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        <div className="space-y-4">
          <Label
            htmlFor="review-rating"
            className="text-sm font-semibold text-gray-700 flex items-center gap-1"
          >
            Rating <span className="text-red-500">*</span>
          </Label>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleStarClick(value)}
                  onMouseEnter={() => handleStarHover(value)}
                  onMouseLeave={() => handleStarHover(null)}
                  className="focus:outline-none transform hover:scale-110 transition-transform"
                  disabled={isSubmitting}
                  aria-label={`Rate ${value} stars`}
                >
                  <Star
                    size={28}
                    className={`transition-colors duration-200 ${
                      (hoveredRating !== null ? value <= hoveredRating : value <= rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500">Click on the stars to rate</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label
              htmlFor="review-comment"
              className="text-sm font-semibold text-gray-700 flex items-center gap-1"
            >
              Your Review <span className="text-red-500">*</span>
            </Label>
            <span className={`text-sm ${characterCount < minCharacters ? 'text-red-500' : 'text-gray-500'}`}>
              {characterCount}/{minCharacters}+ characters
            </span>
          </div>
          <Textarea
            id="review-comment"
            value={comment}
            onChange={handleCommentChange}
            placeholder="Share your experience with this organization... (minimum 10 characters)"
            rows={4}
            disabled={isSubmitting}
            className="resize-none w-full p-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          disabled={isSubmitting || comment.length < minCharacters}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Submitting...</span>
            </div>
          ) : (
            'Submit Review'
          )}
        </Button>
      </form>
    </Card>
  );
};
