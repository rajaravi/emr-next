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
      <div style={{ width: '33.4%', display: 'flex', position: 'absolute', left: 0, top: 0, height: '100%' }} >
        <div className={`${styles.loginContainer} w-100`}>
          <div className={`${styles.header} mb-4`}>
            <img src='https://acumensoftwares.com/img/vard-logo.png' alt="VARD" height="75" />
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
                  placeholder="Practice"
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
                  placeholder="Username"
                  value={String(username)}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="mb-2 mt-1">
              <label htmlFor="password" className="form-label col-12">Password <small className='float-end text-primary'>Forgot?</small></label>
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
            <label className='mt-3 text-secondary'>@ 2025 | Company Name</label>
          </form>
        </div>
      </div>
    </Container>
  );
};

export default LoginForm;
