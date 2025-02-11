import { Link } from "react-router-dom";

const Header = () => {
  const userId = localStorage.getItem('userId');

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
                onClick={() => {
                  localStorage.removeItem('userId');
                  localStorage.removeItem('userEmail');
                  window.location.href = '/auth';
                }}
                className="text-blue-600 hover:text-blue-800"
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

export default Header