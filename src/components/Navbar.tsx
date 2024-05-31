"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if the user is authenticated
    const checkAuth = async () => {
      const response = await fetch('/api/auth/check');
      const data = await response.json();
      setIsAuthenticated(data.isAuthenticated);
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
    });
    setIsAuthenticated(false);
    router.push('/');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <Link href="/">
            <span className="text-white text-2xl font-bold cursor-pointer hover:text-gray-200 transition duration-300">Home</span>
          </Link>
        </div>
        <div>
          {isAuthenticated ? (
            <>
              <Link href="/upload">
                <span className="text-white mx-2 cursor-pointer hover:text-gray-200 transition duration-300">Upload</span>
              </Link>
              <Link href="/history">
                <span className="text-white mx-2 cursor-pointer hover:text-gray-200 transition duration-300">History</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-white mx-2 cursor-pointer hover:text-gray-200 transition duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <span className="text-white mx-2 cursor-pointer hover:text-gray-200 transition duration-300">Login</span>
              </Link>
              <Link href="/register">
                <span className="text-white mx-2 cursor-pointer hover:text-gray-200 transition duration-300">Register</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
