import React, { useState } from 'react';
import { Review, ReviewService } from '../../service/api';
import { Star, MoreVertical, Edit2, Trash2, Loader2 } from 'lucide-react';

import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { DialogHeader, DialogFooter } from '../ui/dialog';

interface ReviewCardProps {
  review: Review;
  onReviewUpdated?: (updatedReview: Review) => void;
  onReviewDeleted?: (reviewId: number) => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review: initialReview,
  onReviewUpdated,
  onReviewDeleted
}) => {
  const [review, setReview] = useState(initialReview);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedRating, setEditedRating] = useState(review.rating);
  const [editedComment, setEditedComment] = useState(review.reviewText || '');
  const [error, setError] = useState<string | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const currentUserId = localStorage.getItem('userId');
  const isOwner = currentUserId && parseInt(currentUserId) === review.userId;

  const resetForm = () => {
    setEditedRating(review.rating);
    setEditedComment(review.reviewText || '');
    setError(null);
  };

  const handleModalClose = () => {
    resetForm();
    setIsEditModalOpen(false);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await ReviewService.delete(review.id, currentUserId);
      onReviewDeleted?.(review.id); // Notify parent component
    } catch (error) {
      console.error('Failed to delete review:', error);
      setError('Failed to delete review. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async () => {
    if (!editedComment.trim()) {
      setError('Review text cannot be empty');
      return;
    }

    try {
      setIsEditing(true);
      setError(null);

      const updatedReview = await ReviewService.update(review.id, {
        rating: editedRating,
        reviewText: editedComment.trim(),
        userId: parseInt(currentUserId!)
      });

      setReview(updatedReview);
      onReviewUpdated?.(updatedReview);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Failed to update review:', error);
      setError('Failed to update review. Please try again.');
    } finally {
      setIsEditing(false);
    }
  };

  const renderStars = (rating: number, size = 16, interactive = false) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => interactive && setEditedRating(value)}
          onMouseEnter={() => interactive && setHoveredRating(value)}
          onMouseLeave={() => interactive && setHoveredRating(null)}
          disabled={!interactive}
          className={`focus:outline-none ${
            interactive ? 'transform hover:scale-110 transition-transform' : ''
          }`}
        >
          <Star
            size={size}
            className={`transition-colors duration-200 ${
              (interactive && hoveredRating !== null
                ? value <= hoveredRating
                : value <= rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <>
      <Card className="hover:shadow-lg transition-all duration-300">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            {renderStars(review.rating)}

            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                  <DropdownMenuItem
                    onClick={() => setIsEditModalOpen(true)}
                    className="cursor-pointer"
                  >
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="cursor-pointer text-destructive focus:text-destructive"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="mr-2 h-4 w-4" />
                    )}
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <p className="text-gray-700 leading-relaxed mt-2">{review.reviewText}</p>

          <div className="mt-4 text-sm text-gray-500">
            {new Date(review.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </Card>

      <Dialog open={isEditModalOpen} onOpenChange={handleModalClose}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Your Review</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Rating</label>
              <div className="flex items-center">
                {renderStars(editedRating, 24, true)}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Your Review</label>
              <Textarea
                value={editedComment}
                onChange={(e) => setEditedComment(e.target.value)}
                placeholder="Share your thoughts about this item..."
                rows={4}
                className="resize-none"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter className="flex space-x-2 justify-end">
            <Button
              variant="outline"
              onClick={handleModalClose}
              disabled={isEditing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={isEditing}
              className="bg-primary hover:bg-primary/90"
            >
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
