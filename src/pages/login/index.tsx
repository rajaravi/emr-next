// core
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Alert } from 'react-bootstrap';

// components
import LoginForm from './components/LoginForm';
// service
import { login } from '@/services/authService';

const LoginPage = () => {
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (practice: string, email: string, password: string) => {
    try {
      const response = await login(practice, email, password);
      if (response.success) {
        localStorage.setItem("authKey", response.data.token);
        localStorage.setItem("user", response.data.name);
        // Redirect to a protected page or home
        router.push('/patient'); 
      } else {
        setError(response.error || 'Login failed');
      }
    } catch (error) {
      console.error('An error occurred during login:', error);
      alert('An unexpected error occurred.');
    }
  };

  return (
    <div>
        <LoginForm onSubmit={handleLogin} errVal={error} />
    </div>
  );
};

export default LoginPage;
