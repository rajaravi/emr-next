export interface LoginResponse {
    success: boolean;    
    error?: string;
    data : {
      email?: string;
      id?: number;
      is_active?: boolean;
      name?: string;
      token?: any;
      refresh_token?: string;
      role_id?: number;
      username?: any;
    }
  }
  
  export const login = async (practice: string, username: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await fetch('http://140.245.29.170/backend/public/api/app/login/'+practice, { // Adjust URL as needed
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const result: LoginResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed', data: {} };
    }
};