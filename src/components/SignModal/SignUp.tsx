import { useState } from 'react';

export function SignUp() {
  const [userType, setUserType] = useState<string>('Homeowner');

  return (
    <div className="m-auto w-10/12">
      <div className="flex flex-col items-center mb-8">
        <h2 className="w-full text-xl text-center mb-8">
          Create a New Account
        </h2>
        <div className="flex justify-center gap-8">
          <div className="flex-1">
            <h4 className="text-xs mb-4">YOUR ACCOUNT INFORMATION</h4>
            <form id="register">
              <input
                type="text"
                placeholder="First name"
                name="first_name"
                className="form-custom-input"
                required
              />
              <input
                type="text"
                placeholder="Last name"
                name="last_name"
                className="form-custom-input"
                required
              />
              <input
                type="email"
                placeholder="Email"
                name="email"
                className="form-custom-input"
                required
              />
              <input
                type="text"
                placeholder="Phone number"
                name="phone"
                className="form-custom-input"
              />
              <input
                type="password"
                placeholder="Password"
                name="password"
                className="form-custom-input"
                required
              />
              <input
                type="password"
                placeholder="Confirm password"
                name="confirm_password"
                className="form-custom-input"
                required
              />
            </form>
          </div>

          <div className="flex-1">
            <h4 className="text-xs mb-4">USER TYPE</h4>
            <div
              onClick={() => setUserType('Homeowner')}
              className={`${
                userType === 'Homeowner'
                  ? 'form-custom-btn-active'
                  : 'form-custom-btn'
              }`}
            >
              Homeowner
            </div>
            <div
              onClick={() => setUserType('Designer/Architect')}
              className={`${
                userType === 'Designer/Architect'
                  ? 'form-custom-btn-active'
                  : 'form-custom-btn'
              }`}
            >
              Designer/Architect
            </div>
            <div
              onClick={() => setUserType('Contractor/Builder')}
              className={`${
                userType === 'Contractor/Builder'
                  ? 'form-custom-btn-active'
                  : 'form-custom-btn'
              }`}
            >
              Contractor/Builder
            </div>
            <div
              onClick={() => setUserType('Steel Fabricator')}
              className={`${
                userType === 'Steel Fabricator'
                  ? 'form-custom-btn-active'
                  : 'form-custom-btn'
              }`}
            >
              Steel Fabricator
            </div>
            <div
              onClick={() => setUserType('Dealer')}
              className={`${
                userType === 'Dealer'
                  ? 'form-custom-btn-active'
                  : 'form-custom-btn'
              }`}
            >
              Dealer
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button className="h-8 px-8 text-white cursor-pointer rounded bg-feeney_primary mb-2">
          Create a New Account
        </button>
      </div>
    </div>
  );
}
