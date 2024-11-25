import { useState } from "react";
import "./App.css";

function App() {
  const [color, setColor] = useState("olive");

  return (
    <div className=" w-full h-screen" style={{ backgroundColor: color }}>
      <button
        onClick={() => setColor("red")}
        className="bg-red-500 px-4 py-1 rounded-full  shadow-lg text-black   fixed  right-10 top-28 w-20"
      >
        red
      </button>
      <button
        onClick={() => setColor("green")}
        className="bg-green-500 px-4 py-1 rounded-full  shadow-lg text-black   fixed right-10 top-60 w-20"
      >
        green
      </button>
      <button
        onClick={() => setColor("blue")}
        className="bg-blue-500 px-4 py-1 rounded-full  shadow-lg text-black  fixed  right-10 top-96 w-20"
      >
        blue
      </button>
    </div>
  );
}

export default App;
