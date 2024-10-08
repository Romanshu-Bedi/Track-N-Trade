import { SignIn } from '@clerk/clerk-react';
import React from 'react';
import './index.css'

function SignInPage() {
  return (
    <div className="flex justify-center items-center h-screen background-image">
  <SignIn />
</div>

  );
}

export default SignInPage;
