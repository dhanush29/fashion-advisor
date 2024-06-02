import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import { ClipLoader } from 'react-spinners';
import Image from 'next/image';
import "../app/globals.css";

interface ImageData {
  id: number;
  blob: string;
  suggestion: Suggestion;
}

interface Suggestion {
  id: number;
  text: string;
}

const History = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [credits, setCredits] = useState<number>(0); 
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch('/api/auth/check');
      const data = await response.json();
      if (!data.isAuthenticated) {
        router.push('/');
      }
      else
      {
        fetchCredits();
      }
    };

    const fetchCredits = async () => {
      const response = await fetch('/api/user/credits');  
      const data = await response.json();
      setCredits(data.credits);
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/images/history');
        if (response.ok) {
          const data: ImageData[] = await response.json();
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
      <Navbar credits={credits} />
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Images List</h2>

          {loading ? (
            <div className="flex items-center justify-center">
              <ClipLoader color="#000" loading={loading} size={35} />
            </div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {images.map((image) => (
                <div key={image.id} className="group relative">
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                    <Image
                      src={`data:image/png;base64,${image.blob}`}
                      alt={`Image ${image.id}`}
                      width={300}
                      height={200}
                      className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                    />
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div>
                      <h3 className="text-sm text-gray-700">
                        <span aria-hidden="true" className="absolute inset-0" />
                        Suggestion
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">{image.suggestion?.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default History;
