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
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="sign-in-email">Email</label>
        <input
          id="sign-in-email"
          autoFocus
          type="email"
          name="email"
          placeholder="email@example.com"
          onChange={handleEmailChange}
          value={email}
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default SignIn;
