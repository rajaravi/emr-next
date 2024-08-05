// core
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Alert } from 'react-bootstrap';

// components
import LoginForm from '@/components/forms/LoginForm';
// service
import { login } from '@/services/authService';

const LoginPage = () => {
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await login(email, password);
      if (response.success) {
        // Redirect to a protected page or home
        // window.location.href = '/patient'; // Change as needed
        router.push('/patient'); 
      } else {
        // alert('Login failed. Please check your credentials.');
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
