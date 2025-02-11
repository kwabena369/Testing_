import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AuthPage from './components/AuthPage';
import { OrganizationForm } from './components/OrganizationForm';
import { Organization, OrganizationService } from './service/api';
import OrganizationDashboard from './components/OrganizationDashBoard';
import OrganizationsPage from './components/OrganizationsPage';
import Header from './components/Header';
import OrganizationDetail from './components/OrganizationDetail';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            
            {/* Organizations routes - for admin/dashboard views */}
            <Route path="/organizations">
              <Route index element={<OrganizationsPage />} />
              <Route
                path="new"
                element={
                  <OrganizationForm
                    userId={Number(localStorage.getItem('userId'))}
                  />
                }
              />
              <Route path=":id" element={<OrganizationDashboard />} />
            </Route>

            <Route path="/auth" element={<AuthPage />} />
            {/* Organization detail route - for public view with reviews */}
            <Route path="/organization/:id" element={<OrganizationDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Toaster position="bottom-right" />
      </div>
    </Router>
  );
};

// HomePage Component
const HomePage = () => {
  const [organizations, setOrganizations] = React.useState<Organization[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadOrganizations = async () => {
      try {
        const data = await OrganizationService.getAll();
        setOrganizations(data);
      } catch (error) {
        console.error('Failed to load organizations:', error);
      } finally {
        setLoading(false);
      }
    };
    loadOrganizations();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Featured Organizations</h1>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((org) => (
            <Link
              key={org.id}
              to={`/organization/${org.id}`}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">{org.name}</h3>
              <p className="text-gray-600 line-clamp-3">{org.description}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const NotFound = () => {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <Link to="/" className="text-blue-600 hover:underline">
        Return to Home
      </Link>
    </div>
  );
};

export default App;