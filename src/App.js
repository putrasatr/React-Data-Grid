import "./App.css";
// import MyApp from "./components";

function App() {
  const arr = new Array(10).fill(3);
  return (
    <>
      {arr.map((item, i) => (
        <div key={i}>{item + Math.random().toString(36)}</div>
      ))}
    </>
  );
}

export default App;
