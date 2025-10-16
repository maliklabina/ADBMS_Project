import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useBookings } from '@/contexts/BookingContext';

export function Debug() {
  const location = useLocation();
  const auth = useAuth();
  const bookings = useBookings();

  useEffect(() => {
    console.group('Debug Info');
    console.log('Current Route:', location.pathname);
    console.log('Auth State:', {
      isAuthenticated: auth.isAuthenticated,
      user: auth.user,
      isAdmin: auth.isAdmin,
      token: localStorage.getItem('token')
    });
    console.log('Bookings State:', {
      bookingsCount: bookings.bookings.length,
      loading: bookings.loading,
      error: bookings.error
    });
    console.groupEnd();
  }, [location.pathname, auth, bookings]);

  if (process.env.NODE_ENV === 'development') {
    return (
      <div 
        style={{ 
          position: 'fixed', 
          bottom: 0, 
          right: 0, 
          backgroundColor: 'rgba(0,0,0,0.8)', 
          color: 'white', 
          padding: '10px', 
          fontSize: '12px',
          zIndex: 9999,
          maxWidth: '300px',
          display: 'none' // Hidden by default, remove to show
        }}
      >
        <pre>
          {JSON.stringify({
            route: location.pathname,
            auth: {
              isAuthenticated: auth.isAuthenticated,
              isAdmin: auth.isAdmin,
              hasToken: !!localStorage.getItem('token')
            },
            bookings: {
              count: bookings.bookings.length,
              loading: bookings.loading,
              error: bookings.error
            }
          }, null, 2)}
        </pre>
      </div>
    );
  }

  return null;
}
