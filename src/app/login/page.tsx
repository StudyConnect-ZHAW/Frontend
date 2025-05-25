'use client';

import Image from 'next/image';
import AuthPanel from '@/components/AuthPanel';

const LoginPage = () => {

  return (
    <div className="flex-grow flex flex-col items-center justify-center gap-10">
      {/* Logo */}
      <div className="w-full max-w-[500px]">
        <Image
          src="/logo.png"
          alt="StudyConnect"
          width={600}
          height={600}
          className="w-full h-auto"
          priority
        />
      </div>

      <AuthPanel />
    </div>
  );
};

export default LoginPage;