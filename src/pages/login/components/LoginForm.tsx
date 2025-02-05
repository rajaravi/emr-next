// core
import React, { useState } from 'react';
import { Container, Alert } from 'react-bootstrap';
// styles
import styles from './LoginForm.module.css'; // Adjust path as necessary

interface LoginFormProps {
  errVal: string,
  onSubmit: (practice: any, username: any, password: any) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, errVal }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [practice, setPractice] = useState<string>('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(practice, username, password);
  };

  return (
    <Container fluid className="d-flex vh-100 login-bg">
      <div className={`${styles.loginContainer} w-100`} style={{ maxWidth: '400px' }}>
        <div className={`${styles.header} mb-4`}>
          <img src='https://acumensoftwares.com/img/vard-logo.png' alt="VARD" height="50" />
        </div>
        {errVal && <Alert variant="danger" className="mb-3">{errVal}</Alert>}
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className="mb-2 mt-2">
            <label htmlFor="practice" className="form-label">Practice</label>
            <div className="input-group">
              <input
                id="practice"
                type="practice"
                className="form-control p-2"
                placeholder="John"
                value={String(practice)}
                onChange={(e) => setPractice(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-2 mt-1">
            <label htmlFor="username" className="form-label">Username</label>
            <div className="input-group">
              <input
                id="username"
                type="username"
                className="form-control p-2"
                placeholder="johnson"
                value={String(username)}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-2 mt-1">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="input-group">
              <input
                id="password"
                type="password"
                className="form-control p-2"
                placeholder="**************"
                value={String(password)}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mt-1">
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
