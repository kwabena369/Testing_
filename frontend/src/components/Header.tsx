import { Link, useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    navigate('/auth');
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-gray-800">
          OrgReview
        </Link>
        <div className="space-x-4">
          <Link to="/" className="text-gray-600 hover:text-gray-800">
            Home
          </Link>
          {userId ? (
            <>
              <Link to="/organizations" className="text-gray-600 hover:text-gray-800">
                Organizations
              </Link>
              <button
                onClick={handleLogout}
                className="text-blue-600 hover:text-blue-800"
                aria-label="Logout"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" className="text-blue-600 hover:text-blue-800">
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
