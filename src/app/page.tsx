'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    // Assume you check for a logged-in state here
    const isLoggedIn = false; // This should come from your authentication logic or context

    // Redirect based on the login status
    if (isLoggedIn) {
      router.push('/dashboard'); // Redirect to a dashboard or home page for logged-in users
    } else {
      router.push('auth/login'); // Redirect to login page for non-logged-in users
    }
  }, [router]);

  return (
    <div className="text-center text-gray-400">
      <p>Redirecting...</p>
    </div>
  );
};

export default Page;
