import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { AlertCircle, TrendingUp, Star, Users, RefreshCw } from 'lucide-react';
import { OrganizationService, ReviewService, Organization, Review } from '../service/api';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';

const OrganizationDashboard = () => {
  const { id } = useParams();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const COLORS = ['#FF8042', '#FFBB28', '#00C49F', '#0088FE', '#8884d8'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [orgData, reviewsData] = await Promise.all([
          OrganizationService.get(Number(id)),
          ReviewService.getByOrganization(Number(id))
        ]);
        setOrganization(orgData);
        setReviews(reviewsData);
        setFilteredReviews(reviewsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // Real-time updates simulation
  useEffect(() => {
    const interval = setInterval(async () => {
      if (organization?.id) {
        try {
          const newReviews = await ReviewService.getByOrganization(organization.id);
          if (newReviews.length !== reviews.length) {
            setReviews(newReviews);
            setLastUpdate(new Date());
          }
        } catch (error) {
          console.error('Error fetching updates:', error);
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [organization?.id, reviews.length]);

  useEffect(() => {
    let filtered = [...reviews];

    if (searchTerm) {
      filtered = filtered.filter(review => 
        review.reviewText?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (ratingFilter !== 'all') {
      filtered = filtered.filter(review => 
        review.rating === parseInt(ratingFilter)
      );
    }

    setFilteredReviews(filtered);
  }, [reviews, searchTerm, ratingFilter]);

  const processReviewTrends = () => {
    const monthlyData = Array(6).fill(0).map((_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        name: date.toLocaleString('default', { month: 'short' }),
        reviews: 0
      };
    }).reverse();

    filteredReviews.forEach(review => {
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

  const processRatingDistribution = () => {
    const distribution = Array(5).fill(0).map((_, i) => ({
      name: `${i + 1} Star${i !== 0 ? 's' : ''}`,
      value: 0
    }));

    filteredReviews.forEach(review => {
      distribution[review.rating - 1].value++;
    });

    return distribution;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const averageRating = filteredReviews.length 
    ? (filteredReviews.reduce((acc, review) => acc + review.rating, 0) / filteredReviews.length).toFixed(1)
    : '0.0';

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{organization?.name}</h1>
          <p className="text-gray-600">{organization?.description}</p>
        </div>
        <Badge variant="outline" className="flex gap-2 items-center">
          <RefreshCw className="h-4 w-4" />
          Updated: {lastUpdate.toLocaleTimeString()}
        </Badge>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-wrap">
            <Input
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                {[1, 2, 3, 4, 5].map(rating => (
                  <SelectItem key={rating} value={rating.toString()}>
                    {rating} Star{rating !== 1 ? 's' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredReviews.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Monthly Trend</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {processReviewTrends()[5]?.reviews || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Review Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart width={500} height={300} data={processReviewTrends()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="reviews" stroke="#8884d8" />
            </LineChart>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart width={500} height={300}>
              <Pie
                data={processRatingDistribution()}
                cx={250}
                cy={150}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {processRatingDistribution().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrganizationDashboard;