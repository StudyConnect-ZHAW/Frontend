'use client';

import Image from 'next/image';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const handleLogin = () => {
    console.log('Redirect to Microsoft login...');
  };

  return (
    <div className={styles.container}>
      <div className={styles.logoFrame}>
        <Image src="/images/logo.png" alt="StudyConnect" width={606} height={372} />
      </div>

      <h1 className={styles.loginTitle}>Login</h1>

      {/* Microsoft Login Button direkt hier */}
      <button onClick={handleLogin} className={styles.microsoftButtonWrapper}>
        <Image src="/images/microsoft-login-button.png" alt="Microsoft SSO Login" width={342} height={54} />
      </button>

      <p className={styles.forgotPassword}>Passwort vergessen?</p>
    </div>
  );
};

export default LoginPage;