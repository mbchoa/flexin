import { useCallback, useState } from 'react';
import { signIn } from 'next-auth/react';
import type { FormEvent } from 'react';
import type { NextPage } from 'next';

const SignIn: NextPage = () => {
  // TODO: handle errors
  // const { query } = useRouter();
  // const { error } = query;

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
      await signIn('email', { email });
      localStorage.setItem('email', email);
    },
    [email]
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
