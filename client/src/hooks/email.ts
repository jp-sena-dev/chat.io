import { useState } from 'react';

interface UseEmail {
  email: string,
  isValid: Boolean,
  setEmail: (param: string) => void,
}

export const useEmail = (initialEmail = ''): UseEmail => {
  const [email, setEmail] = useState(initialEmail);
  const [isValid, setIsValid] = useState(true);

  const emailValidation = (value: string) => {
    const pattern = /\S+@\S+\.\S+/;
    if (pattern.test(value)) return setIsValid(true);
    return setIsValid(false);
  };

  const handleChange = (value: string) => {
    setEmail(value);
    emailValidation(value);
  };

  return {
    email,
    isValid,
    setEmail: handleChange,
  };
};
