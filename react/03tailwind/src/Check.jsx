import React from "react";

function Check({ color, children }) {
  return (
    <div>
      <button style={{ backgroundColor: color }}>click me {children}</button>
    </div>
  );
}

export default Check;
