import { AlertCircle, MessageSquare } from "lucide-react";
import React from "react";
import { useParams } from "react-router-dom";
import { Organization, Review, OrganizationService, ReviewService } from "../service/api";
import { ReviewCard } from "./Cards/ReviewCard";
import { ReviewForm } from "./ReviewForm";
import { Alert, AlertDescription } from "./ui/alert";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import OrganizationStats from "./OrganizationStats";
import LoadingSkeleton from "./LoadingSkeleton";

const OrganizationDetail: React.FC = () => {
  const { id } = useParams();
  const [organization, setOrganization] = React.useState<Organization | null>(null);
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadData = React.useCallback(async () => {
    if (!id) return;
    setError(null);

    try {
      const [org, reviewsData] = await Promise.all([
        OrganizationService.get(parseInt(id)),
        ReviewService.getByOrganization(parseInt(id))
      ]);

      setOrganization(org);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error loading organization data:', error);
      setError('Failed to load organization data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleReviewSubmit = (newReview: Review) => {
    setReviews(prevReviews => [newReview, ...prevReviews]);
  };

  const handleReviewDeleted = (reviewId: number) => {
    setReviews(prevReviews => prevReviews.filter(review => review.id !== reviewId));
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Organization not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <header className="bg-white p-8 rounded-xl shadow-sm">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{organization.name}</h1>
          <p className="text-lg text-gray-600 leading-relaxed">{organization.description}</p>
        </header>

        <OrganizationStats reviewCount={reviews.length} averageRating={averageRating} />

        <Card>
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
          </CardHeader>
          <CardContent>
            <ReviewForm
              organizationId={organization.id}
              onReviewSubmitted={handleReviewSubmit}
            />
          </CardContent>
        </Card>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Reviews ({reviews.length})
          </h2>
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map(review => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onReviewDeleted={handleReviewDeleted}
                  onReviewUpdated={(updatedReview) => {
                    setReviews((prevReviews) =>
                      prevReviews.map((r) => (r.id === updatedReview.id ? updatedReview : r))
                    );
                  }}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No reviews yet. Be the first to review!</p>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
};

export default OrganizationDetail;
