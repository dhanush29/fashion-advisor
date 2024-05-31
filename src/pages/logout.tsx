import { useRouter } from 'next/router';

export default function Logout() {
  const router = useRouter();

  const handleLogout = async () => {
    const res = await fetch('/api/auth/logout', {
      method: 'POST',
    });

    if (res.ok) {
      router.push('/login'); 
    } else {
      console.error('Logout failed');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 focus:outline-none"
    >
      Logout
    </button>
  );
}
