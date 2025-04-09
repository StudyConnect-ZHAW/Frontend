'use client';

import Image from 'next/image';

/**
 * Component representing the panel where users can sign in using their Microsoft account.
 */
export default function AuthPanel() {

  /**
   * Redirects the user to the Express Auth server for Microsoft SSO login.
   */
  const handleLogin = () => {
    // Redirect to the Microsoft SSO login endpoint via Next.js proxy
    window.location.href = '/auth/signin';
  };

    const handlePasswordForgotten = () => {
        // TODO: Implement logic for resetting user password
        console.log("User forgot their password...")
    }

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4 border-4 border-yellow-400 rounded-xl min-h-[25vh]">
      <h1 className="text-4xl">Login</h1>

      <button onClick={handleLogin} className="cursor-pointer">
        <Image
          src="/microsoft-login-button.png"
          alt="Microsoft SSO Login"
          width={320}
          height={54}
          className="w-full h-auto"
        />
      </button>

            <p
                onClick={handlePasswordForgotten}
                className="text-center cursor-pointer hover:underline">
                Forgot password?
            </p>
        </div>
    );
}