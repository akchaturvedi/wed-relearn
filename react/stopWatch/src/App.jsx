import { useState, useRef } from "react";
import "./App.css";

function App() {
  const [time, setTime] = useState(0);
  const timeref = useRef(null);

  // Start Timer
  function startTimer() {
    if (!timeref.current) {
      timeref.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
  }

  // Stop Timer
  function stopTimer() {
    if (timeref.current) {
      clearInterval(timeref.current);
      timeref.current = null;
      console.log("Timer stopped");
    }
  }

  // Reset Timer
  function resetTimer() {
    stopTimer();
    setTime(0);
    startTimer();
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white">
      <div className="p-6 bg-gray-800 rounded-lg shadow-lg text-center border-2 border-gray-700">
        <h1 className="text-4xl font-bold mb-4 tracking-widest">
          Digital Stopwatch
        </h1>
        <div className="text-6xl font-mono mb-6">
          {String(Math.floor(time / 60)).padStart(2, "0")}:
          {String(time % 60).padStart(2, "0")}
        </div>
        <div className="space-x-4">
          <button
            onClick={startTimer}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-md"
          >
            Start
          </button>
          <button
            onClick={stopTimer}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md shadow-md"
          >
            Stop
          </button>
          <button
            onClick={resetTimer}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-md shadow-md"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
