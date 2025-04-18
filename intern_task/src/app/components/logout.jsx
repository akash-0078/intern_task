import { signOut } from 'firebase/auth';
import { auth } from '@lib/firebase';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully!');
      router.push('/login'); // or home, up to you
    } catch (error) {
      toast.error('Error logging out');
      console.error('Logout error:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition"
    >
      Logout
    </button>
  );
}
