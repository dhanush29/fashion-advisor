import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import "../app/globals.css";
import { ClipLoader } from 'react-spinners';

export default function Upload() {
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return;
    setLoading(true);
    setError(null);
    setSuggestion(null);

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestion(data.suggestion.text);
      } else if (response.status === 400) {
        const data = await response.json();
        alert(data.message);
      } else {
        alert('Image upload failed');
        setSuggestion(null);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-center items-center h-screen">
        <form className="p-8 border rounded-lg shadow-md" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold mb-4">Upload Image</h2>
          <input
            type="file"
            accept="image/*"
            className="w-full border p-2 mb-4"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            disabled={loading}
          >
            Upload
          </button>
        </form>
        {loading && (
          <div className="flex justify-center mt-4">
            <ClipLoader color="#000" loading={loading} size={35} />
          </div>
        )}
        <div className="mt-4 max-h-60 overflow-y-auto">
          {suggestion && (
            <p>Suggestion: {suggestion}</p>
          )}
          {error && (
            <p className="text-red-500">{error}</p>
          )}
        </div>
      </div>
    </>
  );
}
