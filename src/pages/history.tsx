import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar'; 
import { ClipLoader } from 'react-spinners'; 
import "../app/globals.css";

interface Image {
  id: number;
  blob: string;
  suggestion: Suggestion; 
}

interface Suggestion {
  id: number;
  text: string;
}

const History = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch('/api/auth/check');
      const data = await response.json();
      if (!data.isAuthenticated) {
        router.push('/');
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/images/history');
        if (response.ok) {
          const data: Image[] = await response.json();
          setImages(data);
        } else {
          setError(`Error: ${response.statusText}`);
        }
      } catch (error) {
        setError(`Error: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <>
      <Navbar /> 
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Image History</h1>
        {loading ? (
          <div className="flex items-center justify-center">
            <ClipLoader color="#000" loading={loading} size={35} />
          </div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image) => (
              <div key={image.id} className="border rounded-lg p-2 shadow-md">
                <img
                  src={`data:image/png;base64,${image.blob}`}
                  alt={`Image ${image.id}`}
                  className="w-full h-auto"
                />
                <div className="mt-2">
                  <h2 className="text-lg font-semibold">Suggestion:</h2>
                  <p>{image.suggestion?.text}</p> 
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default History;
