'use client';

import Image from 'next/image';
import styles from './login.module.css';

const LoginPage = () => {
  const handleLogin = () => {
    // TODO: Implement full login logic here
    console.log('Redirect to Microsoft login...');
  };

  return (
    <div className={styles.container}>
      <div className={styles.logoFrame}>
        <Image src="/logo.png" alt="StudyConnect" width={606} height={372} style={{ width: '100%', height: 'auto' }} priority={true}/>
      </div>

      <h1 className={styles.loginTitle}>Login</h1>

      <button onClick={handleLogin} className={styles.microsoftButtonWrapper}>
        <Image src="/microsoft-login-button.png" alt="Microsoft SSO Login" width={320} height={54} style={{ width: '100%', height: 'auto' }} />
      </button>

      <p className={styles.forgotPassword}>Passwort vergessen?</p>
    </div>
  );
};

export default LoginPage;