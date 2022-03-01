import React from "react";

export const ColumnDivider = ({ width = "2px", height = "100%" }) => {
  return (
    <div
      style={{
        backgroundColor: "#1976d2",
        borderRadius: "2px",
        height: height,
        marginLeft: "auto",
        marginRight: "auto",
        width: width,
      }}
    />
  );
};
