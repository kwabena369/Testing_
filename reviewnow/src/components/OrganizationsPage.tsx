import React, { useEffect, useState } from 'react';
import { Link, Navigate, Outlet } from 'react-router-dom';
import { Organization, OrganizationService } from '../service/api';

const OrganizationsPage = () => {
  const userId = localStorage.getItem('userId');
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const data = await OrganizationService.getByUserId(userId);
        setOrganizations(data);
      } catch (error) {
        console.error('Failed to fetch organizations:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchOrganizations();
    }
  }, [userId]);

  if (!userId) {
    return <Navigate to="/auth" />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Organizations</h1>
        <Link
          to="/organizations/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Create New
        </Link>
      </div>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((org) => (
            <Link
              key={org.id}
              to={`/organizations/${org.id}`}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">{org.name}</h3>
              <p className="text-gray-600 line-clamp-3">{org.description}</p>
            </Link>
          ))}
        </div>
      )}
      <Outlet />
    </div>
  );
};

export default OrganizationsPage;
