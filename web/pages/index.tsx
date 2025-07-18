import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to welcome page for email verification
    router.replace('/welcome');
  }, [router]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#B8D4F0',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        color: '#2C3E50'
      }}>
        <h1>Redirecting to email verification...</h1>
      </div>
    </div>
  );
} 