import { useState } from 'react';
import { useFeeneyStore } from '../../libs/store/store';

interface SignInProps {
  needsSignUp: (state: boolean) => void;
  onClose: () => void;
}

export function SignIn(props: SignInProps) {
  const { needsSignUp, onClose } = props;
  const { setUser, setAuthentication, setAccessToken } = useFeeneyStore();
  const [email, setUserEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  const submitLogin = async (evt: any) => {
    evt.preventDefault();

    fetch(`https://feeney.interiordesigntools.com/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((data) => data.json())
      .then((resp) => {
        console.log(resp);
        if (resp.statusCode === 401) {
          setUser(null);
          setAuthentication(false);
          setAccessToken('');
          console.error('Authentication failed ');
        } else {
          setUser(resp.user);
          setAuthentication(true);
          setAccessToken(resp.id);
          sessionStorage.setItem('userData', JSON.stringify(resp));
          onClose();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="m-auto">
      <div className="flex flex-col items-center mb-6">
        <h2 className="w-full text-2xl text-center mb-8">Sign in</h2>
        <form
          onSubmit={submitLogin}
          className={'flex flex-col items-center'}
          name="formLogin"
        >
          <fieldset className="mb-8">
            <input
              type="email"
              placeholder="Email"
              name="email"
              className="form-custom-input"
              required
              onChange={(e) => setUserEmail(e.target.value)}
            />
          </fieldset>
          <fieldset className="mb-8">
            <input
              type="password"
              placeholder="Password"
              name="password"
              className="form-custom-input"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </fieldset>
          <button
            type="submit"
            className="w-24 h-8 text-white cursor-pointer rounded bg-feeney_primary mb-2"
          >
            Sign In
          </button>
        </form>

        <a className="text-sm cursor-pointer hover:underline text-feeney_primary">
          Forgot password or username?
        </a>
        <a
          onClick={() => needsSignUp(true)}
          className="text-sm cursor-pointer text-feeney_primary hover:underline"
        >
          Create a new account
        </a>
      </div>
    </div>
  );
}
