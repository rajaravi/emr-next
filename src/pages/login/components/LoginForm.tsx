// core
import React, { useState } from 'react';
import { Container, Alert } from 'react-bootstrap';
// styles
import styles from './LoginForm.module.css'; // Adjust path as necessary

interface LoginFormProps {
  errVal: string,
  onSubmit: (practice: string, username: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, errVal }) => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [practice, setPractice] = useState();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(practice, username, password);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <div className={`${styles.loginContainer} w-100`} style={{ maxWidth: '400px' }}>
        <div className={`${styles.header} text-center mb-4`}>
          <h2 className={`${styles.heading} text-center text-primary mb-0`}>EMR</h2>
        </div>
        {errVal && <Alert variant="danger" className="mb-3">{errVal}</Alert>}
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className="mb-3 mt-2">
            <label htmlFor="practice" className="form-label">Practice</label>
            <div className="input-group">
              <input
                id="practice"
                type="practice"
                className="form-control"
                placeholder="Practice name"
                value={practice}
                onChange={(e) => setPractice(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-3 mt-2">
            <label htmlFor="username" className="form-label">Username</label>
            <div className="input-group">
              <input
                id="username"
                type="username"
                className="form-control"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-3 mt-2">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="input-group">
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-3 mt-2">
            <button type="submit" className={`${styles.button} w-100 `}>
              Login
            </button>
          </div>
        </form>
      </div>
    </Container>
  );
};

export default LoginForm;
