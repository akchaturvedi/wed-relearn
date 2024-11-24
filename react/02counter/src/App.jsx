import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  const addhandler = () => {
    // setCount(count + 1);
    // setCount(count + 1);
    // setCount(count + 1);    this code is not able to add 3 in one click

    setCount((prev) => prev + 1);
    setCount((prev) => prev + 1);
    setCount((prev) => prev + 1); /*we need this type of code  */
  };
  const removeHandler = () => {
    setCount(count - 1);
  };

  return (
    <>
      <h1>hello adesh here. this is my {count} day of learning react</h1>
      <h2>day:{count}</h2>
      <button onClick={addhandler}>add day</button>
      <button onClick={removeHandler}>remove day</button>
    </>
  );
}

export default App;

/* React's State Update Mechanism -->

React batches state updates for performance reasons. This means that when you call setCount(count + 1) multiple times in quick succession, React does not immediately update the state after each call. Instead:

It schedules all the updates.
When the state is updated, it only uses the latest value of count at the time the updates are batched.
In the first code snippet:

First call: setCount(count + 1) calculates count + 1 using the current value of count (say, count = 0).
Second call: React hasn't updated count yet, so this setCount(count + 1) still uses the original count value (0).
Third call: Same as above, setCount(count + 1) uses the original count value (0).

After batching, React updates the state once, setting count to 1, instead of incrementing it three times.*/
