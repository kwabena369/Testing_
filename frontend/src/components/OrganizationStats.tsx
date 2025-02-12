import { Star, MessageSquare, Building2 } from "lucide-react";

interface OrganizationStatsProps {
    reviewCount: number;
    averageRating: number;
  }
  
  const OrganizationStats: React.FC<OrganizationStatsProps> = ({ reviewCount, averageRating }) => {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 bg-white p-6 rounded-xl shadow-sm">
        <div className="text-center p-4">
          <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</p>
          <p className="text-sm text-gray-500">Average Rating</p>
        </div>
        <div className="text-center p-4">
          <MessageSquare className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{reviewCount}</p>
          <p className="text-sm text-gray-500">Total Reviews</p>
        </div>
        <div className="text-center p-4 hidden sm:block">
          <Building2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">Active</p>
          <p className="text-sm text-gray-500">Status</p>
        </div>
      </div>
    );
  };
  
  export default OrganizationStats