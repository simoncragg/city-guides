import InputBox from "./components/InputBox"

function App() {

  return (
    <div className="text-center">
      <div className="text-9xl mb-3">🏙️</div>
      <h1 className="text-3xl font-bold text-gray-700">City Guides</h1>
      <InputBox onSubmit={(text) => console.log(text)} />
    </div>
  )
}

export default App;
