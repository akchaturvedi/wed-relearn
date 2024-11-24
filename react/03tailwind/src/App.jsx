import React from "react";
import "./App.css";
import Usercart from "./component/Usercart";

function App() {
  const users = [
    {
      name: "utkarsh",
      avatar: "./src/assets/img1.jpeg",
      bio: "A passionate web developer and tech enthusiast.",
    },
    {
      name: "adesh",
      avatar: "./src/assets/img2.jpeg",
      bio: "A full-stack developer who loves coffee.",
    },
    {
      name: "swati",
      avatar: "./src/assets/img3.jpeg",
      bio: "A creative UI/UX designer.",
    },
  ];
  return (
    <div className="app">
      {users.map((user, index) => (
        <Usercart
          key={index}
          name={user.name}
          avatar={user.avatar}
          bio={user.bio}
        />
      ))}
    </div>
  );
}

export default App;
