import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const ImagePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchImage = async () => {
        try {
          const response = await fetch(`/api/images/${id}`);
          if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setImageSrc(url);
          } else {
            setError(`Error: ${response.statusText}`);
          }
        } catch (error) {
          setError(`Error: ${error}`);
        }
      };

      fetchImage();
    }
  }, [id]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {imageSrc ? (
        <img src={imageSrc} alt={`Image ${id}`} />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default ImagePage;
