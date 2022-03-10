import { useCallback, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import type { FormEvent } from 'react';
import type { NextPage } from 'next';

const SignIn: NextPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const handleEmailChange = useCallback(
    (event: FormEvent<HTMLInputElement>) => {
      setEmail(event.currentTarget.value);
    },
    []
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      try {
        await signIn('email', { email, redirect: false });
        localStorage.setItem('email', email);
        router.push('/auth/verify-request');
      } catch (e) {
        router.push('/api/auth/error?error=AccessDenied');
      }
    },
    [email, router]
  );

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 flex flex-col"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label
            className="block text-grey-darker text-sm font-bold mb-2"
            htmlFor="sign-in-email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
            id="sign-in-email"
            type="email"
            name="email"
            placeholder="email@example.com"
            value={email}
            onChange={handleEmailChange}
            autoFocus
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded"
            type="submit"
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
