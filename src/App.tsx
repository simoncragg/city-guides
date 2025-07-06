import Chat from "./components/Chat";

function App() {

  return (
    <main className="flex flex-col min-h-screen bg-sky-200 px-4 py-8">

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-9xl mb-3">🏙️</div>
        <h1 className="text-3xl font-bold text-gray-700">City Guides</h1>
      </div>

      <div className="flex-1 w-full max-w-screen-lg mx-auto">
        <Chat />
      </div>
    </main>
  )
}

export default App;
