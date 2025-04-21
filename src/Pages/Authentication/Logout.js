import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear authentication data
    localStorage.removeItem('authUser');
    
    // Redirect to login page
    navigate('/login');
  }, [navigate]);

  return null;
};

export default Logout; 