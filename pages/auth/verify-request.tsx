import { FormEvent, useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';

const VerifyRequest: NextPage = () => {
  const router = useRouter();
  const [code, setCode] = useState('');

  const handleCodeChange = useCallback((event: FormEvent<HTMLInputElement>) => {
    setCode(event.currentTarget.value);
  }, []);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const location = `/api/auth/callback/email?email=${encodeURIComponent(
        localStorage.getItem('email') as string
      )}&token=${code}&callbackUrl=${process.env.NEXT_PUBLIC_URL}`;
      router.replace(location);
      localStorage.removeItem('email');
    },
    [code, router]
  );

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label className="section-header" htmlFor="magic-code">
          Code
        </label>
        <input
          id="magic-code"
          autoFocus
          type="text"
          name="magic-code"
          value={code}
          onChange={handleCodeChange}
          placeholder="123456"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default VerifyRequest;
