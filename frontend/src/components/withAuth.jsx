import React from 'react';
import { useNavigate } from 'react-router-dom';

const withAuth = (Component) => {
  return (props) => {
    const navigate = useNavigate();

    React.useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
      }
    }, [navigate]);

    return <Component {...props} />;
  };
};

export default withAuth;
