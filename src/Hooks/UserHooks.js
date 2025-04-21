import { useState, useEffect } from 'react';
import { getLoggedinUser } from '../helpers/api_helper';

export const useProfile = () => {
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const user = getLoggedinUser();
        
        if (!user) {
          setUserProfile(null);
          setLoading(false);
          return;
        }

        // Check if token is expired
        if (user.token) {
          const tokenData = JSON.parse(atob(user.token.split('.')[1]));
          if (tokenData.exp * 1000 < Date.now()) {
            // Token expired
            localStorage.removeItem('authUser');
            setUserProfile(null);
            setLoading(false);
            return;
          }
        }

        setUserProfile(user);
        setLoading(false);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setUserProfile(null);
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { userProfile, loading };
};
