// src/utils/dataUtils.ts
import { Review } from '../service/api';

export const processReviewTrends = (reviews: Review[]) => {
  const monthlyData = Array(6).fill(0).map((_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return {
      name: date.toLocaleString('default', { month: 'short' }),
      reviews: 0
    };
  }).reverse();

  reviews.forEach(review => {
    const reviewDate = new Date(review.createdAt);
    const monthIndex = monthlyData.findIndex(data =>
      data.name === reviewDate.toLocaleString('default', { month: 'short' })
    );
    if (monthIndex !== -1) {
      monthlyData[monthIndex].reviews++;
    }
  });

  return monthlyData;
};

export const processRatingDistribution = (reviews: Review[]) => {
  const distribution = Array(5).fill(0).map((_, i) => ({
    name: `${i + 1} Star${i !== 0 ? 's' : ''}`,
    value: 0
  }));

  reviews.forEach(review => {
    distribution[review.rating - 1].value++;
  });

  return distribution;
};
