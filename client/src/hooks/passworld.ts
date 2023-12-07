import { useState } from 'react';

interface UsePassword {
  password: string,
  isValid: Boolean,
  setPassword: (param: string) => void,
}

export const usePassword = (): UsePassword => {
  const [password, setPassword] = useState('');
  const [isValid, setIsValid] = useState(true);

  const passwordValidation = (value: string) => {
    if (value.trim()) return setIsValid(true);
    return setIsValid(false);
  };

  const handleChange = (value: string) => {
    setPassword(value);
    passwordValidation(value);
  };

  return {
    password,
    isValid,
    setPassword: handleChange,
  };
};
