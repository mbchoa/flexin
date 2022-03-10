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
    <div className="flex items-center justify-center h-screen">
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 flex flex-col"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label
            className="block text-grey-darker text-sm font-bold mb-2"
            htmlFor="magic-code"
          >
            Code
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
            id="magic-code"
            type="text"
            name="magic-code"
            placeholder="123456"
            value={code}
            onChange={handleCodeChange}
            autoFocus
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded"
            type="submit"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default VerifyRequest;
