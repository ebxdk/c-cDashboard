// pages/welcome.tsx
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for web
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wzmfprzmogvzgbdqlvyn.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6bWZwcnptb2d2emdiZHFsdnluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0NDE1MjksImV4cCI6MjA2ODAxNzUyOX0.eNvKT5zEoxksFIiy2Y4iS03MEsArq74dVDfQT0W7MkA';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Welcome() {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        // Handle the email confirmation from URL
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Verification error:', error);
          setStatus('error');
          setMessage('Email verification failed. Please try again.');
          return;
        }

        if (data.session) {
          // Email verified successfully
          setStatus('success');
          setMessage('Email verified successfully! Redirecting to app...');
          
          // Redirect to mobile app login after 2 seconds
          setTimeout(() => {
            window.location.href = 'myapp://login';
          }, 2000);
        } else {
          // No session found - this shouldn't happen with proper email links
          setStatus('error');
          setMessage('Invalid verification link. Please check your email.');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
      }
    };

    // Start verification immediately when page loads
    handleEmailVerification();
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#B8D4F0',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px',
      textAlign: 'center'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        width: '100%'
      }}>
        {status === 'verifying' && (
          <>
            <div style={{
              width: '60px',
              height: '60px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #2C3E50',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            <h1 style={{ color: '#2C3E50', marginBottom: '10px' }}>Verifying Email</h1>
            <p style={{ color: '#34495E', margin: 0 }}>{message}</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#27AE60',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <span style={{ color: 'white', fontSize: '30px' }}>✓</span>
            </div>
            <h1 style={{ color: '#2C3E50', marginBottom: '10px' }}>Email Verified!</h1>
            <p style={{ color: '#34495E', margin: '0 0 20px 0' }}>{message}</p>
            <p style={{ color: '#34495E', fontSize: '14px', margin: 0 }}>
              Opening your mobile app...
            </p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#E74C3C',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <span style={{ color: 'white', fontSize: '30px' }}>✕</span>
            </div>
            <h1 style={{ color: '#2C3E50', marginBottom: '10px' }}>Verification Failed</h1>
            <p style={{ color: '#34495E', margin: '0 0 20px 0' }}>{message}</p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: '#2C3E50',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Try Again
            </button>
          </>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `
      }} />
    </div>
  );
}
