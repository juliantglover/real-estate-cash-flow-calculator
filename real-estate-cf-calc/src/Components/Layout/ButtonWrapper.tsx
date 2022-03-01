import React from "react";

export const ButtonWrapper = ({ text, type, disabled }) => {
  return (
    <button
      type={type}
      disabled={disabled}
      style={{
        marginLeft: "auto",
        marginRight: "auto",
        display: "block",
        width: "50%",
      }}
    >
      {text}
    </button>
  );
};
