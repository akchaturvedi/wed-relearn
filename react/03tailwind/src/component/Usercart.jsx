import React from "react";

function Usercart({ name, avatar, bio }) {
  return (
    <div className="user-card">
      <img src={avatar} alt={`${name}'s avatar`} />
      <h2>{name}</h2>
      <p>{bio}</p>
    </div>
  );
}

export default Usercart;
