export interface LoginResponse {
    success: boolean;
    token?: string;
    error?: string;
  }
  
  export const login = async (practice: string, username: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await fetch('http://localhost/emr-backend/public/api/app/login/'+practice, { // Adjust URL as needed
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data: LoginResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };
  