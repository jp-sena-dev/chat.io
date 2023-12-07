import { useState } from 'react';

interface UseDoublePassword {
  password: string,
  confirmPassword: string,
  passwordIsValid: Boolean,
  confirmPasswordIsValid: Boolean,
  setPassword: (param: string) => void,
  setConfirmPassword: (param: string) => void,
  resetState: () => void,
}

export const useDoublePassword = (): UseDoublePassword => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [passwordIsValid, setPasswordIsValid] = useState(true);
  const [confirmIsValid, setConfirmIsValid] = useState(true);

  const passwordValidation = (value: string) => {
    const minLength = 6;
    if (value.trim() && value.length >= minLength) {
      if (confirm === value) {
        setConfirmIsValid(true);
      } else if (confirm) {
        setConfirmIsValid(false);
      }
      return setPasswordIsValid(true);
    }
    return setPasswordIsValid(false);
  };

  const confirmValidation = (value: string) => {
    if (value === password && value.trim()) {
      setConfirmIsValid(true);
    } else {
      setConfirmIsValid(false);
    }
  };

  const handleChangePassword = (value: string) => {
    setPassword(value);
    passwordValidation(value);
  };

  const handleChangeConfirm = (value: string) => {
    setConfirm(value);
    confirmValidation(value);
  };

  const resetState = () => {
    setConfirm('');
    setPassword('');
    setPasswordIsValid(true);
    setConfirmIsValid(true);
  };

  return {
    password,
    confirmPassword: confirm,
    passwordIsValid,
    confirmPasswordIsValid: confirmIsValid,
    setPassword: handleChangePassword,
    setConfirmPassword: handleChangeConfirm,
    resetState,
  };
};
