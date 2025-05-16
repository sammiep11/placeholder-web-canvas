import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">This isn't a real website, dumbass</h1>
        <p className="text-xl text-gray-600 mb-4">Ain't nobody have time to build out all these links</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to the only active page
        </a>
      </div>
    </div>
  );
};

export default NotFound;
