import React from "react";
const Output = ({ detectionJSON }) => {
  return <pre>{JSON.stringify(detectionJSON, null, 2)}</pre>;
};

export default Output;
