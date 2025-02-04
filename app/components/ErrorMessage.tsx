import React, { PropsWithChildren } from 'react';

const ErrorMessage = ({ children }: PropsWithChildren) => {
  if (!children) return null;

  return <p className="text-sm text-red-500">{children}</p>;
};

export default ErrorMessage;
