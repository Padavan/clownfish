import React from "react";

type ErrorMessageProps = {
  message: string | null;
};

const messageStyle = {
  color: "red",
};

export function ErrorMessage({ message }: ErrorMessageProps) {
  if (message === null) {
    return null;
  }

  return <span style={messageStyle}>{message}</span>;
}
